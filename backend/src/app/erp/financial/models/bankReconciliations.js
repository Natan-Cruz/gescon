import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import {filterKeys} from "../../../../utils/Utils";
import GesconError from "../../../../utils/GesconError"
const API_KEY_CURRENCY_RATE = "6efac80571967370c837"
import axios from "axios"
import dayjs from "dayjs"

export async function getAllBankReconciliations(companyID){
    if(!companyID && typeof companyID !== 'string') 
        throw new Error("companyID necessario")

    const results = await knex("financial_scheme.bank_reconciliations as br")
        .select("br.*", "ba.name as account_name")
        .innerJoin("financial_scheme.bank_accounts_or_credit_cards as ba", "ba.id", "br.account_id")
        .where({ "br.company_id": companyID, "br.deleted_at": null })

    return results.map( item => {
        const period = `${dayjs(item.started_at).format("DD/MM/YY")} - ${dayjs(item.ended_at).format("DD/MM/YY")}`
        return {
            ...item,
            period
        }
    })
}

export async function getOneBankReconciliation(reconciliationID){
    if(!reconciliationID && typeof reconciliationID !== 'string') 
        throw new Error("bankReconciliationID necessario")

    const [result] = await knex("financial_scheme.bank_reconciliations").select("*").where({ id: reconciliationID }).limit(1)

    if(!result) throw new GesconError("Reconciliação não encontrada")

    result.started_at = dayjs(result.started_at).format("YYYY-MM-DD")
    result.ended_at = dayjs(result.ended_at).format("YYYY-MM-DD")
    return result
}

export async function createBankReconciliation(reqBody){
    if(!reqBody)
        throw new Error("reqBody necessario em createBankReconciliation")

    const allowedKeys = [
        "company_id",
        "account_id",
        "started_at",
        "ended_at",
        "closing_balance",
        "reconciled"
    ]
    const reconciliation = filterKeys(allowedKeys, reqBody, { id: nanoid() });

    const { data } = await axios.get("https://free.currconv.com/api/v7/convert?q=USD_brl&compact=ultra&apiKey=" + API_KEY_CURRENCY_RATE)

    const transactionsToAdd = [], transactionsToEdit = []

    reqBody.items.forEach( trx => {
        if(!trx.id){
            trx.currency_rate = data.USD_BRL 
            trx.company_id = reqBody.company_id
            transactionsToAdd.push(createTRX(trx))
        }else{
            transactionsToEdit.push({
                id: trx.id,
                update: editTRX(trx)
            })
        }
    });

    console.log(transactionsToAdd)
    console.log(transactionsToEdit)

    return await knex.transaction( async trx => {
        const [result] = await trx("financial_scheme.bank_reconciliations").returning("*").insert(reconciliation)

        if(transactionsToAdd.length)
            await trx("financial_scheme.bank_transactions").insert(transactionsToAdd)

        if(transactionsToEdit.length)
            for(const transx of transactionsToEdit){
                await trx("financial_scheme.bank_transactions").update(transx.update).where("id", transx.id)
            }
            
        return result
    })
}

export async function editBankReconciliation(reconciliationID, reqBody){
    if(!reconciliationID || !reconciliationID)
        throw new Error("reconciliationID ou reqBody necessario em editBankReconciliation")


    const allowedKeys = [
        "started_at",
        "ended_at",
        "closing_balance",
        "reconciled"
    ]
    const recociliation = filterKeys(allowedKeys, reqBody)
    if(!Object.entries(recociliation).length)
        throw new Error("Body vazio")

    const [result] = await knex("financial_scheme.bank_reconciliations").returning("*").update(recociliation).where({ id: reconciliationID })
    return result
}

function createTRX(trx){
    const allowedKeys = [
        "company_id",
        "category_id",
        "entity_id",
        "account_id",
        "type",
        "name",
        "paid_at",
        "amount",
        "currency_code",
        "currency_rate",
        "document_id",
        "description",
        "payment_method",
        "reference",
        "parent_id",
        "reconciled",
        "fitid"
    ]
    return filterKeys(allowedKeys, trx, { id: nanoid()})
}

function editTRX(trx){
    const allowedKeys = [
        "category_id",
        "entity_id",
        "account_id",
        "type",
        "paid_at",
        "amount",
        "currency_code",
        "currency_rate",
        "document_id",
        "description",
        "payment_method",
        "reference",
        "parent_id",
        "reconciled",
        "fitid"
    ]
    return filterKeys(allowedKeys, trx, { updated_at: "now()" })
}