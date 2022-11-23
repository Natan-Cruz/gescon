import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import GesconError from "../../../../utils/GesconError"
import dayjs from "dayjs";
import { applyPaymentFine, calcReadjustment } from "../../accounting/functions/functions";

export async function getAllTransactions(company_id, req_query){
    if(!company_id) 
        throw new Error("companyID necessario");

    const query = {
        search: "",
        start_date: "",
        end_date: "",
        reconciled: "",
        paid: ""
    }
    
    const { search, start_date, end_date, reconciled, paid } = req_query;

    if(search){
        query.search = knex.raw("bnkccs.name ILIKE ?", [`%${ search }%`])
    }

    if(start_date){
        if(!/(\d{4})-?(\d{2})?-(\d{2})/.test(start_date))
            throw new Error("Formatacao de start_date errado")

        query.start_date = knex.raw("(bt.due_date >= ?::date OR bt.billing_date >= ?::date OR bt.paid_at >= ?::date)", [ start_date, start_date, start_date ])
    }

    if(end_date){
        if(!/(\d{4})-?(\d{2})?-(\d{2})/.test(end_date))
            throw new Error("Formatacao de end_date errado");

        query.end_date = knex.raw("(bt.due_date <= ?::date OR bt.billing_date <= ?::date OR bt.paid_at <= ?::date)", [ end_date, end_date, end_date ])
    }

    if(reconciled && (reconciled === "0" || reconciled === "1")){
        const boolean = new Boolean(parseInt(reconciled))
        query.reconciled = knex.raw("bt.reconciled = ?", [ boolean ])
    }

    if(paid && (paid === "0" || paid === "1")){
        if(parseInt(paid))
            query.paid = knex.raw("bt.paid_at is not null")
        else
            query.paid = knex.raw("bt.paid_at is null")
    }

    const transactions = await knex("financial_scheme.bank_transactions as bt")
        .select("bt.*", "bnkccs.name as account_name")
        .innerJoin("financial_scheme.bank_accounts_or_credit_cards as bnkccs", "bnkccs.id", "bt.account_id")
        .whereRaw(query.start_date)
        .andWhereRaw(query.end_date)
        .andWhereRaw(query.reconciled)
        .andWhereRaw(query.paid)
        .andWhereRaw(query.search)
        .andWhere({ "bt.company_id": company_id })
        .orderBy("created_at", "asc")

    return transactions
}

export async function getOneTransaction(transaction_id){
    if(!transaction_id)
        throw new Error("transaction_id não ausente!")

    const [ transaction ] = await knex("financial_scheme.bank_transactions")
        .select("*", knex.raw("CAST(amount AS FLOAT) as amount"))
        .where({ id: transaction_id })
        .limit(1)

    const [ recurrence ] = await knex("financial_scheme.recurrence_template")
        .select("*", knex.raw("CAST(amount AS FLOAT) as amount"))
        .where({ id: transaction_id })
        .limit(1)

    if(!transaction && !recurrence)
        throw new GesconError("Transação não encontrada")

    if(transaction){
        const bankSlips = await knex("financial_scheme.bank_transaction_bank_slips")
            .select("*")
            .where({ transaction_id: transaction.id })
            .orderBy("created_at", "asc")
            
        return {
            ...transaction,
            hasRecurrence: false,
            wasPaid: transaction.paid_at ? true: false,
            chargeInterest: (transaction.late_fee && transaction.monetary_correction),
            bank_slips: bankSlips
        }
    } 

    if(recurrence){
        return {
            ...recurrence,
            hasRecurrence: true,
            hasReadjustment: recurrence.readjustment_content ? true : false,
            chargeInterest: (recurrence.late_fee && recurrence.monetary_correction)
        }
    }
}



