import Controller from "../../../../utils/Controller"
import * as models from "../models/materialOrders"
import { sendPushNotification } from "../../../../services/PushNotification"

export const getAllMaterialOrders = (req, res) => Controller( async () => {
    const materialOrders = await models.getAllMaterialOrders({ company_id: req.company_id, ...req.query })
    return materialOrders
}, res, "")

export const getOneMaterial = (req, res) => Controller( async () => {
    const material = await models.getOneMaterial(req.params.id)
    return material
}, res, "")

export const createNewMaterialOrder = (req, res) => Controller( async () => {
    const materialOrder = await models.createNewMaterialOrder({ ...req.body, ...req.defaultParams })

    sendPushNotification(req.user_id, { 
        title: "Novo material a receber!!",
        message: "Um material foi adicionado à materiais a receber!"
    });

    return materialOrder;
}, res, "", 201)

export const editMaterial = (req, res) => Controller( async () => {
    return await models.editMaterial({ ...req.body, ...req.defaultParams })
}, res, "", 200)

export const deleteMaterial = (req, res) => Controller( async () => {
    return await models.deleteMaterial({ id: req.params.id, ...req.defaultParams })
}, res, "")


export const getMaterialOrderForReceive = (req, res) => Controller( async () => {
    const materialOrder = await models.getMaterialOrderForReceive(req.params.id)
    return materialOrder
}, res, "")

export const receiveMaterial = (req,res) => Controller( async () => {
    const response = await models.receiveMaterial({ ...req.body, user_id: req.userId })

    sendPushNotification(req.user_id, { 
        title: "Um material foi entregue!!",
        message: response.name + "foi entregue na obra"
    });

    return response;
}, res, "", 200)