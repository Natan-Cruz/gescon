import knex from "../../../../database/database.knex";
import GesconError from "../../../../utils/GesconError";
import { filterKeys } from "../../../../utils/Utils"
import nanoid from "../../../../utils/nanoid"
import saveLog from "../../erpActivyLogs";

// Obtem todas as contas bancarias
export async function getAllAssets(company_id, req_query){
    if(!company_id) 
        throw new Error("company_id requirido")

    const query = {
        search: "",
        select: undefined,
        type: "",
        status: "",
        project_id: ""
    }

    const { search, type, status, project_id, minimal } = req_query;
    if(search){
        query.search = knex.raw("a.name ILIKE ?", [`%${ search }%`])
    }

    if(minimal){
        query.select = ["a.id", "a.name"]
    }else{
        query.select = ["a.*", "pa.name as project_name" ]
    }

    switch(type){
        case "rent": 
            query.type = knex.raw("a.type = 'rent'"); break;
        case "sale": 
            query.type = knex.raw("a.type = 'sale'"); break;
    }

    if(project_id){
        query.project_id = knex.raw("a.project_asset_id = ?", [project_id])
    }

    const assets = await knex("financial_scheme.project_assets as pa")
        .select(
            ...query.select,
            "a.cost_center_id",
            knex.raw("CASE WHEN c.id IS NOT NULL THEN true ELSE false END AS has_contract")
        )
        .innerJoin("financial_scheme.assets as a", "a.project_asset_id", "pa.id")
        .leftJoin("financial_scheme.contracts as c", "c.asset_id", "a.id")
        .whereRaw(query.search)
        .andWhereRaw(query.type)
        .andWhereRaw(query.project_id)
        .andWhere({ "pa.company_id": company_id })
        .orderBy("a.name", "asc")
    
    switch(status){
        case "available": 
            return assets.filter( asset => !asset.has_contract )
        case "unavailable": 
            return assets.filter( asset => asset.has_contract )
        default:
            return assets
    }
}

export async function getAllProjectAssets(company_id){
    return await knex("financial_scheme.project_assets")
        .select("id", "name")
        .where({ company_id: company_id })
        .orderBy("name", "asc");
}

export async function getOneAsset(asset_id){
    if(!asset_id) 
        throw new Error("asset_id requirido")

    const [ asset ] = await knex("financial_scheme.assets")
        .select("*")
        .where({ id: asset_id })

    if(!asset)
        throw GesconError("Ativo não encontrado!");

    const contracts = await knex("financial_scheme.contracts as c")
        .select("c.id", "c.type", "c.created_at", "c.canceled_at", "c.status", "e.id as customer_id", "e.name as customer_name" )
        .innerJoin("entities as e", "e.id", "c.entity_id")
        .where({ "c.asset_id": asset.id })
        .orderBy("c.created_at", "desc")

    return {
        ...asset,
        contracts
    };
}

export async function createAsset(req_body){
    const allowedKeys = [
        "project_asset_id",
        "cost_center_id", 
        "name",
        "type",
        "useful_area",
        "common_area",
        "gross_floor_area"
    ]

    const asset = filterKeys(allowedKeys, req_body, { id: nanoid() }, true)

    return await knex.transaction( async trx => {
        const [ result ] = await knex("financial_scheme.assets").insert(asset).returning("*")

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "assets",
            message: "Ativo foi cadastrado!",
            ip: req_body.ip,
            reference: "financial_scheme.assets",
            reference_id: asset.id
        }, trx)

        return result
    })


}

export async function editAsset(req_body){
    if(!req_body || !req_body.id) 
        throw new Error("req_body ausente ou incompleto")
}