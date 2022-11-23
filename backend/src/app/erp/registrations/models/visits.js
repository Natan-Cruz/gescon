import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys, formatActions } from "../../../../utils/Utils";
import GesconError from "../../../../utils/GesconError"

export async function getAllVisits(company_id, req_query){
    if(!company_id) 
        throw new Error("company_id requirido")

    let querySearch = "", queryConstruction = "";
    if(req_query.search){
        querySearch = knex.raw(`v."name" ILIKE ? `, [ `%${ req_query.search }%` ]);
    }
    if(req_query.construction_id){
        queryConstruction = knex.raw("v.construction_id = ?", [ req_query.construction_id ]);
    }

    return await knex("construction_scheme.visits as v")
        .select("v.*","c.name as construction_name")
        .leftJoin("construction_scheme.constructions as c", "c.id", "v.construction_id")
        .where({ "c.company_id": company_id })
        .andWhereRaw(querySearch)
        .andWhereRaw(queryConstruction)
        .orderBy("v.date", "desc")
}

export async function getOneVisit(visit_id){
    if(!visit_id) throw new Error("Id da visit necessário");

    const promiseVisit = knex("construction_scheme.visits").select("*").where({ id: visit_id })

    const promiseVisitAttachments = knex("construction_scheme.visit_attachments as ea")
        .select("f.*", "ea.id as attachment_id")
        .leftJoin("files as f", "f.id", "ea.file_id")
        .where({ visit_id: visit_id })
    
    const [ [visit], attachments ] = await Promise.all([ promiseVisit, promiseVisitAttachments ])

    if(!visit)
        throw new Error("visit não encontrado!!")

    return {
        ...visit,
        attachments
    }
}

export async function createNewVisit(req_body){
    if(!req_body || !req_body.construction_id)
        throw new Error("req_body e construction_id requiridos")

    const allowedKeys = [
        "construction_id",
        "name",
        "company",
        "reasons",
        "period",
    ]
    const visit = filterKeys(allowedKeys, req_body, { id: nanoid() })

    return await knex.transaction( async trx => {
        const [ result ] = await knex("construction_scheme.visits").insert(visit).returning("*")

        await trx("construction_scheme.erp_activities").insert({
            id: nanoid(),
            construction_id: req_body.construction_id,
            user_id: req_body.user_id,
            action: "ADD",
            description: "Uma visita foi registrada!",
            resource: "visits",
            resource_id: visit.id
        })

        return result;
    })

}

export async function editVisit(req_body){
    if(!req_body || !req_body.id)
        throw new Error("req_body ou visit_id requiridos")

    const allowedKeys = [
        "name",
        "construction_id",
        "company",
        "reasons",
        "period",
        "date"
    ]
    const alterations = filterKeys(allowedKeys, req_body, { updated_at: "now()" })

    if(!Object.entries(alterations).length)
        return;

    return await knex.transaction( async trx => {
        const [ result ] = await trx("construction_scheme.visits")
            .update(alterations)
            .where({ id: req_body.id })
            .returning("*")

        await trx("construction_scheme.erp_activities").insert({
            id: nanoid(),
            construction_id: result.construction_id,
            user_id: req_body.user_id,
            action: "EDIT",
            description: "Uma visita foi editada!",
            resource: "visits",
            resource_id: result.id
        })

        return result
    })
}

export async function deleteVisit(){
    
}
