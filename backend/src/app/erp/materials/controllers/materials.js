import Controller from "../../../../utils/Controller"
import * as models from "../models/materials"

export const getAllMaterials = (req, res) => Controller( async () => {
    const productsAndMaterials = await models.getAllMaterials({ company_id: req.company_id, ...req.query })
    return productsAndMaterials;
}, res, "")

export const getOneMaterial = (req, res) => Controller( async () => {
    const material = await models.getOneMaterial(req.params.id)
    return material;
}, res, "")

export const createMaterial = (req, res) => Controller( async () => {
    return await models.createMaterial({ ...req.body, ...req.defaultParams })
}, res, "")

export const editMaterial = (req, res) => Controller( async () => {
    return await models.editMaterial({ ...req.body, ...req.defaultParams })
}, res, "")

export const deleteMaterial = (req, res) => Controller( async () => {
    return await models.deleteMaterial({ ...req.params.id, ...req.defaultParams })
}, res, "")