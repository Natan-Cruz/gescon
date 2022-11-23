import axios from "../../../services/api"

export function uploadImage({ imageData } ){
    const formData = new FormData();   

    formData.append('image', imageData);

    const url = `/users/upload-photo`;
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

export function deleteImage(){
    const url = `/users/remove-photo`;

    return new Promise(( resolve, reject ) => {
        axios.delete(url).then(resolve).catch(reject)
    })
}