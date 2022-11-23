import { Storage } from "@google-cloud/storage";
import { customAlphabet } from "nanoid";
import path from "path"
const nanoid = customAlphabet("0123456789abcdefzhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 32);

const storage = new Storage({
    keyFilename: path.join(__dirname, "../config/gescon-eea3d-firebase-adminsdk-9zjs4-5ff355ad27.json"),
    projectId: "gescon-eea3d" 
})

const googleStorageBucket = storage.bucket("gs://gescon-eea3d.appspot.com");
export { googleStorageBucket };

export function uploadArchive({ destination, filename, buffer, isPublic }){
    if(!destination || !filename)
        throw new Error("Paramentros faltantes");

    return new Promise(( resolve, reject ) => {
        const uuid = nanoid(), 
            extension = filename.split('.').pop(),
            newFileName = `${uuid}.${extension}`,
            filePath = `${destination}/${newFileName}`
        
        const blob = googleStorageBucket.file(filePath);

        const blobStream = blob.createWriteStream({
            resumable: buffer.size < 1e+7 ? false : true,
            public: isPublic || false
        });
        
        blobStream.on("error", error => {
            reject(error)
        })

        blobStream.on("finish", () => {
            resolve({
                fileName: newFileName,
                fileUrl: `https://storage.googleapis.com/${googleStorageBucket.name}/${filePath}`,
                filePath: filePath
            })
        })

        blobStream.end(buffer)
    })
}

export async function deleteFile(cloud_file_path){
    if(!cloud_file_path) 
        throw new Error("cloud_file_path ausente!!");
    
    const file = googleStorageBucket.file(cloud_file_path);

    const [exist] = await file.exists()

    if(!exist)
        return true;

    return await file.delete()
}

export async function downloadArchive(filename){
    try {
        const file = googleStorageBucket.file(filename);

        const [exist] = await file.exists()

        if(exist)
            return file.createReadStream()


        return false
    } catch (error) {
        return error
    }
}
