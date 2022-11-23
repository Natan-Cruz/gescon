import Controller from "../../../../utils/Controller"
import * as models from "../models/members.js"

export const getAllMembersInConstruction = (req, res) => Controller( async () => {
    const members = await models.getAllMembersInConstruction(req.params.id)
    return members
}, res)

export const getNonMembersInConstruction = (req, res) => Controller( async () => {
    const nonMembers = await models.getNonMembersInConstruction(req.params.id, req.company_id)
    return nonMembers
}, res, "")

export const addMember = (req, res) => Controller( async () => {
    const member = await models.addMember({ company_id: req.company_id, ...req.body })
    return member
}, res, "", 201)

export const editMember = (req, res) => Controller( async () => {
    const member = await models.editMember(req.body)
    return member
}, res, "", 204)

export const removeMember = (req, res) => Controller( async () => {
    const result = await models.removeMember(req.params.id)
    return result;
}, res, "" ,204)
