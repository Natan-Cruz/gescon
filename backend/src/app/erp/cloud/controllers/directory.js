import Controller from "../../../../utils/Controller"
import * as models from "../models/directory"

export const getFolderContent = (req,res) => Controller( async () => {
    const { path, space } = req.query;
    const response = await models.getFolderContent(path ,space, { userID: req.user_id })
    return response;
}, res, "controllersDirectory -> getFolderContent")

export const getFoldersAndFilesBySearch = (req,res) => Controller( async () => {
    const response = await models.searchFoldersAndFiles(req.query);
    return response
}, res, "controllersDirectory -> getFolderAndFilesBySearch")

export const getFavorites = (req, res) => Controller( async () => {
    const { path, space } = req.query;
    const response = await models.getFavorites(path, space)
    return response
}, res, "controllersDirectory -> getFavorites")

export const toggleFavorite = (req, res) => Controller( async () => {
    const { type, id } = req.body;
    switch(type){
        case "folder":
            return await models.toggleFolderFavorite(id)
        case "file":
            return await models.toggleFileFavorite(id)
        default: 
            throw new Error("Type errado")
    }
}, res, "controllersDirectory -> toggleFavorite")