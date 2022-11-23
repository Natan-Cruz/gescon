import * as models from "../models/chartAccounts"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllRegisters = (req, res) => Controller(async () => {
    return await models.getAllRegisters(req.company_id, req.query)  
}, res, "controllerChartAccounts -> getAllRegisters")

// Cria uma nova conta bancaria
export const createRegister = (req, res) => Controller(async () => {
    return await models.createRegister({ ...req.body, ...req.defaultParams }) 
}, res, "controllerChartAccounts -> createRegister")

// Edita uma conta bancaria
export const editRegister = (req, res) => Controller(async () => {
    return await models.editRegister({ ...req.body, ...req.defaultParams })
}, res, "controllerChartAccounts -> editRegister")

// Disabilita uma conta bancaria
export const deleteRegister = (req, res) => Controller(async () => {
    return await models.deleteRegister({ id: req.params.id, ...req.defaultParams })
}, res, "controllerChartAccounts -> deleteRegister")