export async function getOneTransactionShow(transaction_id){
    if(!transaction_id)
        throw new Error("transaction_id não ausente!")

    // recurrence id
    let trxId, recurrenceDate;
    if(transaction_id.length === 28){
        const [id, date] = transaction_id.split("__");
        trxId = id;
        recurrenceDate = date;
    }else{
        trxId = transaction_id;
    }

    const [ transaction ] = await knex("financial_scheme.bank_transactions as bt")
        .select(
            "bt.id",
            "bt.recurrence_template_id",
            "rt.frequency",
            "bt.name",
            "bt.description",
            "bt.type",
            "bt.forecast_amount",
            "bt.payment_method",
            "bt.amount",
            "bt.paid_at",
            "bt.due_date",
            "bt.billing_date",
            // 
            "bt.type_late_fee",
            "bt.late_fee",
            "bt.type_monetary_correction",
            "bt.monetary_correction",
            "bt.frequency_monetary_correction",
            // 
            "rt.start_date",
            "rt.end_date",
            "e.id as customer_id", 
            "e.name as customer_name", 
            "cc.name as cost_center_name"
        )
        .leftJoin("public.entities as e", "e.id", "bt.entity_id")
        .leftJoin("financial_scheme.recurrence_template as rt", "rt.id", "bt.recurrence_template_id")
        .leftJoin("cost_center as cc", "cc.id", "bt.cost_center_id")
        .where({ "bt.id": trxId })
        .limit(1)

    const [ recurrence ] = await knex("financial_scheme.recurrence_template as rt")
        .select(
            "rt.id",
            "rt.name",
            "rt.description",
            "rt.type",
            "rt.frequency",
            "rt.start_date",
            "rt.end_date",
            "rt.amount as forecast_amount",
            "rt.payment_method",
            "rt.due_date",
            "rt.billing_date",
            // 
            "rt.type_late_fee",
            "rt.late_fee",
            "rt.type_monetary_correction",
            "rt.monetary_correction",
            "rt.frequency_monetary_correction",
            "rt.readjustment_content",
            // 
            "e.id as customer_id", 
            "e.name as customer_name", 
            "cc.name as cost_center_name"
        )
        .leftJoin("public.entities as e", "e.id", "rt.entity_id")
        .leftJoin("cost_center as cc", "cc.id", "rt.cost_center_id")
        .where({ "rt.id": trxId })
        .limit(1)

    if(!transaction && !recurrence)
        throw new GesconError("Transação não encontrada")

    if(transaction){
        const bankSlips = await knex("financial_scheme.bank_transaction_bank_slips")
            .select("*")
            .where({ transaction_id: transaction.id })
            .orderBy("created_at", "asc")

        transaction.hasRecurrence = false,
        transaction.bank_slips = bankSlips

        if(transaction.recurrence_template_id)
            transaction.installment = putNumberOfRecurrence(transaction)

        let trx = applyPaymentFine(transaction)
        trx = calcReadjustment(trx)
        return trx
    } 

    if(recurrence){
        recurrence.hasRecurrence = true;
        recurrence.due_date = recurrenceDate.replace(/_/g, "-");
        recurrence.installment = putNumberOfRecurrence(recurrence)

        let trx = applyPaymentFine(recurrence)
        trx = calcReadjustment(trx)

        return trx
    }
}

// Coloca numero da parcela ao lado no nome
export function putNumberOfRecurrence({frequency, start_date, end_date, due_date}){
            
    let unit, quantity_installments = 1;
    switch(frequency){
        case "daily": unit = "day"; break
        case "weekly": unit = "week"; break
        case "monthly": unit = "month"; break
        case "every_two_months": quantity_installments = 2; break
        case "every_three_months": quantity_installments = 3; break
        case "every_four_months": quantity_installments = 4; break
        case "every_six_months": quantity_installments = 6; break
        case "yearly": unit = "year"
    }

    const diff = dayjs(due_date).diff(start_date, unit)
    const repetions = dayjs(end_date).diff(start_date, unit)
    if(!repetions)
        return "";

    const result = diff / quantity_installments
    return `${ result + 1 }/${ repetions }`
}

