import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import GesconError from "../../../../utils/GesconError"
import saveLog from "../../erpActivyLogs";

export async function getAllBankAccounts(company_id, req_query){
    if(!company_id && typeof company_id !== 'string') 
        throw new Error("companyID necessario")

    const query = {
        search: "",
        type: ""
    }

    const { search, type } = req_query;

    if(search){
        query.search = knex.raw("name ILIKE ?", [`%${ search }%`])
    }

    if(type){
        if(type === "bank_accounts")
            query.type = knex.raw("type = 'bank_account'")
        else if(type === "credit_cards")
            query.type = knex.raw("type = 'credit_card'")
        else
            throw new Error("Type errado: só sao aceitos: bank_accounts ou credit_cards")
    }

    return await knex("financial_scheme.bank_accounts_or_credit_cards")
        .select("*")
        .where({ company_id })     
        .andWhereRaw(query.type)
        .andWhereRaw(query.search)
}

export async function getOneBankAccount(account_id){
    if(!account_id && typeof account_id !== 'string') 
        throw new Error("bankAccountID necessario")

    const promiseBnkAccount = knex("financial_scheme.bank_accounts_or_credit_cards")
        .select("*")
        .where({ id: account_id })
        .limit(1)

    const promiseBnkInformations = knex("financial_scheme.bank_accounts_informations")
        .select("*")
        .where({ parent_table_id: account_id })
        .limit(1)

    const [[ account ], [ informations ] ] = await Promise.all([ promiseBnkAccount, promiseBnkInformations ])

    if(!account || !informations)
        throw new GesconError("Conta Bancária não encontrada!")

    delete informations.id

    return {
        ...account,
        ...informations
    };
}

export async function createBankAccount(req_body){
    if(!req_body)
        throw new Error("reqBody necessario em createBankAccount")

    const allowKeys = [
        "company_id",
        "name",
        "anotations"
    ]
    const allowKeysBnkInfo = [
        "bank_name",
        "agency",
        "operating",
        "number",
        "currency_code",
        "opening_balance",
        "date_opening_balance",
    ]
    const bankAccount = filterKeys(allowKeys, req_body, { id: nanoid(), type: "bank_account" }) 
    const bankAccountInformations = filterKeys(allowKeysBnkInfo, req_body, { id: nanoid(), parent_table_id: bankAccount.id }) 

    return await knex.transaction( async trx => {
        const [ response ] = await trx("financial_scheme.bank_accounts_or_credit_cards")
            .insert(bankAccount)
            .returning("*")

        const response_2 = await trx("financial_scheme.bank_accounts_informations").insert(bankAccountInformations)

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "bank-account",
            message: "Conta bancária criada!",
            ip: req_body.ip,
            reference: "financial_scheme.bank_accounts_or_credit_cards",
            reference_id: req_body.id
        }, trx)

        // deletar-se-o para nao substituir o id principal
        delete response_2.id
        return {
            ...response,
            ...response_2
        }
    })
}

export async function editBankAccount(req_body){
    if(!req_body || !req_body.id )
        throw new Error("accountID ou accountID necessario em editBankAccount")

    const allowKeys = [
        "name",
        "anotations"
    ]
    const allowKeysBnkInfo = [
        "bank_name",
        "agency",
        "operating",
        "number",
        "currency_code",
        "opening_balance",
        "date_opening_balance",
    ]
    const bankAccount = filterKeys(allowKeys, req_body) 
    const bankAccountInformations = filterKeys(allowKeysBnkInfo, req_body,) 

    await knex.transaction( async trx => {
        const hasAccount = Object.entries(bankAccount).length,
            hasInformations = Object.entries(bankAccountInformations).length

        if(hasAccount)
            await trx("financial_scheme.bank_accounts_or_credit_cards")
                .update({ ...bankAccount, updated_at: "now()" })
                .where({ id: req_body.id })

        if(hasInformations)
            await trx("financial_scheme.bank_accounts_informations")
                .update(bankAccountInformations)
                .where({ parent_table_id: req_body.id })

        if(hasAccount || hasInformations)
            await saveLog({
                company_id: req_body.company_id,
                user_id: req_body.user_id,
                source: "bank-account",
                message: "Conta bancária editada!",
                ip: req_body.ip,
                reference: "financial_scheme.bank_accounts_or_credit_cards",
                reference_id: req_body.id
            }, trx)
    })

    return;
}
