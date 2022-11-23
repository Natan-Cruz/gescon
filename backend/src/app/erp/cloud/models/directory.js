import knex from "../../../../database/database.knex";
import GesconError from "../../../../utils/GesconError";
import mime from "mime"
export async function getFolderContent( path, space ){
    if(space !== "user" && space !== "construction" && space !== "company")
        throw new Error("Espaço errado!")

    const queryRawFolders = knex.raw(`f."path_ltree" ~ '${ path }.*{0,1}'`),
        queryRawFiles = knex.raw(`f."path_ltree" ~ '*.${ path }'`);

    const promiseFolders = knex("folders as f")
        .select("f.*",)
        .andWhereRaw(queryRawFolders)
        .andWhere({ "f.space_owner": space })
        .orderBy("f.folder_name", "asc")

    const promiseSizeFolders = knex("folders as f")
        .select(knex.raw("CAST(sum(fl.size) AS INTEGER) as size"), "f.path_ltree")
        .leftJoin("files as fl", "fl.folder_id", "f.id")
        .whereRaw(knex.raw(`f.path_ltree <@ '${ path }'`))
        .groupBy("f.id")

    const promiseFiles = knex("files as a")
        .select("a.*", "f.path_ltree")
        .innerJoin("folders as f", "f.id", "a.folder_id")
        .andWhereRaw(queryRawFiles)
        .andWhere({ "f.space_owner": space })
        .orderBy("a.file_name", "asc")

    const [ folders, files, sizeFolders ] = await Promise.all([ promiseFolders, promiseFiles, promiseSizeFolders ]);

    if(!folders.length)
        throw new GesconError("Pasta não encontrada!")
    
    const [parentFolder] = folders.filter( folder => {
        if(folder.path_ltree === path) return folder
    })
    const childrenFolders = folders.filter( folder => {
        if(folder.path_ltree !== path) return folder
    }).map( folder => {
        let sum = 0;
        sizeFolders.forEach(({ size, path_ltree }) => {
            if(path_ltree.startsWith(folder.path_ltree)){
                sum += size
            }
        })
        return {
            ...folder,
            size: sum || ""
        }
    })
    // isso faz com que as pastas criadas pelo sistema aparecam nos primeiros lugares
    // independente do ordenamento
    childrenFolders.forEach( (folder, i) => {
        if(folder.folder_name.startsWith("@") && folder.was_created_by_system){
            childrenFolders.splice(i, 1)
            childrenFolders.unshift(folder)
        }
    })

    const paths = [];

    parentFolder.path_ltree.split(".").forEach( ( p, i) => {
        // Primeiro path é o root
        if(!paths.length)
            paths.push(p)
        else
            paths.push(`${paths[i - 1]}.${p}`)
    })

    
    const fullpath = (await knex("folders as f")
        .select('f.folder_name')
        .whereRaw(`f."path_ltree" in ('${ paths.join("','") }') ORDER BY CHAR_LENGTH(ltree2text(f."path_ltree"))`)
        ).map( ({ folder_name }) => folder_name).join('/')

    files.map( file => {
        const path_ltree = file.path_ltree.split('.')
        file.path_ltree = `${path_ltree.join('/')}/${file.cloud_file_name}`
        return file
    })

    return {
        parentFolder: {
            ...parentFolder,
            fullpath: fullpath
        },
        children: [ ...childrenFolders, ...files ]
    }
}

