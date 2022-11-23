import * as models from "../models/userAdmin";
import Controller from "../../../../utils/Controller";

const DEFAULT_USER_PASSWORD = "gescon";

export const getAllUsers = (req, res) => Controller( async () => {
    const users = await models.getAllUsers(req.company_id); 
    return users
}, res, "")

export const getOneUser = (req, res) => Controller( async () => {
    const user = await models.getOneUser(req.params.id)
    return user
}, res, "")

export const createNewUser = (req, res) => Controller( async () => {
    const passwordHash = await bcrypt.hash(DEFAULT_USER_PASSWORD, 8)

    const user = await models.createNewUser({ 
        company_id: req.company_id, 
        user_id: req.user_id, 
        password: passwordHash, 
        ip: req.ip, 
        ...req.body 
    })

    return user
}, res, "", 201)

export const editUser = (req, res) => Controller( async () => {
    const user = await models.editUser(req.body)
    return user
}, res, "")


export async function disableUser(req,res){

}