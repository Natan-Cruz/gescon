import knex from "../../../../database/database.knex";

export async function getAllContracts(userId){
    return await knex("financial_scheme.contracts as c")
        .select("*", "c.id as contract_id")
        .innerJoin("financial_scheme.assets as ast", "ast.id", "c.asset_id")
        .where({ "c.entity_id": userId })
}