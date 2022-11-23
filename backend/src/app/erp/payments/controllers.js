import * as models from "./models";
import Controller from "../../../utils/Controller";

export const getPaymentsInformations = (req, res) => Controller( async () => {
    const paymentsInformations = await models.getPaymentsInformations(req.company_id) 
    return paymentsInformations
}, res, "")

export const getTransactionDetails = (req, res) => Controller( async () => {
    const details = await models.getTransactionDetails(req.params.id) 
    return details
}, res, "")

export const getLogs = (req, res) => Controller( async () => {
    const logs = await models.getLogs({ company_id: req.company_id, ...req.query })
    return logs
}, res, "")