import * as models from "../models/bankTransactions"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllTransactions = (req, res) => Controller(async () => {
    const transactions = await models.getAllTransactions(req.company_id, req.query)  
    return transactions
}, res, "controllerBankTransactions -> getAllTransactions")

export const getOneTransaction = (req, res) =>  Controller(async () => {
    const transaction = await models.getOneTransaction(req.params.id)  
    return transaction;
}, res, "controllerBankTransactions -> getOneTransaction")

export const getOneTransactionShow = (req, res) =>  Controller(async () => {
    const transaction = await models.getOneTransactionShow(req.params.id)  
    return transaction;
}, res, "controllerBankTransactions -> getOneTransactionShow")

// Cria uma nova conta bancaria
export const createTransaction = (req, res) => Controller(async () => {
    return await models.createTransaction({ user_id: req.userId, company_id: req.company_id, ...req.body }) 
}, res, "controllerAccounts -> createTransaction")

// Edita uma conta bancaria
export const editTransaction = (req, res) => Controller(async () => {
    return await models.editTransaction(req.body)
}, res, "controllerAccounts -> editBankTransfer")


// Disabilita uma conta bancaria
export const deleteTransaction = (req, res) => Controller(async () => {
    return await models.editBankTransfer(req.params.id, { deleted: true })
}, res, "controllerAccounts -> deleteBankAccount")