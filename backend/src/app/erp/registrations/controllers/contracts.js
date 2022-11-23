import * as models from "../models/contracts"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllContracts = (req, res) => Controller( async () => {
    const contracts = await models.getAllContracts(req.company_id, req.query)  
    return contracts
}, res, "controller -> getAllContracts")

// Obtem um conta bancaria
export const getOneContract = (req, res) =>  Controller(async () => {
    return await models.getOneContract(req.params.id) 
}, res, "controllerAccounts -> getOneContract")

export const getOneContractResumeShows = (req, res) => Controller( async () => {
    const contract = await models.getOneContractResumeShows(req.params.id)
    return contract
}, res, "")

// Cria uma nova conta bancaria
export const createNewContract = (req, res) => Controller(async () => {
    return await models.createNewContract({ ...req.body, ...req.defaultParams }) 
}, res, "controllerAccounts -> createNewContract")


export const editContract = (req, res) => Controller(async () => {
    return await models.editContract({ ...req.body, ...req.defaultParams })
}, res, "controllerAccounts -> editContract", 204)

export const contractActions = (req, res) => Controller( async () => {
    return await models.handleContractActions({ ...req.body, user_id: req.user_id })
}, res, "")