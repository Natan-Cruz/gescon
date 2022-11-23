import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid"
import { defineStatusNames } from "../utils";
import GesconError from "../../../../utils/GesconError";
import { filterKeys } from "../../../../utils/Utils"
import sendMail from "../../../../services/email"

export async function getAllOcurrencesByStatus( constructionID, statusCode ) {
    if(!constructionID || !statusCode)
        throw new Error("Parâmetro faltante!");

    let queryIn = []
    //  se status code vindo da query, for unico
    if(typeof statusCode === "string")
        queryIn.push(statusCode)
    
    if(typeof statusCode === "object" && Array.isArray(statusCode))
        queryIn = statusCode

        
    return await knex("construction_scheme.occurrences as o")
        .select('o.*', "os.created_at as createdAt")
        .innerJoin("construction_scheme.occurrence_status as os", "os.id", function() {
            this.select("id")
                .from("construction_scheme.occurrence_status")
                .where("occurrence_id", knex.raw("o.id"))
                .orderBy("created_at", "desc")
                .limit(1)
        })
        .where({ 
            "o.construction_id": constructionID
        })
        .whereIn("os.status_code", queryIn)
        .orderBy("o.created_at", "asc")
}


export async function getOneOccurrence(occurrence_id) {
    if(!occurrence_id)
        throw new Error("Parâmetro faltante!");

    const promiseOccurrence = knex("construction_scheme.occurrences")
        .select("*")
        .where({ id: occurrence_id })
        
    const promiseEntities = knex("construction_scheme.occurrence_entities")
        .select("*")
        .where({ occurrence_id });

    const promiseAttachments = knex("construction_scheme.occurrence_attachments as oa")
        .select("f.*", "oa.id as attachment_id")
        .leftJoin("files as f", "f.id", "oa.file_id")
        .where({ occurrence_id })
        
    const promiseStatus = knex("construction_scheme.occurrence_status")
        .select("*")
        .where({ occurrence_id })
        .orderBy("created_at", "desc")

    const [ [ occurrence ], entities, attachments, [ lastOccurrenceStatus, ...occurrenceStatus ]] = await Promise.all([
        promiseOccurrence,
        promiseEntities,
        promiseAttachments,
        promiseStatus
    ])

    if(!occurrence)
        throw new GesconError("Ocorrência não encontrada!")
    
    return {
        ...occurrence,
        entities: entities.map(({ entity_contact_id }) => entity_contact_id),
        attachments,
        status: [ lastOccurrenceStatus, ... occurrenceStatus ].map(defineStatusNames).reverse()
    };
}

export async function getOccurrencePublic({occurrence_id, contact_id}){
    if(!occurrence_id || !contact_id)
        throw new Error("Parâmetro faltante!");

    const promiseOccurrence = knex("construction_scheme.occurrences as o")
        .select(
            "o.id",
            "o.title",
            "o.description",
            "o.weather_data",
            "o.severity",
            "o.construction_id",
            "o.scope",
            "cns.name as construction_name",
            "c.name as construction_company_name"
        )
        .innerJoin("construction_scheme.constructions as cns", "cns.id", "o.construction_id")
        .innerJoin("companies as c", "c.id", "cns.company_id")
        .where({ "o.id": occurrence_id })
        .limit(1)

    const promiseAttachments = knex("construction_scheme.occurrence_attachments as oa")
        .select(
            "f.id",
            "f.file_name",
            "f.file_type",
            "oa.id as attachment_id"
        )
        .leftJoin("files as f", "f.id", "oa.file_id")
        .where({ occurrence_id })
        
    const promiseStatus = knex("construction_scheme.occurrence_status")
        .select("created_at", "status_code")
        .where({ occurrence_id })
        .orderBy("created_at", "desc")

    const [ [ occurrence ], attachments, status] = await Promise.all([
        promiseOccurrence,
        promiseAttachments,
        promiseStatus
    ])

    if(!occurrence || (!occurrence.scope || occurrence.scope === "internal"))
        throw new GesconError("Ocorrência não encontrada!");

    return {
        ...occurrence,
        attachments,
        status: status.map(defineStatusNames)
    };
}

export async function createNewOccurrence(req_body){
    if(!req_body)
        throw new Error("Parâmentro faltante");

    const allowedKeys = [
        "construction_id",
        "title",
        "description",
        "scope",
        "weather_data",
        "severity",
        "tree_structure_id"
    ]
    const occurrence = filterKeys(allowedKeys, req_body, { id: nanoid() });
    const providers = []

    req_body.entities && req_body.entities.forEach( entity_id => {
        providers.push({
            occurrence_id: occurrence.id,
            entity_contact_id: entity_id
        })

    })

    const contacts = await knex("public.entity_contacts as ec")
        .select("ec.id", "ec.email", "c.name as company_name")
        .innerJoin("public.entities as e", "e.id", "ec.entity_id")
        .innerJoin("public.companies as c", "c.id", "e.company_id")
        .whereIn("ec.id", req_body.entities)

    
    return await knex.transaction( async trx => {
        // Cria ocorrencia
        const [ result ] = await trx("construction_scheme.occurrences").insert(occurrence).returning("*")
        await trx("construction_scheme.occurrence_entities").insert(providers)

        // Cria status de "Nova ocorrencia"
        await trx("construction_scheme.occurrence_status")
            .insert({
                id: nanoid(),
                occurrence_id: occurrence.id,
                status_code: 1
            })

        await trx("construction_scheme.erp_activities").insert({
            id: nanoid(),
            construction_id: req_body.construction_id,
            user_id: req_body.user_id,
            action: "ADD",
            description: "Uma nova ocorrência foi registrada!",
            resource: "occurrences",
            resource_id: occurrence.id
        })


        for(const { id, email, company_name } of contacts){
            const subject = "Nova ocorrência",  body = "Uma ocorrência fora gerada"
            const templateConfig = {
                company_name: company_name,
                url: `https://app.gescon.tec.br/public/occurrence?occurrence_id=${ occurrence.id }&contact_id=${ id }`
            }
            await sendMail({ templateEmailName: "occurrence", templateConfig }, { email: email, subject, body })
        }
        
        return result
    })
}

