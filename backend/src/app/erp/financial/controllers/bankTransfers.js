import * as models from "../models/bankTransfers"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllTransfers = (req, res) => Controller(async () => {
    const bankTransfers = await models.getAllBankTransfers(req.company_id, req.query)  
    return bankTransfers;
}, res, "controller -> getAllTransfers")

// Obtem um conta bancaria
export const getOneTransfers = (req, res) =>  Controller(async () => {
    const bankTransfer = await models.getOneBankTransfer(req.params.id) 
    return bankTransfer
}, res, "controllerAccounts -> getOneTransfers")

// Cria uma nova conta bancaria
export const createBankTransfer = (req, res) => Controller(async () => {
    const bankTransfer = await models.createBankTransfer({ user_id: req.userId, company_id: req.company_id, ...req.body }) 
    return bankTransfer;
}, res, "controllerAccounts -> createBankTransfer", 201)

// Edita uma conta bancaria
export const editBankTransfer = (req, res) =>  Controller(async () => {
    const response = await models.editBankTransfer(req.body)
    return response;
}, res, "controllerAccounts -> editBankTransfer", 204)

// Disabilita uma conta bancaria
export const deleteBankTransfer = (req, res) => Controller(async () => {
    return await models.editBankTransfer(req.params.id, { deleted: true })
}, res, "controllerAccounts -> deleteBankAccount", 200)