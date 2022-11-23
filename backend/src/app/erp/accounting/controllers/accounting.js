import Controller from "../../../../utils/Controller";

import * as models from "../models/mainAccounting"
import * as modelsBankServices from "../models/bankServices"

export const getAllAccounts = (req, res) => Controller(async () => {
    const result = await models.getAllAccounts(req.company_id, req.query)
    return result
}, res, "controllerAccount -> getAllAccounts")

export const generatePaymentTransaction = (req, res) => Controller( async () => {
    return await models.generatePaymentTransaction(req.body)
}, res, "")

export const generatePayments = (req, res) => Controller(async () => {
    const response = await modelsBankServices.generatePayments(req.body)
    return response;
}, res, 201)

export const getInformationsAboutInstallmentsAndCustomers = (req, res) => Controller(async () => {
    const response = await modelsBankServices.getInformationsAboutInstallmentsAndCustomers(req.body)
    return response
}, res, 201)