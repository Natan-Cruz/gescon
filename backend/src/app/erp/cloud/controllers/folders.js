import Controller from "../../../../utils/Controller";
import * as models from "../models/folders"

export const getFolderAndInformations = (req,res) => Controller( async () => {
    const informations = await models.getFolderInformations(req.params.folderID, req.user_id)
    return informations
}, res, "controllersFolder -> getFolderAndInformations")

export const createFolder = (req,res) => Controller( async () => {
    const folder = await models.createNewFolder(req.user_id, req.body);
    return folder;
}, res, "controllersFolder -> createFolder", 201)

export const editFolder = (req, res) => Controller( async () => {
    const result = await models.updateFolder(req.params.folderID, req.body)
    return result
},res, "controllersFolder => editFolder", 200)

export const deleteFolder = (req,res) => Controller( async () => {
    return await models.deleteFolder(req.params.folderID)
}, res, "controllersFolder -> deleteFolder")