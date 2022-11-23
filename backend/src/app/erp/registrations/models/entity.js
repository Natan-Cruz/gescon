import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import GesconError from "../../../../utils/GesconError";
import saveLog from "../../erpActivyLogs";

export async function getAllEntities(company_id, role, req_query){
    if(!company_id) throw new Error("Parametros faltantes");

    const query = {
        search: "",
        role: "",
        select: "",
        deleted: ""
    }

    const { search, minimal, deleted } = req_query;

    if(search){
        query.search = knex.raw(`e.name ILIKE ? OR e.corporate_name ILIKE ?`, [ `%${ search }%`, `%${ search }%` ]);
    }
    if(role){
        query.role = knex.raw(`e.roles ILIKE ?`, [ `%${ role }%` ])
    }
    if(minimal){
        query.select = ["e.id", "e.name"];
    }else{
        query.select = ["e.*", "ec.email", "ec.phone", "ec.phone_2"];
    }

    if(deleted && deleted === "1"){
        query.deleted = knex.raw("e.deleted_at is not null")
    } else {
        query.deleted = knex.raw("e.deleted_at is null")
    }

    const result = await knex('entities as e')
        .select(query.select)
        .leftJoin("entity_contacts as ec", "ec.id", function(){
            this.select("id")
                .from("entity_contacts")
                .where("entity_id", "=", knex.raw("e.id"))
                .andWhere({ is_primary: true })
                .limit(1)
        })
        .where({ "e.company_id": company_id })
        .andWhereRaw(query.search)
        .andWhereRaw(query.role)
        .andWhereRaw(query.deleted)
        .limit(100)

    return result
}

export async function getAllEntitiesContacts(company_id){
    const contacts = await knex("entity_contacts as ec")
        .select("ec.*", "e.name as entity_name", "e.id as entity_id")
        .innerJoin("entities as e", "e.id", "ec.entity_id")
        .where({ "e.company_id": company_id })

   return contacts
}

export async function getOneEntity(entity_id){
    if(!entity_id)
        throw new Error("entity_id ausente!")

    const [ entity ] = await knex("entities")
        .select("*")
        .where({ id: entity_id })

    if(!entity)
        throw new GesconError("Entidade não encontrada!")

    const promiseContacts = knex("entity_contacts").select('*').where({ entity_id })
    const promiseAddresses = knex("entity_addresses").select("*").where({ entity_id })

    const [ contacts, addresses ] = await Promise.all([ promiseContacts, promiseAddresses ]) 

    const mainContact = contacts.find( contact => contact.is_primary)
    const otherContacts = contacts.filter( contact => !contact.is_primary)

    return {
        ...entity,
        roles: entity.roles.split(","),
        main_contact: mainContact || {},
        contacts: otherContacts,
        addresses
    }
}

export async function createNewEntity(req_body){
    if(!req_body)
        throw new Error("Body ausente!")
        
    const allowedKeys = [
        "company_id",
        "name",
        "corporate_name",
        "document_type",
        "document_value",
        "legal_type",
        "registration_code",
        "note",
    ];
    const keysContact = [
        "contact_person",
        "email",
        "phone",
        "phone_2",
        "role",
        "initial_date"
    ]
    const keysAddress = [
        "cep",
        "city",
        "complement",
        "country",
        "neighborhood",
        "number",
        "state",
        "street",
        "title",
        "is_primary"
    ]
    
    const entity = filterKeys(allowedKeys, req_body, { id: nanoid() })
    const contacts = [],
        addresses = [];
    
    const r_contacts = req_body.contacts,
        r_roles = req_body.roles,
        r_addresses = req_body.addresses;
    
    if(r_roles && Array.isArray(r_roles) && r_roles.length)
        entity.roles = r_roles.join(",")
    else
        throw new Error("Defina o papel do cadastro!")

    if(r_addresses && Array.isArray(r_addresses) && r_addresses.length){
        r_addresses.forEach( address => {
            addresses.push(filterKeys(keysAddress, address, { id: nanoid(), entity_id: entity.id }))
        })
    }

    contacts.push(filterKeys(keysContact, req_body.main_contact, { id: nanoid(), entity_id: entity.id, is_primary: true }))
    if(r_contacts && Array.isArray(r_contacts) && r_contacts.length){
        r_contacts.forEach( contact => {
            contacts.push(filterKeys(keysContact, contact, { id: nanoid(), entity_id: entity.id }))
        })
    }

    return await knex.transaction( async trx => {
        const [ result ] = await trx("entities").insert(entity).returning("*")

        if(contacts.length)
            await trx("entity_contacts").insert(contacts)

        if(addresses.length)
            await trx("entity_addresses").insert(addresses)

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "entity",
            message: "Novo cadastro foi realizado",
            ip: req_body.ip,
            reference: "entities",
            reference_id: entity.id
        }, trx)

        return {
            ...result,
            roles: entity.roles.split(",")
        };
    })
}

