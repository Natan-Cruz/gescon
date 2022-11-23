import * as models from "../models/assets"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllAssets = (req, res) => Controller(async () => {
    const assets =  await models.getAllAssets(req.company_id, req.query)  
    return assets
}, res, "controller -> getAllAssets")

export const getAllProjectAssets = (req,res) => Controller(async () => {
    const projects =  await models.getAllProjectAssets(req.company_id, req.query)  
    return projects
}, res, "")

export const getOneAsset = (req, res) => Controller( async () => {
    const asset = await models.getOneAsset(req.params.id)
    return asset
}, res, "")

export const createAsset = (req, res) => Controller( async () => {
    const asset = await models.createAsset({ ...req.body, ...req.defaultParams })
    return asset
}, res, "", 201)

export const editAsset = (req, res) => Controller( async () => {
    const asset = await models.editAsset({ ...req.body, ...req.defaultParams }) 
    return asset
}, res, "", 204)