export async function searchFoldersAndFiles(req_query){
    if(!req_query) return [];
    const { search, mode, filter } = req_query;

    const query = {
        path: "",
        filetype: "",
        date: {
            folder: "",
            file: ""
        }
    }

    switch(mode){
        case "in_directory":
            query.path = knex.raw(`f."path_ltree" ~ '${ req_query.path }.*{1,1}'`)
            break
        case "starts_in_directory":
            query.path = knex.raw(`f."path_ltree" ~ '${ req_query.path }.*{1,}'`)
            break
        case "all": default:
            query.path = knex.raw(`f."path_ltree" ~ '${ req_query.path.split(".").shift() }.*'`)
    }

    switch(filter){
        case "pdf": 
            query.filetype = knex.raw("a.file_name like '%.pdf'")
            break
        case "images": 
            query.filetype = knex.raw("a.file_type like 'image%'")
            break
        case "videos": 
            query.filetype = knex.raw("a.file_type like 'video%'")
            break
        case "audios": 
            query.filetype = knex.raw("a.file_type like 'audio%'")
            break
        case "today": 
            query.date.folder = knex.raw("date(f.created_at) = CURRENT_DATE")
            query.date.file = knex.raw("date(a.uploaded_at) = CURRENT_DATE")
        break
        case "yesterday": 
            query.date.folder = knex.raw("date(f.created_at) = CURRENT_DATE - INTEGER '1'")
            query.date.file = knex.raw("date(a.uploaded_at) = CURRENT_DATE - INTEGER '1'")
        break
        case "last_7_days": 
            query.date.folder = knex.raw("date(f.created_at) > CURRENT_DATE - INTEGER '7'")
            query.date.file = knex.raw("date(a.uploaded_at) > CURRENT_DATE - INTEGER '7'")
        break
    }

    const onlyFolders = filter === "folders",
        onlyFiles = filter === "pdf" || filter === "images" || filter === "files" || filter === "videos" || filter === "audios"
        
    if(onlyFolders){
        const folders = await knex("folders as f")
            .select('*')
            .whereRaw(query.path)
            .andWhereRaw(knex.raw(`f."folder_name" ILIKE '%${ search }%'`))
            .andWhereNot({ folder_name: "root" })
            .orderBy("f.folder_name", "asc")

        return folders        
    } else if(onlyFiles){
        const files = await knex("files as a")
            .select("a.*", "f.path_ltree")
            .innerJoin("folders as f", "f.id", "a.folder_id")
            .whereRaw(query.path)
            .whereRaw(query.filetype)
            .andWhereRaw(knex.raw(`a."file_name" ILIKE '%${ search }%'`))
            .orderBy("a.file_name", "asc")

        return files
    } else {
        const promiseFolders = knex("folders as f")
            .select('*')
            .whereRaw(query.path)
            .andWhereRaw(knex.raw(`f."folder_name" ILIKE '%${ search }%'`))
            .whereRaw(query.date.folder)
            .andWhereNot({ folder_name: "root" })

        const promiseFiles = knex("files as a")
            .select("a.*", "f.path_ltree")
            .innerJoin("folders as f", "f.id", "a.folder_id")
            .whereRaw(query.path)
            .andWhereRaw(knex.raw(`a."file_name" ILIKE '%${ req_query.search }%'`))
            .whereRaw(query.date.file)

        const [ folders, files ]= await Promise.all([ promiseFolders, promiseFiles ]);
        return folders.concat(files)
    }
}

function match(string, find){
    if(!string) return false
    return string.match(new RegExp(find))
}

export async function getFavorites( rootPath, space ){
    if(space !== "user" && space !== "construction" && space !== "company")
        throw new Error("Espaço errado!")

    const promiseFolders = knex("folders as f")
        .select("*")
        .where({ "f.is_favorite": true })        
        .andWhere({ space_owner: space })
        .andWhereRaw(knex.raw(`f."path_ltree" ~ ?`, [ `${ rootPath }.*` ]))

    const promiseFiles = knex("files as f")
        .select("f.*")
        .innerJoin("folders as fl", "fl.id", "f.folder_id")
        .where({ "f.is_favorite": true })
        .andWhere({ "fl.space_owner": space })
        .andWhereRaw(knex.raw(`fl."path_ltree" ~ ?`, [ `${ rootPath }.*` ]))


    const [ folders, files ] = await Promise.all([ promiseFolders, promiseFiles ])
    
    const orderByModifiedAt = ( a, b ) => a.modifiedAt < b.modifiedAt;

    return [ ...folders, ...files ].sort(orderByModifiedAt)
}

export async function toggleFolderFavorite(folder_id){
    if(!folder_id)
        throw new Error("Folder_id necessario")

    const [ folder ]= await knex("folders")
        .select("is_favorite")
        .where({ id: folder_id })
        .limit(1)

    if(!folder)
        throw new Error("Pasta não encontrada");

    const [ result ] = await knex("folders")
        .update({
            is_favorite: !folder.is_favorite,
            updated_at: "now()"
        })
        .where({ id: folder_id })
        .returning("*")

    return result
}

export async function toggleFileFavorite(file_id){
    if(!file_id)
        throw new Error("File_id necessario")

    const [ file ] = await knex("files")
        .select("is_favorite")
        .where({ id: file_id })
        .limit(1)

    if(!file)
        throw new Error("Arquivo não encontrado");

    const [ result ] = await knex("files")
        .update({
            is_favorite: !file.is_favorite,
            uploaded_at: "now()"
        })
        .where({ id: file_id })
        .returning("*")

    return result;
}