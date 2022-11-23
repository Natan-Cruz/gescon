import knex from "../../../../database/database.knex";
import * as bcrypt from "bcrypt";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import sendMail from "../../../../services/email";
import { generateTokenForResetPassword } from "../utils/utils";
import dayjs from "dayjs"
import * as jwt from "../utils/utils"
import saveLog from "../../erpActivyLogs"

export async function searchUser(field, value){
    const [ user ] = await knex("user_scheme.users as u")
        .select("u.*", "c.id as company_id", "c.name as company_name")
        .innerJoin("companies as c", "c.id", "u.company_id")
        .whereRaw(knex.raw(`u.${ field } = ?`, [ value ]))
        .limit(1)

    if(!user)
        throw new Error("Usuário não encontrado!")

    return user
}

export async function getAccessControl(user_id){
    const promiseRoles = knex("user_scheme.user_roles as ur")
        .select("r.id", "r.name")
        .innerJoin("user_scheme.roles as r", "r.id", "ur.role_id")
        .where({ "ur.user_id" :user_id })

    const promiseRolesPermissions = knex("user_scheme.user_roles as ur")
        .select("p.id", "p.name")
        .leftJoin("user_scheme.role_permissions as rp", "rp.role_id", "ur.role_id")
        .leftJoin("user_scheme.permissions as p", "p.id", "rp.permission_id")
        .where({ "ur.user_id": user_id })

    const promiseUser_permissions = knex("user_scheme.user_permissions as up")
        .select("p.id", "p.name")
        .innerJoin("user_scheme.permissions as p", "p.id", "up.permission_id")
        .where({ user_id })

    const promiseModulesContractedCompany = knex("modules_contracted_company as mcc")
        .select("mcc.id", "mcc.module_name")
        .innerJoin("user_scheme.users as u", "u.company_id", "mcc.company_id")
        .where({ "u.id": user_id, "mcc.enabled": true })

    const [ roles, rolesPermissions, user_permissions, modules_contracted_company ] = await Promise.all([ promiseRoles, promiseRolesPermissions, promiseUser_permissions, promiseModulesContractedCompany ])

    const objectMap = [...rolesPermissions, ...user_permissions ].reduce((map, object) => {
        map.set(object.id, object);
        return map
      }, new Map())
      
    const permissions = Array.from(objectMap, ([_, value]) => value)

    return {    
        roles,
        user_permissions,
        permissions,
        modules_contracted_company
    }
}


export async function editProfileUser(req_body) {
    const keys = [
        "first_name",
        "last_name",
        "email",
        "phone",
        "password"
    ]

    const alterations = filterKeys(keys, req_body)

    if(alterations.email){
        alterations.confirmed_email = false;
    }

    if(!Object.entries(alterations).length) return;

    return await knex.transaction( async trx => {
        await trx("user_scheme.users").update(alterations).where({ id: req_body.user_id })

        // await saveLog({
        //     company_id: req_body.company_id,
        //     user_id: req_body.user_id,
        //     message: "Editou sua própria conta",
        //     ip: req_body.ip
        // },trx)
    })
}

export async function changeUserPassword(userID, newPassword, token){
    const newPasswordHash = await bcrypt.hash(newPassword, 8)

    return await knex.transaction( async trx => {
        const [user] = await trx("user_scheme.users")
            .returning("*")
            .update({ password: newPasswordHash })
            .where({ id: userID })

        await trx("user_scheme.password_resets")
            .delete()
            .where({ token: token });
        
        return user
    })
}

export async function saveDeviceToken(user_id, req_body){
    if(!user_id || !req_body) 
        throw new Error("Parametros faltantes")

    const [ has ] = await knex("user_scheme.device_tokens").select(0).where({ user_id, token: req_body.token })

    if(has) return true

    const [ token ]= await knex("user_scheme.device_tokens").insert({
        id: nanoid(),
        user_id,
        token: req_body.token
    }).returning("*")

    return token
}

export async function removeDeviceToken(user_id, req_body){
    if(!user_id || !req_body) 
        throw new Error("Parametros faltantes")

    return await knex("user_scheme.device_tokens").del().where({ user_id, token: req_body.token })
}

// 

export async function sendConfirmationEmail(user_id){
    if(!user_id) 
        throw new Error("Parametros faltantes")

    const [user] = await knex("user_scheme.users")
        .select("email", "confirmed_email")
        .where({ id: user_id })

    if(!user)
        throw new Error("Usuário não encontrada!")

    if(user.confirmed_email)
        return { confirmed_email: true }

    const token = generateTokenForResetPassword({ id: user_id, email: user.email });

    await knex("user_scheme.password_resets")
        .insert({
            id: nanoid(),
            user_id: user_id,
            token: token,
            valid_until: dayjs().add(1, "day").toISOString()
        })

    const templateOpts = {
        templateEmailName: "confirm-email",
        templateConfig: {
            url: "https://gescon-tec.herokuapp.com/erp/users/confirm-email?token=" + token
        }
    }

    const emailOpts = {
        email: user.email,
        subject: "Confirmar email",
        body: ""
    }

    return await sendMail(templateOpts, emailOpts)
}

export async function confirmEmail(token){
    const [ has ] = await knex("user_scheme.password_resets")
        .select("user_id")
        .where({ token: token }) 
        .limit(1)

    if(!has)
        return "<h2>Token inválido ou expirado</h2>"

    const decoded = await jwt.verifyToken(token)

    if(!decoded)
        return "<h2>Token inválido ou expirado</h2>"


    return await knex.transaction( async trx => {
        await trx("user_scheme.password_resets").del().where({ token })
        await trx("user_scheme.users").update({ confirmed_email: true }).where({ id: has.user_id })

        return "<h2>Email confirmado com sucesso, podes fechar esta página</h2>"
    })
}