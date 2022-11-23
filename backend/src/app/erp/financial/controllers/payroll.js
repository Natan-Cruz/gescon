import * as models from "../models/payroll"
import Controller from "../../../../utils/Controller"

export const getAllPayroll = (req, res) => Controller(async () => {
    const payroll = await models.getAllPayroll(req.company_id, req.query)  
    return payroll
}, res, "controller -> getAllPayroll")

export const getOnePayroll = (req, res) => Controller( async () => {
    const payroll = await models.getOnePayroll(req.params.id)
    return payroll
}, res, "")

export const editPayroll = (req, res) => Controller( async () => {
    const result = await models.editPayroll(req.body)
    return result;
}, res, "")

export const createNewPayroll = (req, res) => Controller( async () => {
    const payroll = await models.createNewPayroll({ company_id: req.company_id, ...req.body })  
    return payroll
}, res, "")