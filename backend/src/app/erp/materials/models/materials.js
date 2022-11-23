import knex from "../../../../database/database.knex";
import GesconError from "../../../../utils/GesconError";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils"
import saveLog from "../../erpActivyLogs"

export async function getAllMaterials(req_query){
    
    const query = {
        search: "",
        select: ""
    }

    const { company_id, search, minimal } = req_query;  

    if(search){
        query.search = knex.raw(`name ILIKE ?`, [`%${ search }%`])
    }

    if(minimal){
        query.select = ["id", "name"]
    } else {
        query.select = ["*"]
    }

    return await knex("construction_scheme.materials")
        .select(query.select)
        .where({ company_id: company_id, deleted_at: null })
        .andWhereRaw(query.search)
}

export async function getOneMaterial(material_id){
    if(!material_id) 
        throw new Error("Paramentro material_id faltante")
    
    const [material] = await knex("construction_scheme.materials")
        .select("*")
        .where({ id: material_id })
        .limit(1)

    if(!material)
        throw GesconError("Não encontrado")

    return material
}


export async function createMaterial(req_body){
    const keys = [
        "company_id",
        "name",
        "description",
    ]
    const material = filterKeys(keys, req_body, { id: nanoid() })

    return await knex.transaction( async trx => {
        const [ result ] = await trx("construction_scheme.materials").insert(material).returning("*")
        
        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "materials",
            message: "Material adicionado!",
            ip: req_body.ip,
            reference: "construction_scheme.materials",
            reference_id: material.id
        }, trx)

        return result
    })
}   

export async function editMaterial(req_body){
    if(!req_body.id)
        throw new Error("Paramentros faltantes")

    const keys = [
        "name",
        "description",
        "deleted_at",
        "updated_at"
    ]
    const alterations = filterKeys(keys, req_body, { updated_at: "now()" })
    
    if(!Object.entries(alterations).length)
        throw new Error("Nenhuma alteracao")
    
    return await knex.transaction( async trx => {
        const [ result ] = await knex("construction_scheme.materials")
            .update(alterations)
            .where({ id: req_body.id })
            .returning("*")

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "materials",
            message: "Material editado!",
            ip: req_body.ip,
            reference: "construction_scheme.materials",
            reference_id: req_body.id
        }, trx)

        return result
    })
}   