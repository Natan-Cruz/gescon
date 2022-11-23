import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import GesconError from "../../../../utils/GesconError"
import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat';
import saveLog from "../../erpActivyLogs";
dayjs.extend(customParseFormat)

export async function getAllContracts(company_id, req_query){
    if(!company_id) 
        throw new Error("company_id requirido");

    const query = {
        search: "",
        status: "",
        type: "",
        project: ""
    }

    const { search, type, status, project_id } = req_query;
    if(search){
        query.search = knex.raw("(a.name ILIKE ? OR e.name ILIKE ?)", [`%${ search }%`,`%${ search }%`])
    }

    if(status){
        query.status = knex.raw("c.status = ?", [ status ])
    }
    switch(type){
        case "rent": query.type = knex.raw("c.type = 'rent'"); break;
        case "sale": query.type = knex.raw("c.type = 'sale'"); break;
    }

    if(project_id){
        query.project = knex.raw("a.project_asset_id = ?", [project_id])
    }

    return await knex("financial_scheme.contracts as c")
        .select("c.*", "e.name as entity_name", "a.name as asset_name")
        .innerJoin("entities as e", "e.id", "c.entity_id")
        .innerJoin("financial_scheme.assets as a", "a.id", "c.asset_id")
        .where({ "c.company_id": company_id })
        .andWhereRaw(query.search)
        .andWhereRaw(query.status)
        .andWhereRaw(query.type)
        .andWhereRaw(query.project)
}

export async function getOneContract(contract_id){
    if(!contract_id) throw new Error("contract_id requirido")
    
    const promiseContract = knex("financial_scheme.contracts")
        .select("*")
        .where({ id: contract_id })
        .limit(1)

    const promiseTransactions = knex("financial_scheme.bank_transactions as trx")
        .select("trx.*")
        .innerJoin("financial_scheme.contract_transactions as ctrx", "ctrx.transaction_id", "trx.id")
        .where({ "ctrx.contract_id": contract_id });

    const promiseRecurrenceTransactions = knex("financial_scheme.recurrence_template as rt")
        .select("rt.*")
        .innerJoin("financial_scheme.contract_recurrence_template as crt", "crt.recurrence_template_id", "rt.id")
        .where({ "crt.contract_id": contract_id });


    const [[ contract ], transactions, recurrenceTemplate ] = await Promise.all([ promiseContract, promiseTransactions, promiseRecurrenceTransactions ])

    if(!contract)
        throw new GesconError("Nenhum contrado encontrado")

    return {
        ...contract,
        transactions: transactions.map( trx => {
            return {
                ...trx,
                quantity_installments: 1,
                installments: trx.amount,
                wasPaid: trx.paid_at ? true: false,
                chargeInterest: (trx.late_fee && trx.monetary_correction)
            }
        }).concat(recurrenceTemplate).map( trx => {
            return {
                ...trx,
                quantity_installments: 1,
                installments: trx.amount,
                hasRecurrence: !Object.prototype.hasOwnProperty.call(trx, "recurrence_template_id"),
                hasReadjustment: trx.readjustment_content ? true : false,
                chargeInterest: (trx.late_fee && trx.monetary_correction)
            }
        })
    };
} 

export async function getOneContractResumeShows(contract_id){
    if(!contract_id)
        throw new Error("contract id necessario")

    const [ contract ] = await knex("financial_scheme.contracts as c")
        .select(
            "c.*", 
            "e.id as customer_id", 
            "e.name as customer_name", 
            "a.id as asset_id", 
            "a.name as asset_name",
            "a.cost_center_id as asset_cost_center_id"
        )
        .innerJoin("entities as e", "e.id", "c.entity_id")
        .innerJoin("financial_scheme.assets as a", "a.id", "c.asset_id")
        .where({ "c.id": contract_id })

    if(!contract)
        throw new GesconError("Contrato não encontrado!")

    return contract;
}

