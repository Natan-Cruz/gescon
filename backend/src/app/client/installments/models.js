import knex from "../../../database/database.knex"
import { generateInstallments } from "./generateInstallments"
import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { groupByPeriods } from "./utils"

dayjs.extend(isSameOrAfter)

export async function getInstallemnts(reqQuery){
    // Obtem todas as template transaction do contrato
    const recurrenceTemplates = await knex("financial_scheme.contracts as c")
        .select("rt.id as recurrence_template_id", "rt.company_id", "rt.name", "rt.description", "rt.amount", "rt.currency_code", "rt.payment_method", "rt.due_date", "rt.billing_date", "rt.start_date", "rt.end_date", "rt.frequency")
        .innerJoin("financial_scheme.contract_recurrence_template as crt", "crt.contract_id", "c.id")
        .innerJoin("financial_scheme.recurrence_template as rt", "rt.id", "crt.recurrence_template_id")
        .where({ "c.entity_id": reqQuery.userId, "c.id": reqQuery.contract_id })

    const recurrenceTransactions = await knex("financial_scheme.contracts as c")
        .select("bt.*", "bt.id as bank_transaction_id")
        .innerJoin("financial_scheme.contract_recurrence_template as crt", "crt.contract_id", "c.id")
        .innerJoin("financial_scheme.recurrence_template as rt", "rt.id", "crt.recurrence_template_id")
        .innerJoin("financial_scheme.bank_transactions as bt", "bt.recurrence_template_id", "rt.id")
        .where({ "c.entity_id": reqQuery.userId, "c.id": reqQuery.contract_id })

    const transactions = await knex("financial_scheme.contracts as c")
        .select("bt.*","bt.id as bank_transaction_id")
        .innerJoin("financial_scheme.contract_transactions as ct", "ct.contract_id", "c.id")
        .innerJoin("financial_scheme.bank_transactions as bt", "ct.transaction_id", "bt.id")
        .where({ "c.entity_id": reqQuery.userId, "c.id": reqQuery.contract_id })


    const { start_date, end_date } = reqQuery; 

    if(!recurrenceTemplates.length && !recurrenceTransactions.length) return {
        installments: [],
        buttons: {
            showPrevious: false,
            showSuccessors: false
        }
    }

    const installments = recurrenceTemplates
        .map( t => {
            return generateInstallments(t, { start_date, end_date })
        })
        .reduce( (prev, cur) => {
            return [...prev, ...cur]
        }, [])
        .map( installment => {
            recurrenceTransactions.forEach( trx => {
                if(trx.date === installment.date){
                    installment.bank_transaction_id = trx.bank_transaction_id
                    installment.paid_at = trx.paid_at
                }
            })
            return installment
        })
    

    const minDate = Math.min(...recurrenceTemplates.map(({ start_date }) => start_date))
    const showPrevious = dayjs(reqQuery.start_date).isAfter(minDate)

    const maxDate = Math.max(...recurrenceTemplates.map(({ end_date }) => end_date))
    const showSuccessors = dayjs(reqQuery.end_date).isBefore(maxDate)

    const mainFrequency = countFrequency(recurrenceTemplates)
    return {
        transactions,
        installments: groupByPeriods(mainFrequency, installments),
        buttons: {
            showPrevious,
            showSuccessors
        }
    }
}

function countFrequency(recurrence){
    const map = new Map();
    recurrence.forEach( r => {
        const freq = r.frequency;

        const has = map.get(freq)

        if(has){
            map.set(freq, parseInt(has) + 1)
        }else{
            map.set(freq, 1)
        }
    })

    let max = { key: "", value: 0 };
    
    Array.from(map).forEach(([key, value]) => {
        if(value > max.value){
            max.key = key;
            max.value = value
        }
    })

    return max.key
}

export async function getOneInstallment(reqQuery){
    if(reqQuery.bank_transaction_id){
        const [ transaction ] = await knex("financial_scheme.bank_transactions")
        .select("*")
        .where({ id: reqQuery.bank_transaction_id })
        return transaction   
    }else{
        const [ template ] = await knex("financial_scheme.recurrence_template")
            .select("*")
            .where({ id: reqQuery.recurrence_template_id })
        
        return{ 
            ...template, 
            date: reqQuery.date,
            billing_date: dayjs(reqQuery.date).date(template.billing_date).format("YYYY-MM-DD"),
            due_date: dayjs(reqQuery.date).date(template.due_date).format("YYYY-MM-DD")
        }
    }
}