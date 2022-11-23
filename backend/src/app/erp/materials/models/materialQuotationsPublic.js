import knex from "../../../../database/database.knex";
import { filterKeys } from "../../../../utils/Utils"
import nanoid from "../../../../utils/nanoid"
import GesconError from "../../../../utils/GesconError";
import dayjs from "dayjs";

export async function getOneMaterialQuotationPublic(id){
    if(!id) throw new Error("Id material quotation não defindo!!")

    const [materialQuotation] = await knex("construction_scheme.material_quotations as mq")
        .select(
            "mq.*",
            "c.name as company_name"
        )
        .innerJoin("public.companies as c", "c.id", "mq.company_id")
        .where({ "mq.id": id })

    if(!materialQuotation)
        throw new GesconError("Cotação de material não encontrada ou excluida!!")

    if(dayjs().isAfter(materialQuotation.expiration_date, "date"))
        throw new GesconError("Cotação de material expirada!!")
   
    const items = await knex("construction_scheme.material_quotation_items")
        .select("*")
        .where({ "material_quotation_id": materialQuotation.id })

    const [status] = await knex("construction_scheme.material_quotation_status")
        .select(0)
        .where({ material_quotation_id: materialQuotation.id, status: "quotation_viewed" })
        .orderBy("created_at", "desc")

    if(!status)
        await knex("construction_scheme.material_quotation_status")
            .insert({
                id: nanoid(),
                material_quotation_id: materialQuotation.id,
                status: "quotation_viewed"
            })


    return {
        ...materialQuotation,
        items
    }
}

export async function saveAlterationsQuotationPublic(req_body){
    if(!req_body.id) throw new Error("Id material quotation não defindo!!")

    const keysQuotation = [
        "p_message",
        "p_type_freight",
        "freight_cost",
        "payment_terms",
        "payment_term_days",
        "payment_method",
        "delivery_time",
        "minimum_value",
    ]
    const keysItem = [
        "unity",
        "parent_id",
        "quantity",
        "anotation",
        "unitary_value",
        "material_name",
        "answer"
    ] 

    const materialQuotation = filterKeys(keysQuotation, req_body, { updated_at: "now()" })
    
    const items = {
        add: [],
        edit: []
    }
    
    const r_items = req_body.items;
    if(r_items && Array.isArray(r_items) && r_items.length)
        r_items.forEach( item => {
            if(!item._id){
                items.edit.push(item)
            }else{
                items.add.push(item)
            }
        })

    return await knex.transaction( async trx => {
        const [ response ] = await trx("construction_scheme.material_quotations")
            .update(materialQuotation)
            .where({ id: req_body.id })
            .returning("*");

        await knex("construction_scheme.material_quotation_status")
            .insert({
                id: nanoid(),
                material_quotation_id: req_body.id,
                status: "p_quotation_edited"
            })

        if(items.add.length){
            await trx("construction_scheme.material_quotation_items")
                .insert(items.add.map( item => {
                    return filterKeys(keysItem, item, { id: nanoid(), material_quotation_id: req_body.id })
                }))
        }

        if(items.edit.length){
            const promises = []
            items.edit.forEach( item => {
                let query = trx("construction_scheme.material_quotation_items")
                    .update(filterKeys(keysItem, item))
                    .where({ id: item.id })

                promises.push(query)
            })
            await Promise.all(promises)
        }

        return response
    })
}