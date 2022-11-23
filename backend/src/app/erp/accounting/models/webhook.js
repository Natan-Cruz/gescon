import knex from "../../../../database/database.knex"

// boleto pago
export async function handleSucceeded(req_body){
    const paid_date = req_body.payload.object.metadata.payment_date
    const bankSpliId = req_body.payload.object.id
    const amount = req_body.payload.object.amount

    await knex.transaction( async trx => {
        const [ transaction_id ] = await trx("financial_scheme.bank_transaction_bank_slips")
            .update({ paid_date })
            .where({ voluti_transaction_id: bankSpliId })
            .returning("transaction_id")

        await trx("financial_scheme.bank_transactions").update({
            paid_at: paid_date,
            amount: amount
        }).where({ id: transaction_id })
    })
}

// boleto cancelado
export async function handleCanceled(req_body){

}

// boleto falho
export async function handleFailed(req_body){

}

// boleto atualizado
export async function handleUpdated(req_body){

}