// Cria uma nova conta bancaria
export async function createNewContract(reqBody){
    if(!reqBody) throw new Error("reqBody requirido")

    const allowKeys = [
        "company_id",
        "entity_id",
        "asset_id",
        "type"
    ]

    const contract = filterKeys(allowKeys, reqBody, { id: nanoid() })

    const [{ cost_center_id }] = await knex("financial_scheme.assets").select("cost_center_id").where({ id: reqBody.asset_id })

    const transactions = []
    const contractTransactions = []
    const recurrenceTransactions = [];
    const contractRecurrenceTransactions = [];

    if(!reqBody.transactions)
        throw new GesconError("Necessita de uma transação!")

    reqBody.transactions.forEach( trx => {

        if(!trx.hasRecurrence){
            const transaction = {
                id: nanoid(),
                company_id: reqBody.company_id,
                cost_center_id: cost_center_id,
                chart_account_id: trx.chart_account_id,
                entity_id: reqBody.entity_id,
                account_id: trx.account_id,
                type: trx.type || "inflow",
                name: trx.name,
                description: trx.description,
                payment_method: trx.payment_method
            }
            if(trx.forecast_amount)
                transaction.forecast_amount = trx.forecast_amount;

            if(trx.amount)
                transaction.amount = trx.amount;

            if(trx.due_date)
                transaction.due_date = trx.due_date

            if(trx.billing_date)
                transaction.billing_date = trx.billing_date

            if(trx.paid_at)
                transaction.paid_at = trx.paid_at 


            const contractTransaction = {
                contract_id: contract.id,
                transaction_id: transaction.id
            }

            if(trx.chargeInterest){
                transaction.type_late_fee = trx.type_late_fee;
                transaction.late_fee = trx.late_fee;
                // 
                transaction.type_monetary_correction = trx.type_monetary_correction;
                transaction.frequency_monetary_correction = trx.frequency_monetary_correction
                transaction.monetary_correction = trx.monetary_correction;
            }

            transactions.push(transaction)
            contractTransactions.push(contractTransaction)
        }

        if(trx.hasRecurrence){
            
            const recurrenceTrx = {
                id: nanoid(),
                company_id: reqBody.company_id,
                cost_center_id: cost_center_id,
                chart_account_id: trx.chart_account_id,
                entity_id: reqBody.entity_id,
                account_id: trx.account_id,
                type: trx.type || "inflow",
                name: trx.name,
                description: trx.description,
                amount: trx.forecast_amount / trx.quantity_installments,
                total_amount: trx.forecast_amount,
                payment_method: trx.payment_method,
                due_date: trx.due_date,
                billing_date: trx.billing_date,
                start_date: trx.start_date,
                end_date: calcEndDate(trx.start_date, trx.quantity_installments, trx.frequency),
                frequency: trx.frequency,
                readjustment_frequency: trx.readjustment_frequency,
                readjustment_content: trx.readjustment_content
            }

            if(trx.chargeInterest){
                recurrenceTrx.type_late_fee = trx.type_late_fee;
                recurrenceTrx.late_fee = trx.late_fee;
                // 
                recurrenceTrx.monetary_correction = trx.monetary_correction;
                recurrenceTrx.type_monetary_correction = trx.type_monetary_correction;
                recurrenceTrx.frequency_monetary_correction = trx.frequency_monetary_correction
            }

            const contractRecurrenceTrx = {
                contract_id: contract.id,
                recurrence_template_id: recurrenceTrx.id
            }

            recurrenceTransactions.push(recurrenceTrx)
            contractRecurrenceTransactions.push(contractRecurrenceTrx)

            trx.installments_paid && trx.installments_paid.forEach( installment => {
                if(installment.wasPaid){
                    const transaction = {
                        id: nanoid(),
                        company_id: reqBody.company_id,
                        cost_center_id: cost_center_id,
                        chart_account_id: trx.chart_account_id,
                        entity_id: reqBody.entity_id,
                        account_id: trx.account_id,
                        recurrence_template_id: recurrenceTrx.id,
                        type: "inflow",
                        name: trx.name,
                        description: trx.description,
                        payment_method: trx.payment_method,
                        amount: installment.amount,
                        due_date: dayjs(installment.date, "MM/YYYY").set("date", trx.due_date).format("YYYY-MM-DD"),
                        paid_at: installment.paid_at || null
                    }

                    if(installment.forecast_amount)
                        transaction.forecast_amount = installment.forecast_amount;
                    
                    transactions.push(transaction)
                }
            })
        }
    })


    return await knex.transaction( async trx => {
        const [ result ] = await trx("financial_scheme.contracts").insert(contract).returning("*")

        if(recurrenceTransactions.length)
            await trx("financial_scheme.recurrence_template").insert(recurrenceTransactions)

        if(contractRecurrenceTransactions.length)
            await trx("financial_scheme.contract_recurrence_template").insert(contractRecurrenceTransactions)

        if(transactions.length) 
            await trx("financial_scheme.bank_transactions").insert(transactions)
        
        if(contractTransactions.length)
            await trx("financial_scheme.contract_transactions").insert(contractTransactions)

        await saveLog({
            company_id: reqBody.company_id,
            user_id: reqBody.user_id,
            source: "contracts",
            message: "Novo contrato realizado!",
            ip: reqBody.ip,
            reference: "financial_scheme.contracts",
            reference_id: contract.id
        }, trx)

        return result;
    })
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

// reqBody
export async function handleContractActions(reqBody){
    const { id, action, user_id } = reqBody
    if(!id || !action)
        throw new Error("Paramentros de entrada invalidos")

    const [contract] = await knex("financial_scheme.contracts as c")
        .select("c.*", "a.cost_center_id as asset_cost_center_id")
        .innerJoin("financial_scheme.assets as a", "a.id", "c.asset_id")
        .where({ "c.id": id })

    if(!contract)
        throw new GesconError("Contrato não encontrado!");

    let response;
    switch(action){
        case "cancel_contract": response = await fnCancelContract(contract, reqBody.back_transaction, user_id); break
        case "transfer_contract": response = await fnTransferContract(contract, reqBody.customer, user_id); break
    }
    return response;
}

async function fnCancelContract(contract, back_trx, user_id){
    await knex.transaction( async trx => {
        // altera status do contrato
        await trx("financial_scheme.contracts")
            .update({ status: "canceled_contract", updated_at: "now()"})
            .where({ id: contract.id })

        // deleta todas as contas a receber do contrato nao recebidas
        await trx("financial_scheme.bank_transactions")
            .del()
            .whereIn("id", function(){
                this.from("financial_scheme.contract_transactions")
                .select("transaction_id")
                .where({ contract_id: contract.id })
            })
            .andWhereRaw(knex.raw("paid_at is null"))

        // cancela recorencias
        await trx("financial_scheme.recurrence_template")
            .update({ enabled: false, updated_at: "now()" })
            .whereIn("id", function(){
                this
                .from("financial_scheme.contract_recurrence_template")
                .select("recurrence_template_id")
                .where({ contract_id: contract.id })
            })

        if(contract.type === "sale" && back_trx){
            const transaction = {
                id: nanoid(),
                company_id: contract.company_id,
                cost_center_id: contract.asset_cost_center_id,
                chart_account_id: back_trx.chart_account_id,
                entity_id: contract.entity_id,
                account_id: back_trx.account_id,
                type: "outflow",
                name: back_trx.name,
                description: back_trx.description,
                payment_method: back_trx.payment_method,
                due_date: back_trx.due_date,
                amount: back_trx.amount
            }

            if(back_trx.forecast_amount) transaction.forecast_amount = back_trx.forecast_amount;
            if(back_trx.paid_at) transaction.paid_at = back_trx.paid_at;
            if(back_trx.billing_date) transaction.billing_date = back_trx.billing_date;

            if(back_trx.chargeInterest){
                transaction.type_late_fee = back_trx.type_late_fee;
                transaction.late_fee = back_trx.late_fee;
                // 
                transaction.type_monetary_correction = back_trx.type_monetary_correction;
                transaction.frequency_monetary_correction = back_trx.frequency_monetary_correction
                transaction.monetary_correction = back_trx.monetary_correction;
            }

            if(back_trx.hasRecurrence){
                transaction.amount = back_trx.amount / back_trx.quantity_installments
                transaction.total_amount = back_trx.amount
                transaction.due_date = back_trx.due_date
                transaction.billing_date = back_trx.billing_date
                transaction.start_date = back_trx.start_date
                transaction.end_date = calcEndDate(back_trx.start_date, back_trx.quantity_installments, back_trx.frequency)
                transaction.frequency = back_trx.frequency
                transaction.readjustment_frequency = back_trx.readjustment_frequency
                transaction.readjustment_content = back_trx.readjustment_content
            }

            if(back_trx.hasRecurrence){
                await trx("financial_scheme.recurrence_template").insert(transaction)
                await trx("financial_scheme.contract_recurrence_template").insert({
                    contract_id: contract.id,
                    recurrence_template_id: transaction.id
                })
            }else{
                await trx("financial_scheme.bank_transactions").insert(transaction)
                await trx("financial_scheme.contract_transactions").insert({
                    contract_id: contract.id,
                    transaction_id: transaction.id
                })
            }
        }

        await saveLog({
            company_id: contract.company_id,
            user_id: user_id,
            source: "contracts",
            message: "Destrado realizado!",
            reference: "financial_scheme.contracts",
            reference_id: contract.id
        }, trx)
    })
}

// customer = new customer
async function fnTransferContract(contract, customer, user_id){

    return await knex.transaction( async trx => {
        await trx("financial_scheme.contracts")
            .update({ entity_id: customer.id })
            .where({ id: contract.id })

        const [ cstmer ] = await trx("entities").select("id", "name").where({ id: customer.id })

        await saveLog({
            company_id: contract.company_id,
            user_id: user_id,
            source: "contracts",
            message: "Contrato transferido!",
            ip: reqBody.ip,
            reference: "financial_scheme.contracts",
            reference_id: contract.id
        }, trx)
    
        return cstmer;
    })

    // const newCustomer = {
    //     id: nanoid(),
    //     contract_id: contract.id,
    //     customer_id: customer.entity_id
    // }

    // const [ response ] = await knex("financial_scheme.contract_customers")
    //     .insert(newCustomer)
    //     .returning("*");

    // return response;
}