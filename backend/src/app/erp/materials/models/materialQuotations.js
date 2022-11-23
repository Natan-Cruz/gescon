import knex from "../../../../database/database.knex";
import { filterKeys, formatActions } from "../../../../utils/Utils"
import nanoid from "../../../../utils/nanoid"
import GesconError from "../../../../utils/GesconError";
import sendMail from "../../../../services/email";

export async function getAllMaterialQuotations(req_query){
    const { company_id } = req_query;

    return await knex("construction_scheme.material_quotations as mq")
        .select("mq.*", "e.name as provider_name")
        .innerJoin("public.entities as e", "e.id", "mq.provider_id")
        .where({ "mq.company_id": company_id })
}

export async function getOneMaterialQuotation(id, query){
    if(!id) throw new Error("Id material quotation não defindo!!")

    const { edit_all } = query;

    const [ quotation ] = await knex("construction_scheme.material_quotations")
        .select("*")
        .where({ "id": id })

    if(!quotation) throw new GesconError("Cotação de material não encontrado!!")

    const items = await knex("construction_scheme.material_quotation_items")
        .select("*")
        .where({ "material_quotation_id": id })

    return {
        ...quotation,
        providers: [quotation.provider_id],
        items
    }
}

export async function getOneMaterialQuotationShow(id){
    if(!id) 
        throw new Error("Id material quotation não defindo!!")

    const materialQuotations = await knex("construction_scheme.material_quotations as mq")
        .select(
            "mq.*",
            "e.name as provider_name",
            "e.email as provider_email", 
            "e.commercialPhone as provider_commercial_phone",
            "e.cellphone as provider_cellphone",
            "e.street as provider_street",
            "e.number as provider_number", 
            "e.neighborhood as provider_neighborhood", 
            "e.city as provider_city", 
            "e.state as provider_state"
        )
        .innerJoin("public.entities as e", "e.id", "mq.provider_id")
        .where("mq.group_id", "=", function(){
            this
                .select("group_id")
                .from("construction_scheme.material_quotations")
                .where({ id: id })
        })

    if(!materialQuotations || !materialQuotations.length)
        throw new GesconError("Cotação de material não encontrado!!")
   
    const items = await knex("construction_scheme.material_quotation_items")
        .select("*")
        .whereIn("material_quotation_id", materialQuotations.map(({id}) => id ))

    const status = await knex("construction_scheme.material_quotation_status as mqs")
        .select("*")
        .whereIn("material_quotation_id", materialQuotations.map(({id}) => id ))

    return materialQuotations.map( quotation => {
        quotation.items = items.filter( item => item.material_quotation_id === quotation.id )
        quotation.status = status.filter( sts => sts.material_quotation_id === quotation.id )
        return quotation;
    })
}

export async function createNewMaterialQuotation(req_body) {
    if (!req_body || !req_body.company_id)
        throw new Error("Paramentros faltantes em createMaterial")

    const promiseMaterialQuotationCount = knex("construction_scheme.material_quotations")
        .select(knex.raw("count(*)"))
        .where({ company_id: req_body.company_id })

    const promiseEntities = knex("public.entities as e")
        .select("e.id", "e.email", "c.name as company_name")
        .innerJoin("public.companies as c", "c.id", "e.companyID")
        .whereIn("e.id", req_body.providers)


    const [ [responseCount], entities ] = await Promise.all([ promiseMaterialQuotationCount, promiseEntities ])


    const keysMaterialQuotation = [
        "company_id",
        "expiration_date",
        "delivery_address",
        "responsible_user_id",
        "c_message",
        "c_type_freight",
        "c_payment_method"
    ]

    const materialQuotations = [], items = [], status = [];
    const r_providers = req_body.providers, r_items = req_body.items;
    const groupId = nanoid(6)

    if (r_providers && Array.isArray(r_providers) && r_providers.length)
        r_providers.forEach((provider_id, index) => {
            const opts = {
                id: nanoid(),
                number: (parseInt(responseCount.count) + (index + 1)),
                group_id: groupId,
                provider_id: provider_id
            }
            materialQuotations.push(filterKeys(keysMaterialQuotation, req_body, opts))
            
            status.push({
                id: nanoid(),
                material_quotation_id: opts.id,
                status: "created"
            })
            
            if (r_items && Array.isArray(r_items) && r_items.length)
                r_items.forEach( item => {
                    items.push({
                        id: nanoid(),
                        material_quotation_id: opts.id,
                        material_name: item.material_name,
                        unity: item.unity,
                        quantity: item.quantity,
                        anotation: item.anotation
                    })
                })
        })


    return await knex.transaction(async trx => {
        const [response] = await trx("construction_scheme.material_quotations")
            .insert(materialQuotations)
            .returning("*")

        if(items.length)
            await trx("construction_scheme.material_quotation_items").insert(items)

        for(const { id, email, company_name } of entities){
            const subject = "Cotação de materiais",  body = "Link gerado de maneira automatica"
            const info = materialQuotations.find( qt => qt.provider_id === id)
            const templateConfig = {
                quotation_number: info.number,
                company_name: company_name,
                url: "https://app.gescon.tec.br/public/material-quotation/" + info.id
            }
            try {
                await sendMail({ templateEmailName: "material-quotation", templateConfig }, { email: email, subject, body })
                status.push({
                    id: nanoid(),
                    material_quotation_id: info.id,
                    status: "email_sent"
                })
            } catch (error) {
                status.push({
                    id: nanoid(),
                    material_quotation_id: info.id,
                    status: "email_error"
                })
            }
        }

        await trx("construction_scheme.material_quotation_status")
            .insert(status)

        return response;
    })
}

export async function editMaterialQuotation(req_body){

    const keysMaterialQuotation = [ 
        "c_message",
        "expiration_date",
        "delivery_address",
        "c_type_freight"
    ]
    const keysItem = [
        "material_name",
        "unity",
        "quantity",
        "anotation"
    ]
    const { add, update, remove } = formatActions(req_body.items, "material_quotation_id", req_body.id)

    const materialQuotation = filterKeys(keysMaterialQuotation, req_body)

    let key, value;

    if(req_body.edit_all){
        key = "group_id"
        value = function(){
            this
                .select("group_id")
                .from("construction_scheme.material_quotations")
                .where({ id: req_body.id })
        }
    }else{
        key = "id";
        value = req_body.id
    }

    return await knex.transaction( async trx => { 
        if(Object.entries(materialQuotation).length)
            await trx("construction_scheme.material_quotations")
                .update(materialQuotation)
                .where(key, value);

        if(add.length){
            let query = add.map( item => filterKeys(keysItem, item, { id: nanoid(), material_quotation_id: req_body.id }))

            await trx("construction_scheme.material_quotation_items")
                .insert(query)
        }

        if(update.length){
            const promises = []

            update.forEach( item => {
                let query = trx("construction_scheme.material_quotation_items")
                    .update(filterKeys(keysItem, item))
                    .where({ id: item.id })

                promises.push(query)
            })

            await Promise.all(promises)
        }

        if(remove.length)
            await trx("construction_scheme.material_quotation_items")
                .del()
                .whereIn('id', remove.map(({ id }) => id ))
    })
}