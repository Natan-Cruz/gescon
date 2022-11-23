import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys, formatActions } from "../../../../utils/Utils";
import GesconError from "../../../../utils/GesconError"

// Obtem todas as contas bancarias
export async function getAllEquipments(company_id, req_query){
    if(!company_id) 
        throw new Error("company_id requirido")

    let querySearch = "", queryConstruction = "", queryOrigin = "", queryStatus = ""
    if(req_query.search){
        querySearch = knex.raw(`"e.name" ILIKE ? `, [ `%${ req_query.search }%` ]);
    }
    if(req_query.construction_id){
        queryConstruction = knex.raw("e.construction_id = ?", [ req_query.construction_id ]);
    }
    if(req_query.origin){
        queryOrigin = knex.raw("e.origin = ?", [ req_query.origin ]);
    }

    return await knex("equipment_scheme.equipments as e")
        .select("e.*","c.name as construction_name")
        .leftJoin("construction_scheme.constructions as c", "c.id", "e.construction_id")
        .where({ "e.company_id": company_id })
        .andWhereRaw(querySearch)
        .andWhereRaw(queryConstruction)
        .andWhereRaw(queryOrigin)
        .andWhereRaw(queryStatus)
}

export async function getOneEquipment(equipment_id){
    if(!equipment_id) throw new Error("Id do equipamento necessário");

    const promiseEquipment = knex("equipment_scheme.equipments").select("*").where({ id: equipment_id })

    const promiseEquipmentAttachments = knex("equipment_scheme.equipment_attachments as ea")
        .select("f.*", "ea.id as attachment_id")
        .leftJoin("files as f", "f.id", "ea.file_id")
        .where({ equipment_id: equipment_id })

    const promiseEquipmentMaintenances = knex("equipment_scheme.equipment_maintenances")
        .select("*")
        .where({ equipment_id: equipment_id }).orderBy("created_at", "asc")
    
    const [ [equipment], attachments, maintenances ] = await Promise.all([ promiseEquipment, promiseEquipmentAttachments, promiseEquipmentMaintenances ])

    if(!equipment)
        throw new Error("Equipamento não encontrado!!")

    return {
        ...equipment,
        construction_id: [ equipment.construction_id ],
        attachments,
        maintenances
    }
}

export async function createNewEquipment(req_body){
    const equipments = []
    const quantity = req_body.quantity || 1
    const group = {
        group_id: nanoid(8),
        group_name: req_body.name
    }
    for(let i = 1; i <= quantity; i++ ){
        equipments.push({
            id: nanoid(),
            name: `${ req_body.name } - Nº ${ i }`,
            company_id: req_body.company_id,
            construction_id: req_body.construction_id[i - 1] || null,
            ...group
        })
    }

    return await knex.transaction( async trx => {
        const [result] = await trx("equipment_scheme.equipments").insert(equipments).returning("*")
        return result;
    })
}

export async function editEquipment(req_body){
    return true
}


// 


export async function getOneEquipmentMaintenance(maintenance_id){
    if(!maintenance_id) throw new Error("Id do equipamento necessário");
    
    const promiseMaintenance = knex("equipment_scheme.equipment_maintenances")
        .select("*")
        .where({ id: maintenance_id }).limit(1)

    const promiseMaintenanceAttachments = knex("equipment_scheme.equipment_maintenance_attachments as ema")
        .select("f.*", "ema.id as attachment_id")
        .leftJoin("files as f", "f.id", "ema.file_id")
        .where({ "ema.equipment_maintenance_id": maintenance_id })

    const [ [ maintenance ], attachments ] = await Promise.all([ promiseMaintenance, promiseMaintenanceAttachments ]);
    return {
        ...maintenance,
        attachments
    }
}

export async function createNewEquipmentMaintenance(req_body){
    if(!req_body || !req_body.equipment_id) 
        throw new Error("Id do equipamento necessário");
    
    const allowedKeys = [
        "equipment_id",
        "description",
        "start_date",
        "end_date"
    ]
    const equipment = filterKeys(allowedKeys, req_body, { id: nanoid() })
    const [result] = await knex("equipment_scheme.equipment_maintenances").insert(equipment).returning("*")
    return result
}

export async function editEquipmentMaintenance(req_body){
    if(!req_body || !req_body.id) throw new Error("Id do equipamento necessário");
    
    const allowedKeys = [
        "description",
        "start_date",
        "end_date"
    ]
    const alterations = filterKeys(allowedKeys, req_body)
    const { remove } = formatActions(req_body.attachments || [])

    await knex.transaction( async trx => {
        if(Object.entries(alterations).length)
            await trx("equipment_scheme.equipment_maintenances").update(alterations).where({ id: req_body.id })

        if(remove.length){
            const promises =  []

            remove.forEach(({ id }) => {
                promises.push(trx("public.files").del().where({ id: id }))
            })

            await Promise.all(promises)
        }
        
    })

    return true
}