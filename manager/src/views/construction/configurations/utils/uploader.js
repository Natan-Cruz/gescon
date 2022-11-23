import axios from "@/services/api"

export function uploadImage({ imageData, constructionId } ){
    const formData = new FormData();   

    formData.append('image', imageData);

    const url = `constructions/${ constructionId }/banner`;
    const headers = {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
    }

    return new Promise(( resolve, reject ) => {
        axios({
            method: "POST",
            url,
            headers,
            data: formData
        })
        .then( reponse => resolve(reponse.data))
        .catch( error => reject(error))
    })
}   

export function deleteImage(constructionId){
    const url = `constructions/${ constructionId }/banner`;

    return new Promise((resolve,reject) => {
        axios.delete(url)
            .then( reponse => resolve(reponse.data))
            .catch(error => reject(error))
    })
}