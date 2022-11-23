import knex from "../../../../database/database.knex"
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(isSameOrAfter).extend(advancedFormat);


import { 
    putNumberOfRecurrence,
    onlyDefaulters,
    calcReadjustment,
    applyPaymentFine,
    comparisonAccountDate
} from "../functions/functions"

import { 
    generateInstallmentsDaily,
    generateInstallmentsWeekly,
    generateInstallmentsMonthly,
    generateInstallmentsYealy
} from "../functions/recurrenceFunctions";


// ( async () => {
//     try {
//         await knex("entities as e")
//             .del()
//             .where({ "e.company_id": "PNU4DZBXOvdmtuGN" })
//             .andWhere("roles", "!=", "client")
//             .andWhereRaw("registration_code is not null")

//         console.log("done")
//     } catch (error) {
//         console.log(error)        
//     }
// })

export async function getAllAccounts(company_id, req_query){
    // console.log(req_query)
    if(!company_id) 
        throw new Error("companyID necessario");

    const query = {
        search: "",
        start_date: "",
        end_date: "",
        type: "",
        payment_state: "",
        cost_center: "",
        chart_account: "",
        entity: "",
        asset_id: "",
        wasPaid: ""
    }
    // defaulters === inadimplentes
    let { search, start_date, end_date, type, payment_state, cost_center_id, cost_center_path, chart_account, entity, defaulters, cost_center_opts } = req_query;
    
    const sigleDate = start_date === end_date;
    if(sigleDate){
        const dayOfWeek = dayjs(start_date).day() //segunda
        if(dayOfWeek === 1 && payment_state !== "1"){
            start_date = dayjs(end_date).subtract(3, "day").format("YYYY-MM-DD")
        }
    }

    if(search){
        query.search = knex.raw("bt.name ILIKE ?", [`%${ search }%`])
    }

    if(isValidDate(start_date)){
        if(payment_state === "1")
            query.start_date = knex.raw("bt.paid_at >= ?::date", [ start_date ])
        if(payment_state === "2")
            query.start_date = knex.raw("bt.due_date >= ?::date", [ start_date ])
    }

    if(isValidDate(end_date)){
        if(payment_state === "1")
            query.end_date = knex.raw("bt.paid_at <= ?::date", [ end_date ])
        if(payment_state === "2")
            query.end_date = knex.raw("bt.due_date <= ?::date", [ end_date ])
    }

    switch(type){
        case "inflow": query.type = knex.raw("bt.type = 'inflow'"); break
        case "outflow": query.type = knex.raw("bt.type = 'outflow'"); break
        default: query.type = ""
    }

    if(cost_center_path){
        const opts = cost_center_opts ? cost_center_opts.split(";") : ["0","1","0"]
        let operation = "";
        
        if(opts[1] === "1"){
            // below and equal
            if(opts[0] === "1" ) operation += "@>";
            // above and equal
            else if(opts[2] === "1") operation += "<@"
            else operation += "="
        }else{
            // below and equal
            if(opts[0] === "1" ) operation += "<";
            // above and equal
            else if(opts[2] === "1") operation += ">"
            else operation += "="
        }
        query.cost_center = knex.raw(`cc.path ${ operation } ?`, [ cost_center_path ])
    }

    if(cost_center_id ){
        query.cost_center = knex.raw(`bt.cost_center_id = ?`, [ cost_center_id ])
    }

    if(chart_account){
        query.chart_account = knex.raw("bt.chart_account_id = ?", [ chart_account ])
    }

    if(entity){
        query.entity = knex.raw("bt.entity_id = ?", [ entity ])
    }

    let response;

    switch(payment_state){
        // somente recorrencias
        case "0": {
            response = await fetchForecastTransactions(company_id, req_query, query)
            break
        }
        // somentes as realizadas
        case "1": {
            query.wasPaid = knex.raw("bt.paid_at is not null");
            response = await fetchRealizedTransactions(company_id, query)
            break
        }
        // as recorrentes e lancadas nao realizadas
        case "2":{
            const [ realized, forecast ] = await Promise.all([
                fetchRealizedTransactions(company_id, query),
                fetchForecastTransactions(company_id, req_query, query)
            ])
            response = [ ...realized, ...forecast ]
                .reduce(comparisonAccountDate, [])
                .filter( trx => !trx.paid_at );
            break
        }
    }
    if(!response || !response.length) return []

    return response
        .map(calcReadjustment)
        .map(applyPaymentFine)
        .map(putNumberOfRecurrence)
        .filter(onlyDefaulters(defaulters))
}

