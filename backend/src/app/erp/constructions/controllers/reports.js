import Controller from "../../../../utils/Controller"
import * as models from "../models/reports";

export const getAllReports = (req, res) => Controller( async () => {
    const reports = await models.getAllReports(req.params.id)
    return reports;
}, res, "controllerReports -> getAllReports")

export const getOneReport = (req,res) => Controller( async () => {
    const report = await models.getOneReport(req.params)
    return report
}, res, "controllerReports -> getOneReport")

export const createNewReport = (req, res) => Controller( async () => {
    const report = await models.createNewReport({ construction_id: req.params.id, user_id: req.userId, ...req.body });
    return report
}, res, "controllerReports -> createNewReport")

export const editReport = (req,res) => Controller( async () => {
    const report = await models.editReport(req.params, req.body)
    return report
}, res, "controllerReports -> changeReport")

export const deleteReport = (req,res) => Controller( async () => {
    const response = await models.deleteReport(req.params)
    return response
}, res, "controllerReports -> deleteReport")


export const defineClimate = (req, res) => Controller( async () => {
    const { reportID, climateID } = req.params
    return await models.defineClimate( reportID, climateID, req.body )
}, res, "controllerReports -> defineClimate")

export const defineConditions = (req,res) => Controller( async () => {
    const { reportID, conditionID } = req.params
    return await models.defineConditions( reportID, conditionID, req.body )
}, res, "controllerReports -> defineConditions")


// 
export const createReport = (req,res) => Controller( async () => {
    const { reportID } = req.params;
    const { resource } = req.query;
    // Executa ações em funcionarios da construtora
    return await models.handleCreate(reportID, req.body, resource)
}, res, "controllerReports -> changeReport", 201)

// export const editReport = (req,res) => Controller( async () => {
//     const { resourceID } = req.params;
//     const { resource } = req.query;
//     await models.handleEdit(resourceID, req.body, resource)
//     return true
// }, res, "controllerReports -> changeReport")

export const deleteResourceReport = (req,res) => Controller( async () => {
    const { resourceID } = req.params;
    const { resource } = req.query;
    // Executa ações em funcionarios da construtora
    await models.handleDelete(resourceID, resource)
    return true
}, res, "controllerReports -> changeReport")
