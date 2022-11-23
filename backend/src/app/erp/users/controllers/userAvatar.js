import { searchUser } from "../models/user";
import { uploadArchive, deleteFile } from "../../../../database/google.storage";
import knex from "../../../../database/database.knex"
import Controller from "../../../../utils/Controller"

export const uploadPhoto = (req, res) => Controller(async () => {
    const file = req.file, userId = req.userId

    const { company_id, photo_file_path } = await searchUser("id", userId)

    if(photo_file_path)
        await deleteFile(photo_file_path)

    const cloudFile =  await uploadArchive({
        destination: company_id,
        filename: "avatar.jpeg",
        buffer: file.buffer,
        isPublic: true
    })
    
    const userPhoto = {
        photo_file_url: cloudFile.fileUrl,
        photo_file_name: cloudFile.fileName,
        photo_file_path: cloudFile.filePath
    }

    await knex("user_scheme.users").update(userPhoto).where({ id: userId })

    return userPhoto;

}, res, "", 201)

export const removePhoto = (req, res) => Controller( async () => {
    const userId = req.userId;
    const { photo_file_path } = await searchUser("id", userId)

    if(photo_file_path)
        await deleteFile(photo_file_path)

    const userPhoto = {
        photo_file_url: "",
        photo_file_name: "",
        photo_file_path: ""
    }

    await knex("user_scheme.users").update(userPhoto).where({ id: userId })
    return;
}, res, "", 204)