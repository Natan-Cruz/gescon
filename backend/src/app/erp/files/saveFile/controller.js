import nanoid from "../../../../utils/nanoid";
import { googleStorageBucket } from "../../../../database/google.storage";
import formidable from "formidable";
import { getFolderIdByPathLtree } from "../models";
import knex from "../../../../database/database.knex";
import logger from "../../../../utils/logger";
import getCompanyID from "../../../../utils/getCompanyID";
import mime from "mime"

// usado por regras no google storage
const TEN_MEGABYTES_IN_BYTES = 10485760;

export async function routerSaveFile(req,res) {
	const { user_id, company_id } = req.defaultParams;

    try {
		const form = formidable()
		const fields = {};
		
		form.on('field', (fieldName, fieldValue) => {
			fields[fieldName] = fieldValue;
		})
		
		form.onPart = (part) => {
			if (!part.filename) {
				// let formidable handle all non-file parts
				form.handlePart(part);
				
				return;
			}	

			const uuid = nanoid(), 
				extension = fields.fileName.split('.').pop(),
				newFileName = `${uuid}.${ mime.getExtension(extension) }`,
				filePath = `${ company_id }/${ newFileName }`

			const fileInStorage = googleStorageBucket.file(filePath)

			part.pipe(fileInStorage.createWriteStream({ resumable: fields.size < TEN_MEGABYTES_IN_BYTES, public: (fields.reference_table && fields.reference_key && fields.reference_value) }))
			
			part.on('end', async () => {
				try {
					const folder_id = await getFolderIdByPathLtree(fields.pathltree)

					const fileForSave = {
						id: nanoid(),
						folder_id: folder_id,
						uploaded_user_id: user_id,
						file_name: fields.fileName,
						file_type: mime.getType(fields.fileName),
						size: form.bytesExpected,
						last_modified: fields.lastModified,
						cloud_file_url: `https://storage.googleapis.com/${googleStorageBucket.name}/${filePath}`,
						cloud_file_name: newFileName,
						cloud_file_path: filePath,
					}

					await knex.transaction( async trx => {
						await trx("files").insert(fileForSave)

						if(fields.reference_table && fields.reference_key && fields.reference_value){
							const reference = {}
							reference[fields.reference_key] = fields.reference_value
							await trx(fields.reference_table).insert({ id: nanoid(), ...reference, file_id: fileForSave.id })
						}else{
							// await trx("construction_scheme.erp_activities").insert({
							// 	id: nanoid(),
							// 	construction_id: fields.rootPathLtree.split(".")[0],
							// 	user_id: user_id,
							// 	action: "ADD",
							// 	description: "Um arquivo foi carregado para nuvem",
							// 	resource: "files",
							// 	resource_id: fileForSave.id,
							// 	group_id: fields.group_id
							// })
						}
					})	

					res.status(201).send(fileForSave)
				} catch (error) {
					logger.error(error)
					res.sendStatus(400)
				}
			})

				
			form.on('aborted', () => {
				logger.error("Abortado")
				res.sendStatus(400)
			})

			form.on("error", (error) => {
				logger.error(error)
				res.sendStatus(400)
			})

		}

		form.parse(req)
    } catch (error) {
        logger.error(error)
        res.status(400).send({ msg: "Não foi possivel salvar arquivo", error })
    }
}