async function fetchRealizedTransactions(company_id, query){
    const transactions = await knex("financial_scheme.bank_transactions as bt")
        .select([
            "bt.id",
            "bt.recurrence_template_id",
            "bt.name",
            "bt.type",
            "bt.due_date",
            "bt.billing_date",
            "bt.paid_at",
            // 
            "bt.type_late_fee",
            "bt.late_fee",
            "bt.type_monetary_correction",
            "bt.monetary_correction",
            "bt.frequency_monetary_correction",
            // 
            "cc.name as cost_center_name", 
            "ca.short_description as chart_account_name",
            knex.raw("CAST(bt.amount AS FLOAT) as amount"),
            knex.raw("CAST(bt.forecast_amount AS FLOAT) as forecast_amount"),
            // 
            "btbs.id as slip_id",
            "btbs.billing_date as slip_billing_date",
            "btbs.due_date as slip_due_date",
            "btbs.paid_date as slip_paid_date",
            // 
            "e.name as entity_name"
        ])
        .leftJoin("cost_center as cc", "cc.id", "bt.cost_center_id")
        .leftJoin("chart_accounts as ca", "ca.id", "bt.chart_account_id")
        .leftJoin("entities as e", "e.id", "bt.entity_id")
        .leftJoin("financial_scheme.bank_transaction_bank_slips as btbs", "btbs.id", function(){
            this.select("id")
                .from("financial_scheme.bank_transaction_bank_slips")
                .where("transaction_id", "=", knex.raw("bt.id"))
                .orderBy("created_at", "asc")
                .limit(1)
        })
        .whereRaw(query.start_date)
        .andWhereRaw(query.end_date)
        .andWhereRaw(query.search)
        .andWhereRaw(query.type)
        .andWhereRaw(query.cost_center)
        .andWhereRaw(query.chart_account)
        .andWhereRaw(query.entity)
        .andWhereRaw(query.wasPaid) 
        .andWhere({ "bt.company_id": company_id })
        .limit(500)

    return transactions
} 