export async function addStatusInOccurrence(req_body){
    if(!req_body || !req_body.occurrence_id || !req_body.status_code)
        throw new Error("Parâmetros faltante!")

    const [ occurrence ] = await knex("construction_scheme.occurrences").select("construction_id").where({ id: req_body.occurrence_id })

    return await knex.transaction( async trx => {
        const [ status ] = await knex("construction_scheme.occurrence_status")
            .insert({
                id: nanoid(),
                occurrence_id: req_body.occurrence_id,
                status_code: req_body.status_code
            })
            .returning("*")
            
        await trx("construction_scheme.erp_activities").insert({
            id: nanoid(),
            construction_id: occurrence.construction_id,
            user_id: req_body.user_id,
            action: "EDIT",
            description: req_body.status_code !== 7 ? "Uma ocorrência teve seu status alterado!" : "Uma ocorrência foi finalizada",
            resource: "occurrences",
            resource_id: req_body.occurrence_id
        })

        return status;
    })
}

export async function editOccurrence(req_body){
    if(!req_body || !req_body.id)
        throw new Error("body faltantes")

    const allowedKeys = [
        "title",
        "description",
        "scope",
        "weather_data",
        "severity",
        "tree_structure_id"
    ]
    const alterations = filterKeys(allowedKeys, req_body)

    const [{ construction_id }] = await knex("construction_scheme.occurrences")
        .select("construction_id")
        .where({ id: req_body.id })

    const occurEntities = await knex("construction_scheme.occurrence_entities")
        .select("*")
        .where({ occurrence_id: req_body.id });

    const entitiesActions = { add: [], remove: [] }

    req_body.entities && req_body.entities.forEach( formEntityId => {
        const has = (occurEntities.map(({ entity_id }) => entity_id ).indexOf(formEntityId) > -1)
        if(!has)
            entitiesActions.add.push({
                id: nanoid(),
                occurrence_id: req_body.id,
                entity_id: formEntityId
            })
    });

    occurEntities.forEach( ({ entity_id }) => {
        const has = req_body.entities && (req_body.entities.indexOf(entity_id) > -1)
        if(!has)
            entitiesActions.remove.push({ entity_id, occurrence_id: req_body.id })
    });


    return await knex.transaction( async trx => {
        let result;

        if(Object.entries(alterations).length){
            const [ r ] = await trx("construction_scheme.occurrences")
                .update(alterations)
                .where({ id: req_body.id })
                .returning("*")

            result = r
        }

        if(entitiesActions.add.length)
            await trx("construction_scheme.occurrence_entities").insert(entitiesActions.add)

        if(entitiesActions.remove.length){
            const promises = []
            entitiesActions.remove.forEach( actions => {
                const q = trx("construction_scheme.occurrence_entities").del().where(actions)
                promises.push(q)
            })
            await Promise.all(promises)
        }

        if(Object.entries(alterations).length || entitiesActions.add.length || entitiesActions.remove.length)
            await trx("construction_scheme.erp_activities").insert({
                id: nanoid(),
                construction_id: construction_id,
                user_id: req_body.user_id,
                action: "EDIT",
                description: "Uma ocorrência foi editada!",
                resource: "occurrences",
                resource_id: req_body.id
            })
        
        return result
    })
}

// DELETAR STATUS
// DELETAR ANEXOS
// DELETAR TERCEIRAS PARTES
// DELETAR OCORRÊNCIA
export async function deleteOccurrence(user_id, occurrence_id){
    if(!occurrence_id)
        throw new Error("Parametros faltantes")

    return await knex.transaction( async trx => {
        await trx("construction_scheme.occurrence_status")
            .del()
            .where({ occurrence_id })

        await trx("construction_scheme.occurrence_entities")
            .del()
            .where({ occurrence_id })

        await trx("construction_scheme.occurrence_attachments")
            .del()
            .where({ occurrence_id })

        const [ occurrence ] = await trx("construction_scheme.occurrences")
            .del()
            .where({ id: occurrence_id })
            .returning("*")

        await trx("construction_scheme.erp_activities").insert({
            id: nanoid(),
            construction_id: occurrence.construction_id,
            user_id: user_id,
            action: "DELETE",
            description: "Uma ocorrência foi deletada!",
            resource: "occurrences",
            resource_id: occurrence_id
        })
    })
}


export async function getInformationConstruction( constructionID, fields ){
    const [ construction ] = await knex("construction_scheme.constructions")
        .select(fields)
        .where({ id: constructionID })
        .limit(1)

    if(!construction)
        throw new Error("Obra não encontrada!")

    return construction
}
