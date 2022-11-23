import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";

export async function getAllMembersInConstruction(construction_id){
    if(!construction_id)
        throw new Error("construction_id faltante")

    const members = await knex("construction_scheme.construction_members as c_m")
        .select("c_m.*", "u.photo_file_url", "u.first_name", "u.last_name", "u.title", "u.email")
        .innerJoin("user_scheme.users as u", "u.id", "c_m.user_id")
        .where({ "c_m.construction_id": construction_id })

    const permissions = await knex("user_scheme.user_permission_constructions")
        .select("module_name", "user_id")
        .whereIn("user_id", members.map(({ user_id }) => user_id ))
        .andWhere({ construction_id })

    return members.map( member => {
        member.permissions = permissions.filter( permission => permission.user_id === member.user_id ).map(({ module_name }) => module_name)
        return member
    })
}

export async function getNonMembersInConstruction(construction_id, company_id){
    if(!construction_id)
        throw new Error("construction_id faltante")

    const users = await knex("user_scheme.users")
        .select("id","first_name", "last_name", "title")
        .where({ company_id })

    // const members = await knex("construction_scheme.construction_members as c_m")
    //     .select("u.user_id")
    //     .innerJoin("user_scheme.users as u", "u.id", "c_m.user_id")
    //     .where({ "c_m.construction_id": construction_id })


    return users.filter( user => {
        // const member = members.find( member => member.user_id === user.id)
        // if(!member) return user
        return user
    })
}

export async function addMember(req_body){
    const { members: r_members, permissions: r_permissions, construction_id } = req_body;

    const members = [];
    const permissions = [];

    // adiciona no um objecto membro no array
    r_members && r_members.forEach( user_id => {
        members.push({
            id: nanoid(),
            construction_id: construction_id,
            user_id: user_id
        })

        r_permissions && r_permissions.forEach( permission => {
            permissions.push({
                id: nanoid(),
                user_id: user_id,
                construction_id: construction_id,
                module_name: permission
            })
        })
    })

    return await knex.transaction( async trx => {

        if(members.length)
            await trx("construction_scheme.construction_members") .insert(members)
            
        if(permissions.length)
            await trx("user_scheme.user_permission_constructions").insert(permissions).returning("*")
            
        const result = await trx("construction_scheme.construction_members as c_m")
            .select("c_m.*", "u.photo_file_url", "u.first_name", "u.last_name", "u.title", "u.email")
            .innerJoin("user_scheme.users as u", "u.id", "c_m.user_id")
            .whereIn("c_m.id", members.map( ({ id }) => id ) )

        return result.map( member => {
            member.permissions = permissions
            return member
        })
    })
}

export async function editMember(req_body){
    if(!req_body || !req_body.permissions || !req_body.members || !req_body.construction_id)
        throw new Error("body invalido")

    const userId = req_body.members[0]

    const userPermissions = await knex("user_scheme.user_permission_constructions")
        .select("id", "module_name")
        .where({ user_id: userId, construction_id: req_body.construction_id })

    const permissionsActions = { add: [], remove:[] }

    req_body.permissions && req_body.permissions.forEach( module_name => {
        const has = (userPermissions.map( uPermission => uPermission.module_name ).indexOf(module_name) > -1)
        if(!has)
            permissionsActions.add.push({
                id: nanoid(),
                user_id: userId,
                construction_id: req_body.construction_id,
                module_name: module_name
            })
    });

    userPermissions.forEach( ({ module_name }) => {
        const has = req_body.permissions && (req_body.permissions.indexOf(module_name) > -1)
        if(!has)
            permissionsActions.remove.push({ module_name, user_id: userId, construction_id: req_body.construction_id })
    });

    return await knex.transaction( async trx => {
        if(permissionsActions.add.length)
            await trx("user_scheme.user_permission_constructions").insert(permissionsActions.add)
        
        if(permissionsActions.remove.length){
            let promises = []
            permissionsActions.remove.forEach( action => {
                let query = trx("user_scheme.user_permission_constructions").del().where(action)
                promises.push(query)
            })
            await Promise.all(promises)
        }
    })
}

export async function removeMember(constr_member_id){
    if(!constr_member_id)
        throw new Error("constr_member_id faltante")

    return await knex.transaction( async trx => {
        const [ response ] = await trx("construction_scheme.construction_members").del().where({ id: constr_member_id }).returning('*')

        await trx("user_scheme.user_permission_constructions").del().where({ user_id: response.user_id, construction_id: response.construction_id })

        return response;
    })
}
