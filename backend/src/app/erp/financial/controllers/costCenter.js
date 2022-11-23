import * as models from "../models/costCenter"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllRegisters = (req, res) => Controller(async () => {
    return await models.getAllRegisters(req.company_id, req.query)  
}, res, "controllerCostCenter -> getAllRegisters")

export const getFullPathName = (req, res) => Controller( async () => {
    const pathName = await models.getFullPathName(req.params.path)
    return pathName
}, res, "")

// Cria uma nova conta bancaria
export const createRegister = (req, res) =>
    Controller(async () => {
        return await models.createRegister({ user_id: req.userId, company_id: req.company_id, ...req.body }) 
    }, res, "controllerCostCenter -> createRegister")

// Edita uma conta bancaria
export const editRegister = (req, res) =>  Controller(async () => {
    const response = await models.editRegister(req.body)
    return response
}, res, "controllerCostCenter -> editRegister")

// Disabilita uma conta bancaria
export const deleteRegister = (req, res) => Controller(async () => {
    return await models.deleteRegister(req.params.id)
}, res, "controllerCostCenter -> deleteRegister")

export const editOrder = (req, res) =>  Controller(async () => {
    return await models.editOrder(req.body)
}, res, "controllerCostCenter -> editOrder")
    