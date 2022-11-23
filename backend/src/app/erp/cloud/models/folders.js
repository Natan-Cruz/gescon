import knex from "../../../../database/database.knex"
import nanoid from "../../../../utils/nanoid";
import { deleteFile } from "../../../../database/google.storage";
import GesconError from "../../../../utils/GesconError";

export async function getFolderInformations(folderID){
    const [folder] = await  knex("folders as f")
        .select("f.*", knex.raw(`concat(u."first_name", ' ', u."last_name") as "createdUserName"`))
        .leftJoin("users as u", "u.id", "f.created_user_id")
        .where({ "f.id": folderID })

    if(!folder)
        throw new Error("Pasta não encontrada");

    if(!folder.created_user_id)
        folder.createdUserName = "Criada pelo sistema"

    return folder
}

export async function updateFolder(folderID, alterations){
    if(!folderID)       
        throw new Error("Paramentro folderID necessário");

    const [ folder ] = await knex("folders")
        .update({ folder_name: alterations.folder_name })
        .where({ id: folderID })
        .returning("*")
        .limit(1)

    return folder
}

export async function createNewFolder(userID, req_body){
    if(!req_body.folder_name || !req_body.path_ltree)
        throw new GesconError("Nome da pasta não pode ser em branco!");

    const [has] = await knex("folders as f")
        .select(0)
        .where({ folder_name: req_body.folder_name })
        .andWhereRaw(`f."path_ltree" ~ '${ req_body.path_ltree }.*{1,1}'`)

    if(has)
        throw new GesconError("Neste diretório já possui uma pasta com este nome")
        
    const id = nanoid(), //16 length,    
        path_ltree_id = nanoid(6);


    return await knex.transaction( async trx => {

        const [ folder ] = await trx("folders")
            .insert({
                id: id,
                created_user_id: userID,
                folder_name: req_body.folder_name,
                path_ltree_id: path_ltree_id,
                path_ltree: `${ req_body.path_ltree }.${ path_ltree_id }`,
                space_owner: req_body.space
            })
            .returning("*")

        
        if(req_body.space === "construction")
            await trx("construction_scheme.erp_activities").insert({
                id: nanoid(),
                construction_id: req_body.path_ltree.split(".")[0],
                user_id: userID,
                action: "ADD",
                description: "Uma pasta foi criada!",
                resource: "cloud",
                resource_id: folder.id
            })
        
        return folder;
    })
}

export async function deleteFolder(folderID){
    const parentFolder = await getParentFolder(folderID);

    const promiseChildrenFolders = getChildrenFolders(parentFolder.path_ltree);
    const promiseFiles = getFiles(parentFolder.path_ltree);

    const [ childrenFolder, files ] = await Promise.all([ promiseChildrenFolders, promiseFiles ])

    const promises = []
    for(const file of files){
        promises.push(deleteFile(file.cloud_file_path))
    }
    await Promise.all(promises)

    const folders = [ parentFolder, ...childrenFolder ];

    await knex.transaction( async trx => {
        await trx("files").del().whereIn('id', files.map( f => f.id ))
        await trx("folders").del().whereIn('id', folders.map( f => f.id) )
    })

    return true;
}

export async function getParentFolder(folderID){
    const [ folder ] = await knex("folders")
        .select('*').where({ id: folderID }).limit(1)

    if(!folder)
        throw new Error("Pasta não encontrada!")

    return folder;
}


export async function getChildrenFolders(path_ltree){
    const queryRawFolders = `f."path_ltree" ~ '${ path_ltree }.*{1,}'`;
    return await knex("folders as f")
        .select("f.*")
        .andWhereRaw(queryRawFolders)
}

export async function getFiles(path_ltree){
    const queryRawFiles = `f."path_ltree" ~ '${ path_ltree }.*'`;
    return await knex("files as a")
        .select("a.*", "f.path_ltree")
        .innerJoin("folders as f", "f.id", "a.folder_id")
        .andWhereRaw(queryRawFiles)
}