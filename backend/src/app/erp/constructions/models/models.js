import knex from "../../../../database/database.knex";
import { filterKeys } from "../../../../utils/Utils"
import nanoid from "../../../../utils/nanoid";
import { defaultFolders } from "../defaultFolders.js"

export async function getConstructions(company_id, user_id, user_is_admin = false){

    const query = {
        join: knex.raw("inner join construction_scheme.construction_members as c_m on c_m.construction_id = c.id"),
        where: knex.raw("c_m.user_id = ?", [ user_id ])
    }

    if(user_is_admin){
        query.join = ""
        query.where = ""
    }

    const constructions = await knex("construction_scheme.constructions as c")
        .select("c.id","c.tree_structure_id", "c.name", "c.planned_start_date", "c.planned_end_date", "c.start_date", "c.end_date", "c.banner_file_url", "c.default", "c.enabled")
        .joinRaw(query.join)
        .where({ "c.company_id": company_id })
        .andWhereRaw(query.where)
        .orderBy("c.created_at", "asc")

    return constructions
}

export async function createNewConstruction(req_body){
    const allowedKeysTreeStructure = [
        "company_id",
        "name",
        "type_category",
        "order"
    ]

    const allowedKeysConstruction = [
        "company_id",
        "name", 
        "description",
        "country",
        "cep",
        "street",
        "number",
        "state",
        "city",
        "neighborhood",
        "complement",
        "planned_start_date",
        "planned_end_date",
        "start_date",
        "end_date",
        "enabled"
    ]

    const path = `${ req_body.company_id.slice(0, 6) }.${ nanoid(6) }`
    const treeStructure = filterKeys(allowedKeysTreeStructure, req_body, { id: nanoid(), type_category: "construction", order: 3, path })
    const construction = filterKeys(allowedKeysConstruction, req_body, { id: nanoid(), tree_structure_id: treeStructure.id })

    const members = []
    const r_members = req_body.members;

    r_members && r_members.forEach( user_id => {
        members.push({
            id: nanoid(),
            construction_id: construction.id,
            user_id: user_id
        })
    })

    const folders = defaultFolders.map( ({ folder_name, path_ltree_id }) => {
        return {
            id: nanoid(),
            folder_name,
            path_ltree_id,
            path_ltree: path_ltree_id !== "root" ? `${ construction.id }.${ path_ltree_id }` : construction.id,
            space_owner: "construction",
            was_created_by_system: true
        }
    })

    return knex.transaction( async trx => {

        // define centro de custo
        await trx("public.cost_center").insert(treeStructure)

        // cadastra obra
        const [ result ] = await trx("construction_scheme.constructions").insert(construction).returning("*")

        // criar membros
        await trx("construction_scheme.construction_members").insert(members)

        // cria pasta raiz
        await trx("folders").insert(folders)

        // insere status
        await trx("construction_scheme.erp_activities").insert({
            id: nanoid(),
            construction_id: construction.id,
            user_id: req_body.user_id,
            action: "ADD",
            description: "Obra criada!",
            resource: "construction",
            resource_id: construction.id
        })

        return result
    })
}

export async function getProgress(company_id){
    const rowsProductions = await knex("construction_scheme.service_productions as sp")
        .select(knex.raw("CAST(SUM(sp.value) AS FLOAT) as acumulate"), "sp.service_id", knex.raw("CAST(s.production_total AS FLOAT) as production_total"), "s.production_unity" ,"s.name")
        .innerJoin("construction_scheme.services as s", "s.id", "sp.service_id")
        .innerJoin("construction_scheme.constructions as c", "c.id", "s.construction_id")
        .where({ "s.construction_id": company_id })
        .groupBy("sp.service_id", "s.production_total", "s.production_unity" ,"s.name")

    const checkItems = await knex("construction_scheme.service_check_items as sci")
        .select("sci.checked", "sci.reinspected_at")
        .innerJoin("construction_scheme.services as s", "s.id", "sci.service_id")
        .where({ "s.construction_id": company_id })

    const check_items = checkItems.reduce(( acc, cur ) => {
        if(cur.checked === true && !cur.reinspected_at) acc.conformities += 1
        if(cur.checked === true && cur.reinspected_at) acc.reinspected += 1
        if(cur.checked === false) acc.unconformities += 1
        if(cur.checked === null) acc.non_checked += 1

        return acc
    }, { conformities: 0, reinspected: 0, unconformities: 0, non_checked: 0 })


    const { acumulate, production_total } = rowsProductions.reduce((acc, cur, i) => {
        acc.acumulate += cur.acumulate >= cur.production_total ? cur.production_total : cur.acumulate  
        acc.production_total += cur.production_total 
        return acc
    }, { acumulate: 0, production_total: 0 })

    const progress = (((check_items.conformities + check_items.reinspected) / checkItems.length) + (acumulate / production_total)) / 2

    return {
        progress: progress ? (progress * 100) : 0,
        check_items,
        productions: (acumulate / production_total) * 100
    }
}

