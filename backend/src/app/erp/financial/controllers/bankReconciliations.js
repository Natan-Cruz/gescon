import * as models from "../models/bankReconciliations"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllBankReconciliations = (req, res) =>
    Controller(async () => {
        return await models.getAllBankReconciliations(req.company_id)  
    }, res, "controller -> getAllBankReconciliations")

// Obtem um conta bancaria
export const getOneBankReconciliation = (req, res) => 
    Controller(async () => {
        return await models.getOneBankReconciliation(req.params.id) 
    }, res, "controllerReconciliations -> getOneBankReconciliation")

// Cria uma nova conta bancaria
export const createBankReconciliation = (req, res) =>
    Controller(async () => {
        return await models.createBankReconciliation({ user_id: req.userId, company_id: req.company_id, ...req.body }) 
    }, res, "controllerReconciliations -> createBankReconciliation")

// Edita uma conta bancaria
export const editBankReconciliation = (req, res) => 
    Controller(async () => {
        return await models.editBankReconciliation(req.params.id, req.body)
    }, res, "controllerReconciliations -> editBankReconciliation")

// Disabilita uma conta bancaria
export const deleteBankReconciliation = (req, res) =>
    Controller(async () => {
        return await models.editBankReconciliation(req.params.id, { deleted: true })
    }, res, "controllerReconciliations -> deleteBankAccount")