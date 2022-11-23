import nanoid from "../../../../utils/nanoid";
import knex from "../../../../database/database.knex"
import sendMail from "../../../../services/email"
import { generateTokenForResetPassword } from "../utils/utils";
import dayjs from "dayjs";

export async function generateAndSaveToken(user_id, user_email){
    if(!user_id || !user_email)
        throw new Error("userID OU userEmail do usuário necessário");

    const token = generateTokenForResetPassword({ id: user_id, email: user_email });

    await knex("user_scheme.password_resets")
        .insert({
            id: nanoid(),
            user_id: user_id,
            token: token,
            valid_until: dayjs().add(1, "day").toISOString()
        })

    return token;
}

export async function sendResetTokenToUserEmail(email, username, token){
    if(!email || !token)
        throw new Error("Email ou token do usuário necessário")

    const subject = "Recuperação de conta - Gescon";

    const templateConfig = {
        username,
        recoveryPasswordUrl: `https://app.gescon.tec.br/auth/reset-password/change/${ token }`
    }
    return await sendMail({ templateEmailName: "recovery-user-account", templateConfig}, { email, subject })
}

export async function verifyHasTokenInDatabase(token){
    const [ has ] = await knex("user_scheme.password_resets")
        .select(0)
        .where({
            token: token
        }) 
        .limit(1)

    return !!has
}