export async function calcSpaceUsed(constructionID){
    return await knex("files as fl")
        .select("size", "file_type")
        .innerJoin("folders as f", "f.id", "fl.folder_id")
        .where({ space_owner: "construction" })
        .andWhereRaw(knex.raw(`f."path_ltree" ~ ?`, [ `${constructionID}.*` ]))
}

export async function getCompanyID(constructionID){
    const [response] = await knex("companies as c")
        .select("c.id as company_id", "constr.banner_file_path")
        .innerJoin('construction_scheme.constructions as constr', "constr.company_id", "c.id")
        .where({ 'constr.id': constructionID });

    if(!response)
        throw new Error( "Ocorreu algo de errado" );

    return response;
} 

export async function updateConstruction(req_body){
    if(!req_body || !req_body.id)
        throw new Error("Paramentros faltantes")

    const allowedKeys = [
        "name", 
        "description",
        "country",
        "cep",
        "street",
        "number",
        "state",
        "city",
        "neighborhood",
        "complement",
        "planned_start_date",
        "planned_end_date",
        "start_date",
        "end_date",
        "enabled",
        "banner_file_url",
        "banner_file_name",
        "banner_file_path"
    ]

    const alterations = filterKeys(allowedKeys, req_body)

    if(!Object.entries(alterations).length) 
        throw new Error("Nenhum dado a alterar!")

    const [ response ] = await knex("construction_scheme.constructions")
        .update( alterations )
        .where({ id: req_body.id })
        .returning(Object.keys(alterations).map( key => key ))

    return response;
}

export async function getInformations(constructionID){
    const [ construction ] = await knex("construction_scheme.constructions").select("*").where({ id: constructionID })

    if(!construction)
        throw new Error("Construção não encontrada!")

    return construction;
}

