import Controller from "../../../utils/Controller"
import * as models from "./models.js"

export const getInstallemnts = (req, res) => Controller( async () => {
    return await models.getInstallemnts({ userId: req.userId, contract_id: req.params.id, ...req.query })
}, res, "controller -> getInstallemnts")

export const getOneInstallment = (req, res) => Controller( async () => {
    return await models.getOneInstallment({ userId: req.userId, ...req.query })
}, res, "controller -> getOneInstallment")