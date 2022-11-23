import * as modelsBankAccounts from "../models/bankAccounts"
import * as modelsCreditCards from "../models/creditCards"
import Controller from "../../../../utils/Controller"

// BANK ACCOUNTS OR/AND CREDIT CARDS
export const getAllBankAccountsOrCreditCards = (req, res) => Controller(async () => {
    const bankAccounts = await modelsBankAccounts.getAllBankAccounts(req.company_id, req.query)  
    return bankAccounts
}, res, "controller -> getAllBankAccounts")

// BANK ACCOUNTS

// Obtem um conta bancaria
export const getOneBankAccount = (req, res) =>  Controller(async () => {
    const bankAccount = await modelsBankAccounts.getOneBankAccount(req.params.id) 
    return bankAccount
}, res, "controllerAccounts -> getOneBankAccount")

// Cria uma nova conta bancaria
export const createBankAccount = (req, res) => Controller(async () => {
    const bankAccount = await modelsBankAccounts.createBankAccount({ ...req.defaultParams, ...req.body }) 
    return bankAccount;
}, res, "controllerAccounts -> createBankAccount")

// Edita uma conta bancaria
export const editBankAccount = (req, res) =>  Controller(async () => {
    const response = await modelsBankAccounts.editBankAccount({ ...req.defaultParams, ...req.body })
    return response;
}, res, "controllerAccounts -> editBankAccount", 204)

// Disabilita uma conta bancaria
export const deleteBankAccount = (req, res) => Controller(async () => {
    return await modelsBankAccounts.editBankAccount({ ...req.defaultParams, id: req.params.id })
}, res, "controllerAccounts -> deleteBankAccount", 200)

// CREDIT CARDS

export const getOneCreditCard = (req, res) => Controller( async () => {
    const creditCard = await modelsCreditCards.getOneCreditCard(req.params.id)
    return creditCard
}, res, "") 

export const createCreditCard = (req, res) => Controller( async () => {
    const creditCard = await modelsCreditCards.createCreditCard({ ...req.body, ...req.defaultParams })
    return creditCard
}, res, "", 201) 

export const editCreditCard = (req, res) => Controller( async () => {
    const result = await modelsCreditCards.editCreditCard({ ...req.defaultParams, ...req.body })
    return result;
}, res, "", 204) 

export const deleteCreditCard = (req, res) => Controller( async () => {
    const result = await modelsCreditCards.deleteCreditCard({ id: req.params.id, ...req.defaultParams })
    return result;
}, res, "", 204) 