;(async () => {
    const entities = await knex("entities")
        .select("id", "email", "phone", "phone_2", "initial_date")

    const contacts = entities.map( entity => {
        return {
            id: nanoid(),
            entity_id: entity.id,
            email: entity.email,
            phone: entity.phone,
            phone_2: entity.phone_2,
            initial_date: entity.initial_date,
            is_primary: true
        }
    })

    await knex("entity_contacts").insert(contacts)

    console.log("done")
})

export async function editEntity(req_body){
    if(!req_body || !req_body.id) 
        throw new Error("Entity ou entity_id faltantes");

    const allowedKeys = [
        "name",
        "corporate_name",
        "document_type",
        "document_value",
        "legal_type",
        "registration_code",
        "note",
    ]

    const keysAddress = [ "cep", "city", "complement", "country", "neighborhood", "number", "state", "street", "title", "is_primary" ]
    const keysContact = [ "contact_person", "email", "phone", "phone_2", "role", "initial_date" ]

    const alterations = filterKeys(allowedKeys, req_body);
    if(req_body.roles)
        alterations.roles = req_body.roles.join(',')

    const r_contacts = req_body.contacts || []

    if(req_body.main_contact)
        r_contacts.push(req_body.main_contact)

    return await knex.transaction( async trx => {
        if(Object.entries(alterations).length)
            await trx("entities").returning("*").update(alterations).where({ id: req_body.id })
        
        const addresses = teste(req_body.addresses, { entity_id: req_body.id }, keysAddress, "entity_addresses", trx )
        const contacts = teste(r_contacts, { entity_id: req_body.id }, keysContact, "entity_contacts", trx )

        if(Object.entries(alterations).length || addresses.length || contacts.length)
            await saveLog({
                company_id: req_body.company_id,
                user_id: req_body.user_id,
                source: "entity",
                message: "Cadastro foi editado!",
                ip: req_body.ip,
                reference: "entities",
                reference_id: req_body.id
            }, trx)

        await Promise.all([ ...addresses, ...contacts ])
    })
}

export async function deleteEntity(req_body){
    if(!req_body.id) 
        throw new Error("Entity_id necessario")

    return await knex.transaction( async trx => {
        await trx("entities").update({ deleted_at: "now()" }).where({ id: req_body.id })

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "entity",
            message: "Cadastro foi excluido!",
            ip: req_body.ip,
            reference: "entities",
            reference_id: req_body.id
        }, trx)
    })
}

function teste(elements, params, keys, tableName, trx){
    
    if(!elements || !Array.isArray(elements))  return []
    
    const add = [], remove = [], update = [];

    elements
        // Remove aqueles que não possuem instruções
        .filter( element => element && element.action )
        // classifica items
        .forEach( element => {
            const action = element.action
            delete element.action

            switch(action){
                case "ADD": add.push(filterKeys(keys, element, { id: nanoid(), ...params })); break
                case "REMOVE": remove.push(element); break
                case "UPDATE": update.push(element); break
            }
        });

    const promises = [];

    add.length && promises.push(trx(tableName).insert(add));

    remove.length && remove.forEach(({ id }) =>  promises.push(trx(tableName).del().where({ id: id })) )

    update.length && update.forEach( item => {
        const promise = trx(tableName).update(filterKeys(keys, item)).where({ id: item.id })
        promises.push(promise)
    })

    return promises;
}