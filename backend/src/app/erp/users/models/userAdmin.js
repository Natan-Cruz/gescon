import knex from "../../../../database/database.knex"
import nanoid from "../../../../utils/nanoid"
import { filterKeys } from "../../../../utils/Utils"
import saveLog from "../../erpActivyLogs"

export async function getAllUsers(company_id){
    return await knex('user_scheme.users')
        .select("*")
        .where({ "company_id": company_id })
        .orderBy("created_at", "asc")
}

export async function createNewUser(req_body){

    const keys = [
        "company_id",
        "first_name",
        "last_name",
        "email", 
        "title",
        "phone",
        "password"
    ]

    const user = filterKeys(keys, req_body, { 
        id: nanoid(), 
        phone: req_body.phone.replace(/[^\d]+/g,'')
    })

    const r_permissions = req_body.permissions;
    const permissions = []


    r_permissions && r_permissions.forEach( permission => {
        permissions.push({
            id: nanoid(),
            userID: user.id,
            level: permission
        })
    })

    return await knex.transaction( async trx => {
        const [ result ] = await trx("user_scheme.users").insert(user).returning("*")

        if(permissions.length)
            await trx("user_scheme.user_roles").insert(permissions)

        await trx("folders").insert({
            id: nanoid(),
            folder_name: "root",
            path_ltree_id: "root",
            path_ltree: user.id,
            space_owner: "user",
            was_created_by_system: true
        })

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            ip: req_body.ip,
            message: "Novo usuário criado",
            reference: "user",
            reference_id: user.id
        }, trx)
        
        return result
    })
}

export async function editUser(req_body){
    if(!req_body || !req_body.id)
        throw new Error("Parametros necessarios: editUser")

    const keys = [
        "first_name",
        "last_name",
        "email",
        "title",
        "phone"
    ]

    const alterations = filterKeys(keys, req_body)
    
    if(alterations.email){
        alterations.confirmed_email = false;
    }

    const userRoles = await knex("user_scheme.user_roles").select("role_id").where({ user_id: req_body.id })
    const userPermissions = await knex("user_scheme.user_permissions").select("permission").where({ user_id: req_body.id })

    const rolesActions = { add: [], remove:[] }
    const permissionsActions = { add: [], remove:[] }
    
    req_body.roles && req_body.roles.forEach( formRoleId => {
        const has = (userRoles.map(({ role_id }) => role_id).indexOf(formRoleId) > -1)
        if(!has)
            rolesActions.add.push({
                user_id: req_body.id,
                role_id: formRoleId
            })
    });

    userRoles.forEach(({ role_id }) => {
        const has = req_body.roles && (req_body.roles.indexOf(role_id) > -1)
        if(!has)
            rolesActions.remove.push({ role_id, user_id: req_body.id })
    });

    req_body.permissions && req_body.permissions.forEach( formPermissionId => {
        const has = (userPermissions.map(({ permission }) => permission ).indexOf(formPermissionId) > -1)
        if(!has)
            permissionsActions.add.push({
                id: nanoid(),
                user_id: req_body.id,
                permission: formPermissionId
            })
    });

    userPermissions.forEach( ({ permission }) => {
        const has = req_body.permissions && (req_body.permissions.indexOf(permission) > -1)
        if(!has)
            permissionsActions.remove.push({ permission, user_id: req_body.id })
    });


    return await knex.transaction( async trx => {
        if(Object.entries(alterations).length){
            await trx("user_scheme.users").update(alterations).where({ id: req_body.id });
        }
        
        if(rolesActions.add.length)
            await trx("user_scheme.user_roles").insert(rolesActions.add.map( role => {
                return {
                    role_id: role.role_id, 
                    user_id: role.user_id
                }
            }))

        if(rolesActions.remove.length)
            for(const {  role_id, user_id } of rolesActions.remove)
                await trx("user_scheme.user_roles").delete().where({ role_id, user_id })
                
        if(permissionsActions.add.length)
                await trx("user_scheme.user_permissions").insert(permissionsActions.add.map( permission => {
                    return {
                        permission: permission.permission, 
                        user_id: permission.user_id
                    }
                }))
    
        if(permissionsActions.remove.length)
            for(const { permission, user_id } of permissionsActions.remove)
                await trx("user_scheme.user_permissions").delete().where({ permission, user_id })
        
    })
}

export async function getOneUser(userID){
    const [ user ] = await knex("user_scheme.users")
        .select("id", "first_name", "last_name", "title", "email", "phone")
        .where({ id: userID })
        .limit(1);

    const [{ totalUsed }] = await knex("files as fl")
        .select(knex.raw(`SUM(fl.size) as "totalUsed"`))
        .innerJoin("folders as f", "f.id", "fl.folder_id")
        .where({ space_owner: "user" })
        .andWhereRaw(knex.raw(`f."path_ltree" ~ ?`, [ `${userID}.*` ]))

    delete user.password

    const roles = await knex("user_scheme.user_roles")
        .select("role_id")
        .where({ user_id: userID })

    const permissions = await knex("user_scheme.user_permissions")
        .select("permission")
        .where({ user_id: userID })

    return {
        ...user,
        roles: roles.map(({role_id}) => role_id),
        permissions: permissions.map(({ permission }) => permission),
        spaceUsedInCloud: {
            availableSpaceInBytes: 15 * 1073741824, //15 gb
            totalUsed: totalUsed
        }
    }
}