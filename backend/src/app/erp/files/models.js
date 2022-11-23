import knex from "../../../database/database.knex";
import { formatActions } from "../../../utils/Utils"
import GesconError from "../../../utils/GesconError";
import nanoid from "../../../utils/nanoid";

export async function getFile(attachmentID, fields = "*"){
    const [file] = await knex("files")
        .select(fields)
        .where({ id: attachmentID })
        .limit(1)

    if(!file)
        throw new Error("Attachment não encontrado");

    return file
}

export async function deleteFile(fileID){
    return await knex("files").del().where({ id: fileID })
}

export async function updateFile(fileID, alterations){
    if(!fileID)       
        throw new Error("Paramentro fileID necessário");

    const [ result ] = await knex("files")
        .update({
            file_name: alterations.file_name
        })
        .where({ id: fileID })
        .returning("*")

    return result
}

export async function getInformationsAboutFile(fileID){
    if(!fileID)
        throw new Error("File_id necessario")

    const [ file ] = await knex("files as att")
        .select("att.*", "f.path_ltree")
        .innerJoin("folders as f", "f.id", "att.folder_id")
        .where({ "att.id": fileID })
        .limit(1)
        
    if(!file)
        throw new GesconError("Arquivo nao existe!")

    const withRaw = knex.raw(`select * from "folders" where "path_ltree" @> '${ file.path_ltree }' ORDER BY CHAR_LENGTH(ltree2text("path_ltree"))`)
    const selectRaw = knex.raw(`string_agg(cent.folder_name, '/') as "path_name"`)
    const [{ path_name }] = await knex.with("cent", withRaw)
        .select(selectRaw).from("cent").innerJoin("folders as cc", function() {
            this.on(knex.raw(`cc.path_ltree ~ '${ file.path_ltree }'`))
        })
    return {
        ...file,
        path_name
    }
}

export async function getFolderIdByPathLtree(pathltree){
    if(!pathltree)
        throw new Error("pathltree faltantes, e são obrigatorios; getFolderIdByPathLtree")

    const [folder] = await knex("folders")
        .select("id")
        .where({ path_ltree: pathltree }) 
        .limit(1);

    if(!folder)
        throw new Error("Pasta pai em upload file, não encontrada com path_ltree; getFolderIdByPathLtree")
    
    return folder.id
}

export async function initUpload(req_body){
    const { user_id, root_path_ltree, paths, space } = req_body;

    const folders = paths.map( ({ path, pathltree }) => {
        return {
            id: nanoid(),
            created_user_id: user_id,
            folder_name: path.split("/").pop(),
            path_ltree_id: pathltree.split(".").pop(),
            path_ltree: `${ root_path_ltree }.${ pathltree }`,
            space_owner: space
        }
    })

    await knex("folders").insert(folders);
    return folders
}

export async function editOrDeleteFiles(files){
    const { remove } = formatActions(files)

    await knex.transaction( async trx => {

        if(remove.length){
            const promises = []
            
            remove.forEach(({ id }) => {
                promises.push(trx("files").del().where({ id }))
            })
            
            await Promise.all(promises)
        }
    })
    
    return true
}