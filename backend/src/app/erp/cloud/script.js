import nanoid from "../../utils/nanoid";
import knex from "../../database/database.knex";


(async () => {
    const users = (await knex("users").select("id")).map( ({ id }) => id)

    const rootFolders = users.map( userID => {
        const id = nanoid(), //16 length,    
            pathLtreeID = nanoid(6);

        return {
            id: id,
            folderName: "root",
            pathLtreeID: pathLtreeID,
            pathLtree: userID,
            spaceOwner: "user",
            wasCreatedBySystem: 1,
        }
    })

    await knex("folders").insert(rootFolders)

    console.log(rootFolders)
})()