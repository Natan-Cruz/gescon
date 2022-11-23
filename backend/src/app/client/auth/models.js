import knex from "../../../database/database.knex"

export async function getEntityClient(identifier){
    if(!identifier || typeof identifier !== "string")
        throw new Error("Email faltante ou do tipo errado")

    const typeIdentifier = defineTypeIdentifier(identifier)
    
    if(typeIdentifier === "EMAIL"){
        const [ client ] = await knex("entities").select("*").where({ email: identifier }).whereRaw("roles ILIKE '%client%'").limit(1)
        return client;
    }
    
    if(typeIdentifier === "CPF" || typeIdentifier === "CNPJ"){
        const [ client ] = await knex("entities").select("*").where({ documentType: typeIdentifier, documentValue: removeMask(identifier) }).whereRaw("roles ILIKE '%client%'").limit(1)
        return client;
    }

    throw new Error("Type identifier errado")
}

function defineTypeIdentifier(identifier){
    // se email
    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if(emailRegex.test(identifier))
        return "EMAIL"

    const cpfRegex = new RegExp(/^\d{3}[\.]?\d{3}[\.]?\d{3}[\-]?\d{2}$/)
    if(cpfRegex.test(identifier))
        return "CPF" 
        
    const cpnjRegex = new RegExp(/^\d{2}[\.]?\d{3}[\.]?\d{3}[\/]?\d{4}[\-]?\d{2}$/)
    if(cpnjRegex.test(identifier))
        return "CNPJ" 
}   

function removeMask(value){
    return value.replace(/[^\d]/gi,"")
}

export async function editMyAccount( userId, reqBody ) {
    const alterations = {}
    if(reqBody.name) alterations.name = reqBody.name;
    if(reqBody.email) alterations.email = reqBody.email;
    if(reqBody.cellphone) alterations.cellphone = reqBody.cellphone;
    if(reqBody.commercialPhone) alterations.commercialPhone = reqBody.commercialPhone;

    if(Object.entries(alterations).length)
        await knex("entities").update(alterations).where({ id: userId })

    return true;
}

export async function changeUserPassword(userID, newPassword, token){
    const newPasswordHash = await bcrypt.hash(newPassword, 8)

    return await knex.transaction( async trx => {
        const [user] = await trx("users").returning("*").update({ password: newPasswordHash }).where({ id: userID })
        await trx("passwordRecoveryToken").delete().where({ token: token });
        delete user.password;
        
        return user
    })
}