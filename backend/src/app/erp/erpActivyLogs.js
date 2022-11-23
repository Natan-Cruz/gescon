import knex from "../../database/database.knex"
import nanoid from "../../utils/nanoid"

export default async function saveLog(options, trx){
    if(!options.company_id) 
        throw new Error("Company_id ausente!")

    const log = {
        id: nanoid(),
        ...options
    }

    if(trx){
        return trx("public.erp_logs").insert(log)
    } else {
        return knex("public.erp_logs").insert(log)
    }
}