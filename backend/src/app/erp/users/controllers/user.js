import * as models from "../models/user"
import * as bcrypt from "bcrypt";
import GesconError from "../../../../utils/GesconError";
import Controller from "../../../../utils/Controller";


export const editMyAccount = (req, res) => Controller( async () => {    
    await models.editProfileUser({ company_id: req.company_id, user_id: req.userId, ...req.body })
    return "";
}, res, "", 204)

export const changePassword = (req, res) => Controller( async () => {
    const userID = req.user_id, { currentPassword, newPassword } = req.body;

    const user = await models.searchUser("id", userID)

    if (!user)
        throw new GesconError("Conta não encontrada!");

    if(!await bcrypt.compare(currentPassword, user.password))
        throw new GesconError("Senha incorreta!");

    const passwordHash = await bcrypt.hash(newPassword, 8);
        
    await models.editProfileUser({ user_id: userID,  password: passwordHash })
    return ""
}, res, "", 204)

// 
export const sendConfirmationEmail = (req, res) => Controller( async () => {
    const response = await models.sendConfirmationEmail(req.userId)
    return response;
}, res, "") 

export const confirmEmail = (req, res) => Controller( async () => {
    const response = await models.confirmEmail(req.query.token)
    return response;
}, res, "") 

// device token
export const saveDeviceToken = (req ,res) => Controller( async () => {
    const response = await models.saveDeviceToken(req.userId, req.body)
    return response
}, res, "", 201)

export const removeDeviceToken = (req, res) => Controller( async () => {
    const response = await models.removeDeviceToken(req.userId, req.body)
    return !!response
}, res, "", 204)

