import knex from "../../../../database/database.knex";
import { filterKeys, formatActions } from "../../../../utils/Utils"
import nanoid from "../../../../utils/nanoid"
import GesconError from "../../../../utils/GesconError";


export async function getAllMaterialOrders( req_query ){
    const query = {
        construction_id: "",
        search: "",
        status: "",
        date: ""
    }
    const { company_id, construction_id, search, status, date } = req_query;

    // construction id
    if(construction_id){
        query.construction_id = knex.raw("pm.construction_id = ?", [ construction_id ])
    }
    // search
    if(search){
        query.search = knex.raw(`m.name ILIKE '%${ search }%'`)
    }
    // status
    switch(status){
        case "delivered":
            query.status = knex.raw("pm.delivered_in is not null")
            break
        case "bought":
            query.status = knex.raw("pm.delivered_in is null")
            break
    }
  
    // date
    if(date){
        query.data = knex.raw("date(pm.created_at) = ?", [ req_query.date ])
    }

    const promiseOrders = knex("construction_scheme.material_orders as pm")
        .select("pm.*", "e.name as entity_name", "c.name as construction_name")
        .leftJoin("public.entities as e", "e.id", "pm.entity_id")
        .leftJoin("construction_scheme.constructions as c", "c.id", "pm.construction_id")
        .whereRaw(query.construction_id)
        .andWhereRaw(query.status)
        .andWhereRaw(query.date)
        .andWhere({ "c.company_id": company_id })

    const promiseMaterials = knex("construction_scheme.material_orders as pm")
        .select("moi.*")
        .leftJoin("public.entities as e", "e.id", "pm.entity_id")
        .leftJoin("construction_scheme.constructions as c", "c.id", "pm.construction_id")
        .leftJoin("construction_scheme.material_order_items as moi", "moi.order_id", "pm.id")
        .leftJoin("construction_scheme.materials as m", "m.id", "moi.material_id")
        .whereRaw(query.construction_id)
        .andWhereRaw(query.search)
        .andWhereRaw(query.status)
        .andWhereRaw(query.date)
        .andWhere({ "c.company_id": company_id });

    const [ orders, items ] = await Promise.all([ promiseOrders, promiseMaterials ])

    return orders.map( order => {
        order.items = items.filter( item => item.order_id === order.id)
        return order;
    })
}

export async function getOneMaterial(material_order_id){
    if(!material_order_id) throw new Error("material_id necessário")

    const [ material ] = await knex("construction_scheme.material_orders")
        .select("*")
        .where({ "id": material_order_id })

    if(!material)
        throw GesconError("Pedido não encontrado!!");
        
    const promiseAttachments = knex("construction_scheme.material_order_attachments as moa")
        .select("f.*")
        .innerJoin("files as f", "f.id", "moa.file_id")
        .where({ "moa.order_id": material_order_id })

    const promiseItems = knex("construction_scheme.material_order_items")
        .select("*")
        .where({ order_id: material_order_id })
    
    const [ attachments, items ] = await Promise.all([ promiseAttachments, promiseItems ])
        
    return {
        ...material,
        attachments,
        items
    }
}

export async function createNewMaterialOrder(req_body){
    if(!req_body || !req_body.company_id)
        throw new Error("Paramentros faltantes em createMaterial")

    const keys = [
        "construction_id",
        "entity_id",
        "description",
        "purchase_date",
        "delivery_date",
        "delivered_in",
        "cost_of_freight",
    ]
    const keysItem = [
        "material_id",
        "quantity",
        "unity",
        "unitary_value",
        "amount",
        "anotation"
    ]
    const [responseCount] = await knex("construction_scheme.material_orders as mo")
        .select(knex.raw("count(mo.*)"))
        .innerJoin("construction_scheme.constructions as c", "c.id", "mo.construction_id")
        .where({ "c.company_id": req_body.company_id })

    const materialOrder = filterKeys(keys, req_body, { id: nanoid(), number: (parseInt(responseCount.count) + 1) });

    const items =  req_body.items ? req_body.items.map( itm => filterKeys(keysItem, itm, { id: nanoid(), order_id: materialOrder.id })) : []

    return await knex.transaction( async trx => {
        const [ response ] = await trx("construction_scheme.material_orders")
            .insert(materialOrder)
            .returning("*")
        
        if(items.length)
            await trx("construction_scheme.material_order_items").insert(items)

        await trx("construction_scheme.erp_activities").insert({
            id: nanoid(),
            construction_id: req_body.construction_id,
            user_id: req_body.user_id,
            action: "ADD",
            description: "Um material foi adicionado à materiais a receber!",
            resource: "purchased_materials",
            resource_id: materialOrder.id
        })

        return response;
    })
}


