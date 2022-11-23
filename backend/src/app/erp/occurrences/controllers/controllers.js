import Controller from "../../../../utils/Controller"
import * as models from "../models/models"

// Occurrences
export const getAllOccurrences = (req, res) => Controller( async () => {
    const occurrences = await models.getAllOcurrencesByStatus(req.params.constructionID, req.query.status)
    return occurrences
}, res, "controllerOccurrence -> GetAllOccurrences")

export const getOneOccurrence = (req,res) => Controller( async () => {
    const occurrence = await models.getOneOccurrence(req.params.id)
    return occurrence;
}, res, "controllerOccurrence -> getOneOccurrence")

export const getOccurrencePublic = (req, res) => Controller( async () => {
    const occurrence = await models.getOccurrencePublic(req.query)
    return occurrence
}, res, "")

export const createNewOccurrence = (req, res) => Controller( async () => {
    const result = await models.createNewOccurrence({ user_id: req.userId , ...req.body})
    return result
}, res, "controllerOccurrence -> createNewOccurrence", 201)

export const editOccurrence = (req,res) => Controller( async () => {
    const result = await models.editOccurrence({ user_id: req.userId, ...req.body })
    return result
}, res, "controllerOccurrence -> EditOcurrence", 204)

export const addStatusInOccurrence = (req, res) => Controller( async () => {
    const result = await models.addStatusInOccurrence({ occurrence_id: req.params.id, status_code: req.body.status_code, user_id: req.userId })
    return result;
}, res, "controllerOccurrence -> addStatusInOccurrence", 201) 


export const deleteOccurrence = (req, res) => Controller( async () => {
    await models.deleteOccurrence(req.userId, req.params.id)
    return true;
}, res, "controllerOccurrence -> EditOcurrence") 