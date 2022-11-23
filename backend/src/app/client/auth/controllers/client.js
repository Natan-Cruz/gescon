import { compare as bcryptCompare } from "bcrypt";
import Controller from "../../../../utils/Controller"
import GesconError from "../../../../utils/GesconError";

import * as models from "../models"
import { generateToken } from "../utils/utils"

export const authenticate = (req, res) => Controller( async () => {
    const { identifier, password } = req.body

    const client = await models.getEntityClient(identifier)
    if (!client)
       throw new GesconError("Conta não encontrada!");
    
    if(!await bcryptCompare(password, client.password))
        throw new GesconError("Senha incorreta!");
    
    delete client.password;
    
    client.token = generateToken({ id: client.id });

    return client
}, res, "controllerClientAuth -> ")


export const editMyAccount = (req, res) => Controller( async () => {
    return await models.editMyAccount(req.userId, req.body)
}, res, "controllerClientAuth -> editMyAccount")

export const changePassword = (req, res) => Controller( async () => {
    return await models.changePassword(req.userId, req.body)
}, res, "controllerClientAuth -> changePassword")
