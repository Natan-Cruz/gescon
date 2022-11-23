import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import saveLog from "../../erpActivyLogs";
import GesconError from "../../../../utils/GesconError"

export async function getAllRegisters(company_id, req_query){
    if(!company_id) 
        throw new Error("companyID necessario");

    const query = {
        search: "",
        type: ""
    }
    
    const { search, type } = req_query;

    if(search){
        query.search = knex.raw("short_description ILIKE ? OR long_description ILIKE ?", [`%${ search }%`, `%${ search }%`])
    }

    switch(type){
        case "expense":
        case "expenses":
            query.type = knex.raw("type = 'expense'"); break
        case "revenue":
        case "revenues":
            query.type = knex.raw("type = 'revenue'"); break
    }

    const accounts = await knex("chart_accounts")
        .select("*")
        .where({ company_id: company_id, deleted_at: null })
        .andWhereRaw(query.search)
        .andWhereRaw(query.type)

    return accounts
}

export async function createRegister(req_body){
    if(!req_body)
        throw new Error("reqBody necessario em createBankTransfer")

    const allowKeys = [
        "company_id",
        "short_description",
        "long_description",
        "type"
    ]
    const register = filterKeys(allowKeys, req_body, { id: nanoid() }) 
    const message = req_body.type === "revenue" ? "Centro de custo adicionado: Receita" : "Centro de custo adicionado: Despesa";

    const [hasAcronym] = await knex("chart_accounts").select(0).where({ short_description: register.short_description, type: register.type }).limit(1)
    if(hasAcronym) throw new GesconError("Já possui registro com esta sigla!")

    return await knex.transaction( async trx => {
        const [ result ] = await trx("chart_accounts").insert(register).returning("*")

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "chart_accounts",
            message,
            ip: req_body.ip,
            reference: "chart_accounts",
            reference_id: req_body.id
        }, trx)

        return result
    })
}

export async function editRegister(req_body){
    if(!req_body.id)
        throw new Error("registerID ou reqBody necessario em editBankTransfer")

    const allowKeys = [
        "short_description",
        "long_description",
        "type",
        "deleted_at"
    ]
    const register = filterKeys(allowKeys, req_body) 
    if(!Object.entries(register).length)
        throw new Error("Nenhum dado alterado!")
        
    const message = req_body.type === "revenue" ? "Centro de custo editado: Receita" : "Centro de editado adicionado: Despesa"
        
    return await knex.transaction( async trx => {
        const [response] = await knex("chart_accounts").update(register).where({ id: req_body.id }).returning("*")

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "chart_accounts",
            message,
            ip: req_body.ip,
            reference: "chart_accounts",
            reference_id: req_body.id
        }, trx)

        return response
    })
}