export async function getErpActivities(construction_id, filter = "today"){
    let queryDate = ""
    switch(filter){
        case "today": 
            queryDate = knex.raw("date(ea.created_at) = CURRENT_DATE")
        break
        case "yesterday": 
            queryDate = knex.raw("date(ea.created_at) = CURRENT_DATE - INTEGER '1'")
        break
        case "last_7_days": 
            queryDate = knex.raw("date(ea.created_at) > CURRENT_DATE - INTEGER '7'")
        break
    }
    const activities = await knex("construction_scheme.erp_activities as ea")
        .select("ea.*", knex.raw("date(ea.created_at) as d"),  knex.raw("CONCAT(u.\"first_name\", ' ' , u.\"last_name\") as user_name"))
        .innerJoin("user_scheme.users as u", "u.id", "ea.user_id")
        .where({ "ea.construction_id": construction_id })
        .andWhereRaw(queryDate)
        .orderBy("ea.created_at", "desc")

    const reduced = activities.reduce(( acc, cur ) => {
        switch(cur.resource){
            case "purchased_materials":
                acc.materialOrders.push(cur.resource_id)
                break
            case "occurrences": 
                acc.occurrences.push(cur.resource_id)
                break
            case "visits":
                acc.visits.push(cur.resource_id)
                break
            case "files":
                acc.files.push(cur.resource_id)
                break
            case "cloud":
                acc.folders.push(cur.resource_id)
                break;
            case "service_check_items":
                acc.service_check_items.push(cur.resource_id.split("/").pop())
                break;
            case "service_productions":
                acc.services.push(cur.resource_id.split("/")[0])
                break
            case "services":
                acc.services.push(cur.resource_id)
        }
        return acc
    }, { materialOrders: [], occurrences: [], visits: [], files: [], folders: [], service_check_items: [], service_productions: [], services: [] })

    
    const promiseMaterialOrders = knex("construction_scheme.material_orders as mo")
        .select("e.name as title", "mo.id")
        .leftJoin("entities as e", "e.id", "mo.entity_id")
        .whereIn("mo.id", reduced.materialOrders)

        console.log(await promiseMaterialOrders)

    const promiseOccurrences = knex("construction_scheme.occurrences")
        .select("title", "id")
        .whereIn("id", reduced.occurrences)

    const promiseVisits = knex("construction_scheme.visits")
        .select("name as title", "id")
        .whereIn("id", reduced.visits)

    const promiseFolders = knex("folders")
        .select("folder_name as title", "path_ltree as id")
        .whereIn("path_ltree", reduced.folders)

    const promiseServices = knex("construction_scheme.services")
        .select("name as title", "id")
        .whereIn("id", reduced.services)

    const promiseServiceCheckItems = knex("construction_scheme.service_check_items")
        .select("name as title", knex.raw("CONCAT(service_id, '/', id) as id"))
        .whereIn("id", reduced.service_check_items)

    const infos = await Promise.all([ promiseMaterialOrders, promiseOccurrences, promiseVisits, promiseFolders, promiseServices, promiseServiceCheckItems ])
    const titles = [].concat.apply([], infos);

    const promiseMaterialOrderAttachments = await  knex("construction_scheme.material_order_attachments as moa")
        .select("f.*", "moa.order_id as attachment_id")
        .innerJoin("files as f", "f.id", "moa.file_id")
        .whereIn("moa.order_id", reduced.materialOrders)
        .andWhereRaw(knex.raw("f.file_type like 'image%'"))

    const promiseOccurrencesAttachments = await  knex("construction_scheme.occurrence_attachments as oa")
        .select("f.*", "oa.occurrence_id as attachment_id")
        .innerJoin("files as f", "f.id", "oa.file_id")
        .whereIn("oa.occurrence_id", reduced.occurrences)
        .andWhereRaw(knex.raw("f.file_type like 'image%'"))

    const promiseVisitsAttachments = await knex("construction_scheme.visit_attachments as va")
        .select("f.*", "va.visit_id as attachment_id")
        .innerJoin("files as f", "f.id", "va.file_id")
        .whereIn("va.visit_id", reduced.visits)
        .andWhereRaw(knex.raw("f.file_type like 'image%'"))

    const promiseFilesAttachments = await knex("files as f")
        .select("f.*", "f.id as attachment_id")
        .whereIn("f.id", reduced.files)
        .andWhereRaw(knex.raw("f.file_type like 'image%'"))

    const promiseServiceCheckItemsAttachments = await knex("construction_scheme.service_check_item_attachments as scia")
        .select("f.*", knex.raw("CONCAT(sci.service_id, '/', sci.id) as attachment_id"))
        .innerJoin("files as f", "f.id", "scia.file_id")
        .innerJoin("construction_scheme.service_check_items as sci", "sci.id", "scia.service_check_item_id")
        .whereIn("scia.service_check_item_id", reduced.service_check_items)
        .andWhereRaw(knex.raw("f.file_type like 'image%'"))

    const promises = await Promise.all([ 
        promiseMaterialOrderAttachments, 
        promiseOccurrencesAttachments, 
        promiseVisitsAttachments, 
        promiseFilesAttachments, 
        promiseServiceCheckItemsAttachments 
    ])
    const attachments = [].concat.apply([], promises)
    
    return activities.map( activity => {
        activity.attachments = attachments.filter( attach => {
            if(attach.attachment_id === activity.resource_id && activity.action === "ADD")
                return attach
        })
        titles.forEach(({ id, title }) => {
            const [ resouce_id ] = activity.resource_id.split("/")
            if(resouce_id && resouce_id === id)
                activity.title = title
        })
        return activity
    }).reduce(( acc, cur ) => {
        if(!cur.group_id) acc.push(cur)
        else{
            const index = acc.findIndex( itm => itm.group_id === cur.group_id)
            const elem = acc.find( itm => itm.group_id === cur.group_id)

            if(index === -1)
                acc.push(cur)
            else{
                elem.attachments = elem.attachments.concat(cur.attachments)
                if(elem.attachments.length > 1)
                    elem.description = elem.description.replace("Um", elem.attachments.length).replace("arquivo foi carregado", "arquivos foram carregados")
                acc.splice(index, 1, elem)
            }
        }
        return acc
    }, []).sort(function(a,b){
        return new Date(b.created_at) - new Date(a.created_at);
    });
}
  