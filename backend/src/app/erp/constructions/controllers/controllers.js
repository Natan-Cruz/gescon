import * as models from "../models/models"
import Controller from "../../../../utils/Controller"

export const getAllConstructions = (req, res) => Controller( async () => {
    const constructions = await models.getConstructions(req.company_id, req.user_id, req.user_is_admin);
    return constructions
}, res, "")

export const createNewConstruction = (req,res) => Controller( async () => {
    const result = await models.createNewConstruction({ company_id: req.company_id, ...req.body, user_id: req.user_id })
    return result
}, res, "", 201)

export const getProgress = (req, res) => Controller( async () => {
    const progress = await models.getProgress(req.params.id)
    return progress;
}, res, "")

export const spaceUsedInCloud = (req, res) => Controller( async () => {
    const constructionId = req.params.id;
    const promiseFiles = models.calcSpaceUsed(constructionId);
    const promiseAvailableSpaceInBytes = models.getInformations(constructionId);

    const [ files, { availableSpaceInBytes }] = await Promise.all([ promiseFiles, promiseAvailableSpaceInBytes ]) 

    const fileTypeMap = new Map();
    const response = {
        availableSpaceInBytes: availableSpaceInBytes,
        totalUsed: 0,
        types: []
    }
    files.forEach( file => {
        response.totalUsed +=  parseInt(file.size || 0);
        const fileType = (file.file_type === "") ? "others" : file.file_type;
        const FT = fileType ? fileType.split('/')[0] : "others";

        const type = fileTypeMap.get(FT)
        if(type){
            fileTypeMap.set(FT, parseInt(type) + parseInt(file.size || 0))
        }else{
            fileTypeMap.set(FT, parseInt(file.size))
        }
    })
    fileTypeMap.forEach( ( v, k  ) => { 
        switch(k){
            case "image":
                k = "Imagens";
            break;
            case "text":
                k = "Textos";
            break
            case "audio":
                k = "Audios";
                break
            case "application":
                k = "Aplicações"
                break;
            case "others":
                k = "Outros";
        }
        response.types.push({
            type: k,
            size: v
        })
    })

    return response;
}, res, "")

export const getInformations = (req, res) => Controller( async () => {
    const result = await models.getInformations(req.params.id)
    return result;
}, res, "")

export const updateInformations = (req, res) => Controller( async () => {
    return await models.updateConstruction(req.body)
}, res, "", 200)

export const getErpActivities = (req, res) => Controller( async () => {
    const erpActivities = await models.getErpActivities(req.params.id, req.query.filter)
    return erpActivities
}, res, "")