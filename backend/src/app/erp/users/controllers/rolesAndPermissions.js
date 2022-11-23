import Controller from "../../../../utils/Controller"
import * as models from "../models/rolesAndPermissions"
import * as modelsAccessControl from "../models/accessControl"

export const getAccessControl = (req, res) => Controller( async () => {
    const accessControl = await modelsAccessControl.getAccessControl(req.user_id)
    return accessControl
}, res, "")

export const getPermissions = (req, res) => Controller(async () => {
    return await models.getPermissions()  
}, res, "rolesAndPermissions -> getPermissions")

export const getRoles = (req, res) => Controller(async () => {
    const roles = await models.getRoles(req.company_id)  
    return roles
}, res, "rolesAndPermissions -> getRoles")

export const getOneRole = (req, res) => Controller(async () => {
    const role = await models.getOneRole(req.params.id)  
    return role
}, res, "rolesAndPermissions -> getOneRole")

export const createNewRole = (req, res) => Controller(async () => {
    return await models.createNewRole({ company_id: req.company_id, user_id: req.user_id, ...req.body })  
}, res, "rolesAndPermissions -> createNewRole", 201)

export const editRole = (req, res) => Controller(async () => {
    return await models.editRole(req.body)  
}, res, "rolesAndPermissions -> editRole", 200)

export const deleteRole = (req, res) => Controller(async () => {
    return await models.editRole(req.params.id, { deleted_at: 'now()' })  
}, res, "rolesAndPermissions -> deleteRole")
