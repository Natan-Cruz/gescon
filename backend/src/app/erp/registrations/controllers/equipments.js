import * as models from "../models/equipments"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllEquipments = (req, res) => Controller(async () => {
    const equipments = await models.getAllEquipments(companyID, req.query)  
    return equipments;
}, res, "controller -> getAllEquipments")

export const getOneEquipment = (req, res) => Controller( async () => {
    const equipment = await models.getOneEquipment(req.params.id)
    return equipment
}, res, "")

export const createNewEquipment = (req, res) => Controller( async () => {
    const result = await models.createNewEquipment({ company_id, ...req.body })
    return result;
}, res, "", 201)


export const editEquipment = (req, res) => Controller( async () => {
    return await models.editEquipment({ company_id, ...req.body })
}, res, "")

// 

export const getOneEquipmentMaintenance = (req, res) => Controller( async () => {
    const maintenance = await models.getOneEquipmentMaintenance(req.params.id)  
    return maintenance;
}, res, "")

export const createNewEquipmentMaintenance = (req, res) => Controller( async () => {
    const maintenance = await models.createNewEquipmentMaintenance(req.body)  
    return maintenance;
}, res, "", 201)

export const editEquipmentMaintenance = (req, res) => Controller( async () => {
    const maintenance = await models.editEquipmentMaintenance(req.body)  
    return maintenance;
}, res, "", 200)