export async function createTransaction(req_body){
    if(!req_body)
        throw new Error("req_body necessario em")

    const transactions = []

    const trx = {
        id: nanoid(),
        company_id: req_body.company_id,
        cost_center_id: req_body.cost_center_id,
        chart_account_id: req_body.chart_account_id,
        entity_id: req_body.entity_id,
        account_id: req_body.account_id,
        type: req_body.type,
        name: req_body.name,
        description: req_body.description,
        payment_method: req_body.payment_method,
        due_date: req_body.due_date
    }

    if(req_body.paid_at) trx.paid_at = req_body.paid_at;
    if(req_body.billing_date) trx.billing_date = req_body.billing_date;

    if(req_body.chargeInterest){
        trx.type_late_fee = req_body.type_late_fee;
        trx.late_fee = req_body.late_fee;

        trx.monetary_correction = req_body.monetary_correction;
        trx.type_monetary_correction = req_body.type_monetary_correction;
        trx.frequency_monetary_correction = req_body.frequency_monetary_correction;
    }

    if(req_body.hasRecurrence){
        trx.amount = req_body.forecast_amount / req_body.quantity_installments
        trx.total_amount = req_body.amount
        trx.due_date = req_body.due_date
        trx.billing_date = req_body.billing_date
        trx.start_date = req_body.start_date
        trx.end_date = calcEndDate(req_body.start_date, req_body.quantity_installments, req_body.frequency)
        trx.frequency = req_body.frequency
        trx.readjustment_frequency = req_body.readjustment_frequency
        trx.readjustment_content = req_body.readjustment_content
    }else{
        trx.amount = req_body.amount
        trx.forecast_amount = req_body.forecast_amount
    }


    const installmentsPaid = req_body.installments_paid 
    if(installmentsPaid && Array.isArray(installmentsPaid) && installmentsPaid.length ){

        installmentsPaid.forEach( installment => {
            if(installment.wasPaid){
                const transaction = {
                    id: nanoid(),
                    company_id: req_body.company_id,
                    cost_center_id: req_body.cost_center_id,
                    chart_account_id: req_body.chart_account_id,
                    entity_id: req_body.entity_id,
                    account_id: req_body.account_id,
                    recurrence_template_id: trx.id,
                    type: req_body.type,
                    name: req_body.name,
                    description: req_body.description,
                    payment_method: req_body.payment_method,
                    amount: installment.amount,
                    due_date: dayjs(installment.date, "MM/YYYY").set("date", req_body.due_date).format("YYYY-MM-DD")
                }

                if(installment.forecast_amount) transaction.forecast_amount = installment.forecast_amount;
                if(installment.paid_at) transaction.paid_at = installment.paid_at;
                
                transactions.push(transaction)
            }
        })
    }
    
    await knex.transaction( async knex_trx => {
        if(req_body.hasRecurrence){
            await knex_trx("financial_scheme.recurrence_template").insert(trx)

            transactions.length && await knex_trx("financial_scheme.bank_transactions").insert(transactions)
        }else{
            await knex_trx("financial_scheme.bank_transactions").insert(trx)
        }
    })
}

export async function editTransaction(req_body){
    const allowedKeys = [
        "cost_center_id",
        "chart_account_id",
        "entity_id",
        "account_id",
        "type",
        "name",
        "description",
        "amount",
        "forecast_amount",
        "payment_method",
        "due_date",
        "billing_date",
        "paid_at",
        "reconciled",
        "fitid"
    ]
    const transaction = filterKeys(allowedKeys, req_body, { updated_at: "now()" })

    if(!req_body.wasPaid){
        transaction.paid_at = null
        transaction.amount = null
    }


    if(!Object.entries(transaction).length)
        throw new Error("Body vazio")

    const [result] = await knex("financial_scheme.bank_transactions")
        .update(transaction)
        .where({ id: req_body.id })
        .returning("*")

    return result
}


function calcEndDate(start_date, quantity_installments, frequency){
    if(!start_date || !quantity_installments || !frequency)
        throw new Error("Dados faltantes ou start_date ou quantity_installments ou frequency")
        
    let unit;
    switch(frequency){
        case "daily": unit = "day"; break
        case "weekly": unit = "week"; break
        case "monthly": unit = "month"; break
        case "every_two_months": quantity_installments *= 2; break
        case "every_three_months": quantity_installments *= 3; break
        case "every_four_months": quantity_installments *= 4; break
        case "every_six_months": quantity_installments *= 6; break
        case "yearly": unit = "year"
    }
    
    return dayjs(start_date).add(quantity_installments, unit).format()
}