// Salva temporariamente em memoria -- multer
// Faz o upload para para GC
// Atualiza path_banner
import { uploadArchive, deleteFile } from "../../../../database/google.storage";
import Controller from "../../../../utils/Controller"
import * as models from "../models/models"

export const uploadBanner = (req,res) => Controller( async () => {
    const constructionId = req.params.id, file = req.file

    const { company_id, banner_file_path } = await models.getCompanyID(constructionId)

    if(banner_file_path)
        await deleteFile(banner_file_path)
    
    const cloudFile = await uploadArchive({
        destination: company_id,
        filename: "banner-construction.jpeg",
        buffer: file.buffer,
        isPublic: true
    })

    const response = await models.updateConstruction({
        id: constructionId,
        banner_file_url: cloudFile.fileUrl,
        banner_file_name: cloudFile.fileName,
        banner_file_path: cloudFile.filePath
    })

    return response
}, res, "", 201)

export const deleteBannner = (req, res) => Controller( async () => {
    const constructionId = req.params.id;
    const { banner_file_path } = await models.getCompanyID(constructionId)
    
    await deleteFile(banner_file_path)
    
    await models.updateConstruction(constructionId, {
        banner_file_url: "",
        banner_file_name: "",
        banner_file_path: ""
    })
    return true;
}, res, "", 200)