export async function editMaterial(req_body){
    if(!req_body || !req_body.id) throw new Error("Paramentros faltantes em editMaterial")

    const keys = [
        "construction_id",
        "entity_id",
        "description",
        "purchase_date",
        "delivery_date",
        "delivered_in",
        "cost_of_freight",
    ]
    const keysItem = [
        "material_id",
        "quantity",
        "unity",
        "unitary_value",
        "amount",
        "anotation"
    ]

    const materialOrder = filterKeys(keys, req_body, { updated_at: "now()" })
    const { add, update, remove } = formatActions(req_body.items)
    return await knex.transaction( async trx => {
        let r;
        
        if(Object.entries(materialOrder).length){
            const [ result ] = await trx("construction_scheme.material_orders").update(materialOrder).where({ id: req_body.id }).returning("*")
            r = result
        }

        if(add.length){
            const insertItems = add.map( item => filterKeys(keysItem, item, { id: nanoid(), order_id: req_body.id }))
            await trx("construction_scheme.material_order_items").insert(insertItems)
        }

        if(update.length){
            const promisses = []

            update.map( item => {
                const query = trx("construction_scheme.material_order_items")
                    .update(filterKeys(keysItem, item))
                    .where({ id: item.id })

                promisses.push(query)
            })
            await Promise.all(promisses)
        }

        if(remove.length)
            await trx("construction_scheme.material_order_items")
                .del().whereIn('id', remove.map( item => item.id ))
    })
}

export async function deleteMaterial(material_id){
    if(!material_id) throw new Error("material_id necessario")

    const result = await knex("construction_scheme.purchased_materials").del().where({ id: material_id })
    return !!result
}

export async function getMaterialOrderForReceive(material_order_id){
    if(!material_order_id) throw new Error("material_id necessário")

    const [ material ] = await knex("construction_scheme.material_orders as mo")
        .select(
            "e.id as entity_id",
            "e.name as entity_name",
            "mo.id",
            "mo.number", 
            "mo.cost_of_freight",
            "mo.delivered_in",
            "mo.delivery_date",
            "mo.description",
            "mo.purchase_date"
        )
        .leftJoin("entities as e", "e.id", "mo.entity_id")
        .where({ "mo.id": material_order_id })
        .limit(1)

    if(!material)
        throw GesconError("Pedido não encontrado!!");

    const promiseAttachments = knex("construction_scheme.material_order_attachments as moa")
        .select("f.*")
        .innerJoin("files as f", "f.id", "moa.file_id")
        .where({ "moa.order_id": material_order_id })

    const promiseItems = knex("construction_scheme.material_order_items as moi")
        .select(
            "m.name as material_name",
            "moi.id",
            "moi.material_id",
            "moi.amount",
            "moi.quantity",
            "moi.unitary_value",
            "moi.unity",
            "moi.anotation"
        )
        .innerJoin("construction_scheme.materials as m", "m.id", "moi.material_id")
        .where({ "moi.order_id": material_order_id })
    
    const [ attachments, items  ] = await Promise.all([ promiseAttachments, promiseItems ])
        
    return {
        ...material,
        attachments,
        items
    }

}

export async function receiveMaterial(req_body){
    const items = req_body.items;

    return await knex.transaction( async trx => {

        const [ result ] = await trx("construction_scheme.material_orders")
            .update({ delivered_in: "now()" })
            .where({ id: req_body.id })
            .returning("*")

        if(items && items.length){
            const promises = [];

            items.forEach( item => {
                console.log(item)
                let query = trx("construction_scheme.material_order_items")
                    .update({ anotation: item.new_anotation })
                    .where({ id: item.id })
                promises.push(query)
            })

            await Promise.all(promises)
        }
           
        await trx("construction_scheme.erp_activities").insert({
            id: nanoid(),
            construction_id: result.construction_id,
            user_id: req_body.user_id,
            action: "ADD",
            description: "Um pedido foi recebido!",
            resource: "purchased_materials",
            resource_id: result.id
        })

        return result
    })
}