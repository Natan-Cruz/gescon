import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import { treeify } from "../utils"

export async function getAllRegisters(company_id, req_query){
    if(!company_id) 
        throw new Error("company_id necessario")

    let queryStartPath = ""

    if(req_query.construction_id){
        const [ constr ] = await knex("construction_scheme.constructions as c")
            .select("cc.path")
            .innerJoin("cost_center as cc", "cc.id", "c.tree_structure_id")
            .where({ "c.id": req_query.construction_id, deleted_at: null })

        if(constr)
            req_query.start_path = constr.path
    }

    if(req_query.start_path){
        queryStartPath = knex.raw("path <@ ?", [ req_query.start_path ])
    }

    const registers = await knex("cost_center")
        .select("*")
        .where({ company_id: company_id, deleted_at: null })
        .andWhereRaw(queryStartPath)
        .orderByRaw(knex.raw(`CHAR_LENGTH(ltree2text("path"))`))

    const tree = req_query.tree;
    if(tree && tree === "1"){
        return treeify(registers)
    }else{
        return registers
    }
}

export async function getFullPathName(path){
    const withRaw = knex.raw(`select *  from "cost_center" where "path" @> '${ path }' ORDER BY CHAR_LENGTH(ltree2text("path"))`)
    const selectRaw = knex.raw(`string_agg(cent.name, '/') as "path_name"`)
    const [{ path_name }] = await knex.with("cent", withRaw)
        .select(selectRaw).from("cent").innerJoin("cost_center as cc", function() {
            this.on(knex.raw(`cc.path ~ '${ path }'`))
        }).groupBy("cent.company_id")

    return path_name
}

export async function createRegister(req_body){
    if(!req_body)
        throw new Error("req_body necessario em createRegister")

    const allowKeys = [
        "company_id",
        "name",
        "description",
        "type_category",
        "order"
    ]

    const path = `${req_body.parent_path}.${ nanoid(6) }`

    const register = filterKeys(allowKeys, req_body, { id: nanoid(), path }) 

    return await knex.transaction( async trx => {
        const [response] = await trx("cost_center").returning("*").insert(register)

        if(req_body.type_category === "construction")
            await trx("construction_scheme.constructions").insert({
                id: nanoid(),
                companyID: req_body.company_id,
                name: req_body.name,
                cost_center_id: register.id,
                description: req_body.description
            })

        if(req_body.type_category === "asset")
            await trx("financial_scheme.assets").insert({
                id: nanoid(),
                company_id: req_body.company_id,
                cost_center_id: register.id,
                name: req_body.name,
                description: req_body.description
            })

        if(req_body.type_category === "service"){
            const [construction] = await trx("cost_center as cc")
                .select("c.id")
                .innerJoin("constructions as c", "c.cost_center_id", "cc.id")
                .andWhereRaw(knex.raw(`cc."path" @> '${req_body.parent_path}'`))
                .where({ "cc.type_category": "construction" })

            await trx("construction_scheme.services").insert({
                id: nanoid(),
                tree_structure_id: register.id,
                construction_id: construction.id,
                entity_id: req_body.entity_id,
                name: req_body.name,
                description: req_body.name
            })
        }

        return response
    })
    
}

export async function editRegister(req_body){
    if(!req_body)
        throw new Error("registerID ou req_body necessario em editBankTransfer")

    const allowKeys = [
        "name",
        "enabled",
        "path"
    ]
    const register = filterKeys(allowKeys, req_body) 

    const [response] = await knex("cost_center").returning("*").update(register).where({ id: req_body.id })
    return response;
}

// array with alterations
export async function editOrder(req_body){
    
    req_body = req_body[0]
    if(!req_body)
        throw new Error("Erro no body")

    const items = await knex("cost_center")
        .select("*")
        .whereRaw(knex.raw("\"path\" ~ ?", [ `${getParent(req_body.path)}.*{1,1}` ]))
        .andWhere({ company_id: req_body.company_id })
        .orderBy("order")


    const updates = items
        .map( item => {
            if(item.id === req_body.id)
                item.order = req_body.newOrder;

            return item
        })
        .sort((a,b) => a.order - b.order)
        .map((item, i) => {
            item.order = i + 1
            return item
        })

    return await knex.transaction( async trx => {
        const promises = []

        updates.forEach(({ id, order }) => {
            let query = trx("cost_center")
                .update({ order }).where({ id })
    
            promises.push(query)
        })


        await Promise.all(promises)
    
        return true;
    })
}

function getParent(path){
    path = path.split(".")
    path.pop();
    return path.join(".")
}

export async function deleteRegister(item_id){
    if(!item_id) 
        throw new Error("item_id necessario")

    const response = await knex("cost_center")
        .update({ deleted_at: "now()" })
        .where("path", "<@", function(){
            this.select("path")
                .from("cost_center")
                .where({ id: item_id })
        })
        
    console.log(response)
    return response;
}