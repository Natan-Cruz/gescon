import * as modelsUser from "../models/user";
import * as modelsAuth from "../models/userAuth"
import Controller from "../../../../utils/Controller";

import * as jwt from "../utils/utils"
import GesconError from "../../../../utils/GesconError";
import logger from "../../../../utils/logger";
import saveLog from "../../erpActivyLogs"
import { generateToken } from "../utils/utils";
import bcrypt from "bcrypt"

import { getAccessControl } from "../models/accessControl"

export const authenticate = (req, res) => Controller( async () => {
    const { type, identifier, password } = req.body;

    // busca usuario a partir dois campo: email ou telefone;
    const user = await modelsUser.searchUser(type, identifier)

    // compara senhas
    if(!await bcrypt.compare(password, user.password))
        throw new GesconError("Senha incorreta!");

    // remove senha antes de enviar a fron-end
    delete user.password;

    // define token
    user.token = generateToken({ user_id: user.id, company_id: user.company_id, user_is_admin: user.is_admin });

    const accessControl = await getAccessControl(user.id)

    // Salva no log do erp esse evento
    await saveLog({
        company_id: user.company_id, 
        user_id: user.id, 
        source: "auth",
        message: "Login efetuado",
        ip: req.ip
    })

    return {
        user: user,
        access_control: accessControl
    }
}, res, "")

export const refreshToken = (req, res) => Controller( async () => {
    const { refreshToken } = req.body;

    // busca usuario a partir dois campo: email ou telefone;
    const user = await modelsUser.searchUser(type, identifier)

    // define token
    const accessToken = generateToken({ user_id: user.id, company_id: user.company_id, user_is_admin: user.is_admin });

    return {
        accessToken
    }
}, res, "")

// 
export const sendResetTokenToUserEmail = (req, res) => Controller( async () => {
    const { email } = req.body;
    const user = await modelsUser.searchUser("email", email)

    if(!user)
        throw new GesconError("Conta não encontrada")

    const token = await modelsAuth.generateAndSaveToken(user.id, email)

    await modelsAuth.sendResetTokenToUserEmail(email, `${user.first_name} ${user.last_name}`, token)

    return "Email enviado!"
}, res, "")

export const verifyToken = (req, res) => Controller( async () => {
    const { token } = req.body;
    const has = await modelsAuth.verifyHasTokenInDatabase(token)
    
    if(!has){
        logger.info("Token invalido")
        return res.status(200).send({ tokenIsValid: false, user: {}, msg: "Token inválido" })
    }

    const decoded = await jwt.verifyToken(token)

    return { tokenIsValid: true , user: { id: decoded.id, email: decoded.email }}
}, res, "")

export const resetPassword = (req, res) => Controller( async () => {
    const { token, password, repeatedPassword } = req.body;
    // Verfica se as duas senhas sao iguais
    if(password !== repeatedPassword)
        throw new GesconError("Senha não são iguais!");

    // Verfica se token e valido
    const has = await modelsAuth.verifyHasTokenInDatabase(token)
    if(!has)
        throw new Error("Token inválido")
    
    // Descodifica token
    const decoded = await jwt.verifyToken(token)
    // Efetivamente edita usuario
    const user = await modelsUser.changeUserPassword(decoded.id, password, token)

    delete user.password;

    user.token = jwt.generateToken({ user_id: user.id, company_id: user.company_id, user_is_admin: user.is_admin });

    const accessControl = await getAccessControl(user.id)

    return {
        user: user,
        access_control: accessControl
    }
}, res, "")