import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import saveLog from "../../erpActivyLogs"

export async function getOneCreditCard(credit_card_id){
    if(!credit_card_id)
        throw new Error("credit_card_id faltante!!")

    const promiseCreditCard = knex("financial_scheme.bank_accounts_or_credit_cards")
        .select("*")
        .where({ id: credit_card_id })
        .limit(1)

    const promiseCreditCardInfo = knex("financial_scheme.credit_cards_informations")
        .select("*")
        .where({ parent_table_id: credit_card_id })
        .limit(1)

    const [[ creditCard], [ creditCardInformations ]] = await Promise.all([ promiseCreditCard, promiseCreditCardInfo ])

    delete creditCardInformations.id

    return {
        ...creditCard,
        ...creditCardInformations
    }
}

export async function createCreditCard(req_body){
    if(!req_body)
        throw new Error("reqBody necessario em createCreditCard")

    const allowKeys = [
        "company_id",
        "name",
        "anotations"
    ]
    const allowKeysCardInfo = [
        "only_debit",
        "card_flag",
        "card_operator",
        "credit_limit",
        "minimum_payment",
        "closing_day",
        "expiration_day",
    ]
    const creditCard = filterKeys(allowKeys, req_body, { id: nanoid(), type: "credit_card" }) 
    const creditCardInformations = filterKeys(allowKeysCardInfo, req_body, { id: nanoid(), parent_table_id: creditCard.id }) 

    return await knex.transaction( async trx => {
        const [ response ] = await trx("financial_scheme.bank_accounts_or_credit_cards")
            .insert(creditCard)
            .returning("*")

        const response_2 = await trx("financial_scheme.credit_cards_informations").insert(creditCardInformations)

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "card-credit",
            message: "Cartao de crédito adicionado!",
            ip: req_body.ip,
            reference: "financial_scheme.credit_cards_informations",
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

export async function editCreditCard(req_body){
    if(!req_body || !req_body.id )
        throw new Error("accountID ou accountID necessario em editBankAccount")

    const allowKeys = [
        "name",
        "anotations"
    ]
    const allowKeysBnkInfo = [
        "only_debit",
        "card_flag",
        "card_operator",
        "credit_limit",
        "minimum_payment",
        "closing_day",
        "expiration_day",
    ]
    const creditCard = filterKeys(allowKeys, req_body) 
    const creditCardInformations = filterKeys(allowKeysBnkInfo, req_body,) 

    await knex.transaction( async trx => {
        const hasCardCredit = Object.entries(creditCard).length,    
            hasCreditCardInformations = Object.entries(creditCardInformations).length;

        if(hasCardCredit)
            await trx("financial_scheme.bank_accounts_or_credit_cards")
                .update({ ...creditCard, updated_at: "now()" })
                .where({ id: req_body.id })

        if(hasCreditCardInformations)
            await trx("financial_scheme.credit_cards_informations")
                .update(creditCardInformations)
                .where({ parent_table_id: req_body.id })

        if(hasCardCredit && hasCreditCardInformations)
            await saveLog({
                company_id: req_body.company_id,
                user_id: req_body.user_id,
                source: "card-credit",
                message: "Cartao de crédito editado!",
                ip: req_body.ip,
                reference: "financial_scheme.credit_cards_informations",
                reference_id: req_body.id
            }, trx)
    })

    return;
}

export async function deleteCreditCard(){

}
