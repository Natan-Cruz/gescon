import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import GesconError from "../../../../utils/GesconError"

export async function getPermissions(){
    return await knex("user_scheme.permissions").select("*")
}

export async function getRoles(company_id){
    if(!company_id && typeof company_id !== 'string') 
        throw new Error("companyID necessario")

    return await knex("user_scheme.roles").select("*").where({ company_id: company_id })     
}

export async function getOneRole(roleId){
    if(!roleId && typeof roleId !== 'string') 
        throw new Error("roleId necessario")
    
    const [ role ] = await knex("user_scheme.roles").select("*").where({ id: roleId })
    
    if(!role)
        throw new GesconError("Papel nao encontrado!!")
    
    const permissions = await knex("user_scheme.role_permissions").select("permission").where({ role_id: roleId })

    return {
        ...role,
        permissions: permissions.map(({ permission }) => permission )
    }
}

export async function createNewRole(req_body){
    const allowedKeys = [
        "company_id",
        "name",
        "display_name",
        "description"
    ]
    const role = filterKeys(allowedKeys, req_body, { id: nanoid() })

    const permissions = []
    const r_permissions = items;

    if(r_permissions && Array.isArray(r_permissions) && r_permissions.length)
    r_permissions.forEach( permission => {
        permissions.push({
            role_id: role.id,
            permission: permission
        })
    })

    return await knex.transaction( async trx => {
        const [ result ] = await trx("user_scheme.roles").insert(role).returning("*")

        if(permissions.length)
            await trx("user_scheme.role_permissions").insert(permissions);
            
        return result
    })
}

export async function editRole(req_body){
    if(!req_body || !req_body.id)
        return new Error("Parametros faltantes")

    const allowedKeys = [
        "name",
        "display_name",
        "description"
    ]
    const alterations = filterKeys(allowedKeys, req_body)

    const userPermissions = await knex("user_scheme.role_permissions").select("permission").where({ role_id: req_body.id })

    const permissionsActions = { add: [], remove:[] }
    const r_permissions = req_body.permissions
    
    r_permissions && r_permissions.forEach( formPermissionId => {
        const has = (userPermissions.map(({ permission }) => permission ).indexOf(formPermissionId) > -1)
        if(!has)
            permissionsActions.add.push({
                role_id: req_body.id,
                permission: formPermissionId
            })
    });

    userPermissions.forEach( ({ permission }) => {
        const has = r_permissions && (r_permissions.indexOf(permission) > -1)
        if(!has)
            permissionsActions.remove.push({ permission, role_id: req_body.id })
    });


    return await knex.transaction( async trx => {
        if(Object.entries(alterations).length){
            await trx("user_scheme.roles").update(alterations).where({ id: req_body.id });
        }
        const promises = [];
        
        if(permissionsActions.add.length){
            promises.push(trx("user_scheme.role_permissions").insert(permissionsActions.add))
        }
    
        if(permissionsActions.remove.length)
            permissionsActions.remove.forEach( ({ permission, role_id }) => {
                promises.push(trx("user_scheme.role_permissions").delete().where({ permission, role_id }))
            })

        await Promise.all(promises)
    })
    
}






// function formatTrx(items, tableName, query){
//     const oldItems = knex(tableName).select("*").where(query)

//     const permissionsActions = { add: [], remove:[] }

//     items && items.forEach( formPermissionId => {
//         const has = (oldItems.map(({ permission }) => permission ).indexOf(formPermissionId) > -1)
//         if(!has)
//             permissionsActions.add.push({
//                 id: nanoid(),
//                 role_id: req_body.id,
//                 permission: formPermissionId
//             })
//     });

//     oldItems.forEach( ({ permission }) => {
//         const has = items && (items.indexOf(permission) > -1)
//         if(!has)
//             permissionsActions.remove.push({ permission, role_id: req_body.id })
//     });


//     const promises = []

//     promises.push(trx(tableName).insert(permissionsActions.add.map( permission => {
//         return {
//             permission: permission.permission, 
//             role_id: permission.role_id
//         }
//     })))


//     if(permissionsActions.remove.length)
//     for(const { permission, role_id } of permissionsActions.remove)
//         trx("user_scheme.user_permissions").delete().where({ permission, role_id })


//     return promises;
// }