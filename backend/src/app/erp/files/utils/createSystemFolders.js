import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid"

// path_ltree = path_ltree
// folderPath
export async function createSystemFolders(userID, newPath, newPathLtree, rootPathLtree, space){ 
    const [hasFolder] = await knex("folders")
        .select(0)
        .where({ path_ltree: `${ rootPathLtree }.${ newPathLtree }` })
        .limit(1)
    
    // verifica se no caminho ja tem uma pasta com este pathltree
    if(hasFolder)
        return true;
        
    const pathLtreeSplited = newPathLtree.split('.'),
        pathSplited = newPath.split("/")

    const folders = []

    console.log("teste")
    throw new Error("fdsafsd")
        
    for(const [ i, ltree ] of pathLtreeSplited.entries() ){

        const [ subFolder ] = await knex("folders")
            .select(0)
            .where({ path_ltree: `${ rootPathLtree }.${ ltree }` })
            .limit(1);

            
        if(!subFolder){            
            const id = nanoid();

            folders.push({
                id: id,
                created_user_id: userID,
                folder_name: pathSplited.slice(i, i + 1).join(""),
                path_ltree_id: pathLtreeSplited.slice(i, i + 1).pop(),
                path_ltree: `${ rootPathLtree }.${ pathLtreeSplited.slice(0, i + 1).join(".") }`,
                space_owner: space
            })
        }
    }
    if(folders && folders.length){
        await knex("folders").insert(folders)
        return folders[0]
    }
}

// ( async () => {
//     const a = await createSystemFolders("7W2eVwNWGyrhbtX4", "Images", "usj53a.adsad", "YxexwB90JxuPN3Dx", "construction")
//     console.log("result", a)
// })()