async function fetchForecastTransactions(company_id, req_query, query){
    const recurrence = await knex("financial_scheme.recurrence_template as bt")
        .select([
            "bt.id",
            "bt.type",
            "bt.name",
            "bt.description",
            "bt.currency_code",
            "bt.due_date",
            "bt.billing_date",
            "bt.start_date",
            "bt.end_date",
            "bt.frequency",
            "bt.repetions",
            "bt.total_amount",
            "bt.type_late_fee",
            "bt.late_fee",
            "bt.type_monetary_correction",
            "bt.monetary_correction",
            "bt.frequency_monetary_correction",
            "bt.readjustment_content",
            "cc.name as cost_center_name", 
            knex.raw("CAST(bt.amount AS FLOAT) as forecast_amount"),
            "e.name as entity_name"
        ])
        .leftJoin("cost_center as cc", "cc.id", "bt.cost_center_id")
        .leftJoin("entities as e", "e.id", "bt.entity_id")
        .whereRaw(query.search)
        .andWhereRaw(query.cost_center)
        .andWhereRaw(query.chart_account)
        .andWhereRaw(query.type)
        .andWhereRaw(query.entity)
        .andWhere({ "bt.company_id": company_id, "bt.enabled": true })
        .limit(500)
       
    // Em caso de alguma recorrencia ser infinita
    // define um fim para a mesma
    const recurrenceWithLongestDate = (recurrence && recurrence.length) && recurrence.reduce(function(prev, current) {
        return new Date(prev.end_date) > new Date(current.end_date) ? prev : current; 
    });

    const trxs = recurrence.map( recurrence => {
        let dtstart, until;

        // se start date query 
        if(req_query.start_date && dayjs(req_query.start_date).isAfter(recurrence.start_date)){
            dtstart = dayjs(req_query.start_date).toDate()
        }else{
            dtstart = dayjs(recurrence.start_date).toDate()
        }
        
        if(!recurrence.end_date || dayjs(req_query.end_date).isBefore(recurrence.end_date)){
            if(req_query.end_date)
                until = dayjs(req_query.end_date).toDate()
            else
                until = recurrenceWithLongestDate.end_date ? recurrenceWithLongestDate.end_date : dayjs().endOf("year").toDate()
        }else{
            until = dayjs(recurrence.end_date).toDate()
        }
         
        const options = { dtstart, until }

        switch(recurrence.frequency){
            case "daily": return generateInstallmentsDaily(recurrence, options)
            case "weekly": return generateInstallmentsWeekly(recurrence, options)
            case "monthly": return generateInstallmentsMonthly(recurrence, 1, options)
            case "every_two_months": return generateInstallmentsMonthly(recurrence, 2, options)
            case "every_three_months": return generateInstallmentsMonthly(recurrence, 3, options)
            case "every_four_months": return generateInstallmentsMonthly(recurrence, 4, options)
            case "every_six_months": return generateInstallmentsMonthly(recurrence, 6, options)
            case "yearly": return generateInstallmentsYealy(recurrence, options)
        }
    })
    return flatten(trxs).filter( trx => typeof trx !== "undefined" ).filter( trx => {
        const { start_date, end_date } = req_query
        if(!start_date || !end_date) return trx;
        const date = dayjs(trx.due_date);
        return date.isSameOrAfter(dayjs(start_date)) && date.isSameOrBefore(dayjs(end_date))
    })
}

// 
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

// YYYY-MM-DD
function isValidDate(date){
    if(!date) 
        return false;

    return /(\d{4})-?(\d{2})?-(\d{2})/.test(date)
}



// se ja tiver transacao edita senao cria
export async function generatePaymentTransaction(req_body){
    if(!req_body || !req_body.id || !req_body.due_date)
        throw new Error("Entrada mal formatada!")
        
    if(req_body.isRecurrence){
        const [ recurrence ] = await knex("financial_scheme.recurrence_template").select("*").where({ id: req_body.id })

        const transaction = {
            id: nanoid(),
            company_id: recurrence.company_id,
            cost_center_id: recurrence.cost_center_id,
            chart_account_id: recurrence.chart_account_id,
            entity_id: recurrence.entity_id,
            account_id: recurrence.account_id,
            recurrence_template_id: recurrence.id,
            type: recurrence.type,
            name: recurrence.name,
            currency_code: "BRL",
            // 
            type_late_fee: recurrence.type_late_fee,
            late_fee: recurrence.late_fee,
            monetary_correction: recurrence.monetary_correction,
            type_monetary_correction: recurrence.type_monetary_correction,
            frequency_monetary_correction: recurrence.frequency_monetary_correction,
            // 
            description: req_body.description,
            payment_method: req_body.payment_method,
        }
        
        if(req_body.forecast_amount) transaction.forecast_amount = req_body.forecast_amount;
        if(req_body.amount) transaction.amount = req_body.amount;

        if(req_body.paid_at) transaction.paid_at = req_body.paid_at;
        if(req_body.due_date) transaction.due_date = req_body.due_date;
        if(req_body.billing_date) transaction.billing_date = req_body.billing_date;

        const [ result ] = await knex("financial_scheme.bank_transactions").insert(transaction).returning("*")

        return result;

    }else{
        const allowedKeys = [
            "description",
            "forecast_amount",
            "amount",
            "payment_method",
            "due_date",
            "billing_date",
            "paid_at"
        ]
        const transaction = filterKeys(allowedKeys, req_body, { updated_at: "now()" })
    
        if(!Object.entries(transaction).length)
            throw new Error("Body vazio")
    
        const [result] = await knex("financial_scheme.bank_transactions")
            .update(transaction)
            .where({ id: req_body.id })
            .returning("*")
    
        return result
    }
}