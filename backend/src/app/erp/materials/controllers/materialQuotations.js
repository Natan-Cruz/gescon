import Controller from "../../../../utils/Controller"

import * as models from "../models/materialQuotations"
import * as modelsPublic from "../models/materialQuotationsPublic"

export const getAllMaterialQuotations = (req, res) => Controller( async () => {
    const materialQuotations = await models.getAllMaterialQuotations({ company_id: req.company_id, ...req.query })
    return materialQuotations
}, res, "")

export const getOneMaterialQuotation = (req, res) => Controller( async () => {
    const materialQuotation = await models.getOneMaterialQuotation(req.params.id, req.query)
    return materialQuotation
}, res, "")

export const getOneMaterialQuotationShow = (req, res) => Controller( async () => {
    const materialQuotation = await models.getOneMaterialQuotationShow(req.params.id)
    return materialQuotation
}, res, "")

export const createNewMaterialQuotation = (req, res) => Controller( async () => {
    const materialQuotation = await models.createNewMaterialQuotation({ ...req.body, ...req.defaultParams })
    return materialQuotation;
}, res, "", 201)

export const editMaterial = (req, res) => Controller( async () => {
    const response = await models.editMaterialQuotation({ ...req.body, ...req.defaultParams })
    return response
}, res, "", 201)

export const deleteMaterial = (req, res) => Controller( async () => {
    return await models.deleteMaterial({ id: req.params.id, ...req.defaultParams })
}, res, "")


// public
export const getOneMaterialQuotationPublic = (req, res) => Controller( async () => {
    const materialQuotation = await modelsPublic.getOneMaterialQuotationPublic(req.params.id)
    return materialQuotation
}, res, "")

export const saveAlterationsQuotationPublic = (req, res) => Controller( async () => {
    const response = await modelsPublic.saveAlterationsQuotationPublic(req.body)
    return response
}, res, "")
