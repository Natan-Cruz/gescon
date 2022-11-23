import * as models from "../models/visits"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllVisits = (req, res) => Controller(async () => {
    const visits = await models.getAllVisits(req.company_id, req.query)  
    return visits;
}, res, "controller -> getAllVisits")

export const getOneVisit = (req, res) => Controller( async () => {
    const visit = await models.getOneVisit(req.params.id)
    return visit
}, res, "")

export const createNewVisit = (req, res) => Controller( async () => {
    const result = await models.createNewVisit({ company_id: req.company_id, ...req.body, user_id: req.userId })
    return result;
}, res, "", 201)

export const editVisit = (req, res) => Controller( async () => {
    return await models.editVisit({ company_id: req.company_id, ...req.body, user_id: req.userId })
}, res, "")

export const deleteVisit = (req, res) => Controller( async () => {
    return await models.editVisit({ company_id: req.company_id, ...req.body })
}, res, "")