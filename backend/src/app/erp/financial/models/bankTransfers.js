import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
const API_KEY_CURRENCY_RATE = "6efac80571967370c837"
import axios from "axios"
import GesconError from "../../../../utils/GesconError"

export async function getAllBankTransfers(company_id, req_query){
    if(!company_id && typeof company_id !== 'string') 
        throw new Error("companyID necessario")

    const query = {
        search: "",
    }
    const { search } = req_query;

    if(search){
        query.search = knex.raw("(bnk_a.name ILIKE ? OR bnk_b.name ILIKE ?)", [`%${ search }%`, `${ search }`])
    }

    return await knex("financial_scheme.bank_transfers as bt")
        .select("bt.id as id","trx_a.paid_at as date", "bnk_a.name as fromName", "bnk_b.name as toName", "trx_a.amount as amount", "trx_a.date")
        .innerJoin("financial_scheme.bank_transactions as trx_a", "trx_a.id", "bt.income_transaction_id")
        .innerJoin("financial_scheme.bank_accounts_or_credit_cards as bnk_a", "bnk_a.id", "trx_a.account_id")
        .innerJoin("financial_scheme.bank_transactions as trx_b", "trx_b.id", "bt.expense_transaction_id")
        .innerJoin("financial_scheme.bank_accounts_or_credit_cards as bnk_b", "bnk_b.id", "trx_b.account_id")
        .where({ "bt.company_id": company_id })
        .andWhereRaw(query.search)
}

export async function getOneBankTransfer(transfer_id){
    if(!transfer_id && typeof transfer_id !== 'string') 
        throw new Error("bankTransferID necessario")

    const [ transfer ] = await knex("financial_scheme.bank_transfers as bt")
        .select("bt.id as id","trx_a.paid_at as date", "bnk_a.id as from_bank_id", "bnk_b.id as to_bank_id", "trx_a.amount as amount", "trx_a.payment_method", "trx_a.description", "trx_a.date")
        .innerJoin("financial_scheme.bank_transactions as trx_a", "trx_a.id", "bt.income_transaction_id")
        .innerJoin("financial_scheme.bank_accounts_or_credit_cards as bnk_a", "bnk_a.id", "trx_a.account_id")
        .innerJoin("financial_scheme.bank_transactions as trx_b", "trx_b.id", "bt.expense_transaction_id")
        .innerJoin("financial_scheme.bank_accounts_or_credit_cards as bnk_b", "bnk_b.id", "trx_b.account_id")
        .where({ "bt.id": transfer_id })    

    if(!transfer)
        throw new GesconError("Transferência não encontrada!!")

    return transfer
}

export async function createBankTransfer(reqBody){
    if(!reqBody)
        throw new Error("reqBody necessario em createBankTransfer")

    const { data } = await axios.get("https://free.currconv.com/api/v7/convert?q=USD_brl&compact=ultra&apiKey=" + API_KEY_CURRENCY_RATE)
    
    const expenseTransaction = {
        id: nanoid(),
        company_id: reqBody.company_id,
        account_id: reqBody.from_bank_id,
        type: "outflow",
        amount: reqBody.amount * -1,
        currency_code: "BRL",
        currency_rate: data.USD_BRL,
        payment_method: reqBody.payment_method,
        paid_at: reqBody.date
    }
    const incomeTransaction = {
        id: nanoid(),
        company_id: reqBody.company_id,
        account_id: reqBody.to_bank_id,
        type: "inflow",
        amount: reqBody.amount,
        currency_code: "BRL",
        currency_rate: data.USD_BRL,
        payment_method: reqBody.payment_method,
        paid_at: reqBody.date
    }
    const transfer = {
        id: nanoid(),
        company_id: reqBody.company_id,
        expense_transaction_id: expenseTransaction.id,
        income_transaction_id: incomeTransaction.id
    }

    return await knex.transaction( async trx => {
        await Promise.all([
            trx("financial_scheme.bank_transactions").insert(expenseTransaction), 
            trx("financial_scheme.bank_transactions").insert(incomeTransaction)
        ])
        const [ result ] = await trx("financial_scheme.bank_transfers").insert(transfer).returning("*")
        return result
    })
}

export async function editBankTransfer(req_body){
    if(!req_body || !req_body.id)
        throw new Error("transferID ou reqBody necessario em editBankTransfer")

    const [transfer] = await knex("financial_scheme.bank_transfers")
        .select("income_transaction_id","expense_transaction_id")
        .where({ id: req_body.id })
        .limit(1);

    const incomeTransaction = {}, expenseTransaction = {}

    if(req_body.accounts_ids && req_body.accounts_ids.from) incomeTransaction.account_id = req_body.accounts_ids.from
    if(req_body.accounts_ids && req_body.accounts_ids.to) expenseTransaction.account_id = req_body.accounts_ids.to
    if(req_body.amount){
        incomeTransaction.amount = req_body.amount;
        expenseTransaction.amount = req_body.amount * -1
    }
    if(req_body.payment_method){
        incomeTransaction.payment_method = req_body.payment_method
        expenseTransaction.payment_method = req_body.payment_method
    }
    if(req_body.date){
        incomeTransaction.date = req_body.date
        expenseTransaction.date = req_body.date
    }

    if(!Object.entries(incomeTransaction).length || !Object.entries(expenseTransaction).length)
        throw new Error("Body mal formatado ou vazio")

    return await knex.transaction( async trx => {
        await trx("financial_scheme.bank_transactions").update(expenseTransaction).where({ id: transfer.expense_transaction_id })                    
        await trx("financial_scheme.bank_transactions").update(incomeTransaction).where({ id: transfer.income_transaction_id })                    
    })
}
