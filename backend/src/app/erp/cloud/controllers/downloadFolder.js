import knex from "../../../../database/database.knex";
import archiver from "archiver";
import { googleStorageBucket } from "../../../../database/google.storage";
import path from "path";

const routerDownloadFolder = async (req, res) => {
    const { folder_id } = req.params;
    try {
        const parentFolder = await getParentFolder(folder_id);

        const promiseChildrenFolders = getChildrenFolders(parentFolder.path_ltree);
        const promiseFiles = getFiles(parentFolder.path_ltree);

        const [ childrenFolder, files ] = await Promise.all([ promiseChildrenFolders, promiseFiles ])

        const folders = [ parentFolder, ...childrenFolder ];

        files.map(file => injectPath(file, folders))

        const archive = archiver('zip',
            { zlib: { level: 9 }}
        );

        archive.on('end', () => res.end()); // end response when archive stream ends

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });
        archive.on('error', function(err) {
            throw err
        });
        res.attachment(`${parentFolder.folder_name}.zip`);

        // pipe archive data to the file
        archive.pipe(res);
        
        for(const file of files){
            archive.append(
                googleStorageBucket.file(file.cloud_file_path).createReadStream(),
                { name: path.join(file.path, file.file_name)}
            );
        }
        
        archive.finalize();

    }catch(error){
        console.error(error)
        res.status(400).send("Internal Server Error")
    }
}

async function getParentFolder(folder_id){
    const [ folder ] = await knex("folders")
        .select('*').where({ id: folder_id }).limit(1)

    if(!folder)
        throw new Error("Pasta não encontrada!")

    return folder;
}

async function getChildrenFolders(pathLtree){
    const queryRawFolders = `f."path_ltree" ~ '${ pathLtree }.*{1,}'`;
    return await knex("folders as f")
        .select("f.*")
        .andWhereRaw(queryRawFolders)
}

async function getFiles(pathLtree){
    const queryRawFiles = `f."path_ltree" ~ '${ pathLtree }.*'`;
    return await knex("files as a")
        .select("a.*", "f.path_ltree")
        .innerJoin("folders as f", "f.id", "a.folder_id")
        .andWhereRaw(queryRawFiles)
}

function transformPathsLtreesToPath(pathLtree, folders){
    const pathLtreeMap = new Map();
    
    folders.forEach( ({ folder_name, path_ltree }) => {
        pathLtreeMap.set(path_ltree, folder_name)
    })

    const paths = []
    const split = pathLtree.split('.')
    split.forEach( ( _, i) => {
        const folderName = pathLtreeMap.get(split.slice(0, (i + 1) ).join('.'))
        if(folderName)
            paths.push(folderName)
    })
    
    return paths.join("/")
}

function injectPath(file, folders){
    folders.forEach( folder => {
        if(folder.id !== file.folder_id)
            return;

        const path = transformPathsLtreesToPath(folder.path_ltree, folders)
        file.path = path;
    })
    return file
}

export default routerDownloadFolder;