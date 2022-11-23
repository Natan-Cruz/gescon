import * as googleStorageFunc from "../../../database/google.storage"
import * as models from "./models";
import sharp from "sharp"
import logger from "../../../utils/logger";
import Controller from "../../../utils/Controller"
import GesconError from "../../../utils/GesconError"

export const initUpload = (req,res) => Controller( async () => {
    const folder = await models.initUpload({ user_id: req.user_id, ...req.body })
    return folder
}, res, "controllersFile -> initUpload", 201)

export const deleteFile = (req,res) => Controller( async () => {
    const { id } = req.params;
        
    if(!id)
        throw new Error("ID do arquivo necessário")
    
    // Obtem informaçoes do arquivo
    const file = await models.getFile(id, "cloud_file_path")
    
    // Delete imagem do google storage
    await googleStorageFunc.deleteFile(file.cloud_file_path)

    // Delete registro de imagem no banco de dados
    await models.deleteFile(id)

    return 'Arquivo deletado!'
}, res, "", 200)

export const donwloadFile = async (req, res) => {
    const { id } = req.params;
    
    try {
        const file = await models.getFile(id, ["cloud_file_path", "file_type"] )

        if(!file) 
            throw new GesconError("Arquivo não encontrado ou já deletado!")
        
        const isImage = file.file_type ? file.file_type.split("/")[0] === "image" : false 

        const quality = toInt(req.query.quality) < 0 && toInt(req.query.quality) > 100 ? 80 : toInt(req.query.quality)
        const config = {
            width: toInt(req.query.width) || null,
            height: toInt(req.query.height) || null,
            quality: quality || 90
        }
        
        if(isImage){
            const sharpResize = sharp()
                .resize(config.width, config.height)
                .jpeg({ progressive: true, force: false, quality: config.quality })
                .png({ progressive: true, force: false, compressionLevel: Math.trunc(config.quality / 10) })
                .webp({ progressive: true, force: false, quality: config.quality })

            googleStorageFunc.googleStorageBucket
                .file(file.cloud_file_path)
                .createReadStream()
                .pipe(sharpResize)
                .toBuffer()
                .then(data => {
                    res.setHeader("content-length", data.byteLength)
                    res.send(data)
                })
                .catch(() => res.sendStatus(404))
        }else{
            googleStorageFunc.googleStorageBucket
                .file(file.cloud_file_path)
                .createReadStream()
                .on("error", (err) => {
                    console.log(err)
                    res.status(400).send("Internal Server Error")
                })
                .on("response", (storageResponse) => {
                    res.setHeader(
                        "content-type",
                        storageResponse.headers["content-type"]
                    );
                    res.setHeader(
                        "content-length",
                        storageResponse.headers["content-length"]
                    );
                    res.status(storageResponse.statusCode);
                })
                .on("end", () => res.end())
                .pipe(res);
        }

        

    } catch (error) {
        logger.error(error)
        res.status(400).send({ msg: typeof error === 'string' ? error : "Não foi possivel deletar arquivo", error })
    }
}
function toInt(string) {
    if (!string) return null;
    if (typeof string !== "string" && typeof string !== 'number') return null
    return parseInt(string)
}

export const editFile = (req, res) => Controller( async () => {
    const file = await models.updateFile(req.params.id, req.body)
    return file
}, res, "")

export const getInformationsAboutFile = (req, res) => Controller( async () => {
    const file = await models.getInformationsAboutFile(req.params.id)
    return file
}, res, "")

export const editOrDeleteFiles = (req, res) => Controller( async () => {
    await models.editOrDeleteFiles(req.body)
}, res, "")
