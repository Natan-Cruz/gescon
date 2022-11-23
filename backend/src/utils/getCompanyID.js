import knex from "../database/database.knex";

export default async function getCompanyID(user_id){
    if(!user_id) 
        throw new Error("userID requirido")

    const [ result ] = await knex("user_scheme.users").select("company_id").where({ id: user_id })
    if(!result)
        throw new Error("Company id nao encontrado!!")
        
    return result.company_id;
}