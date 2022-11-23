import axios from "../services/api"

export function Uploader({ configurations, file }, onUploadProgress){
    const formData = new FormData();    

    // A ORDEM É EXTREMANETE IMPORTANTE DEVIDO A CONFIGURAÇÕES INTERNAS
    // DO SERVIDOR
    // I.M.P.O.R.T.A.N.T.E
    formData.append('fileName', file.fileName);
    formData.append("fileType", file.fileType)
    formData.append("lastModified", file.lastModified)
    // 
    formData.append("pathltree", configurations.pathltree)
    formData.append('group_id', configurations.group_id)
    
    if(configurations.reference_table && configurations.reference_key && configurations.reference_value){
        formData.append('reference_table', configurations.reference_table)
        formData.append('reference_key', configurations.reference_key)
        formData.append('reference_value', configurations.reference_value)
    }

    formData.append('file', file.blob);

    // const axiosSource = axios.CancelToken.source();

    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: "/files",
            headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` },
            // cancelToken: axiosSource,
            data: formData,
            // Updated every 100ms
            onUploadProgress: progressEvent => {
                let progress = Math.round( (progressEvent.loaded * 100) / progressEvent.total);
                onUploadProgress(progress)
            }
        })
        .then(resolve)
        .catch(reject)
        .finally(() => {
            // Limpa formDate, não sei se é necessário
            // Porém para evitar despedicio de memoria
            // é recomendado fazer este procedimento abaixo
            formData.delete('fileName');
            formData.delete("fileType");
            formData.delete("pathltree");
            formData.delete("lastModified");
            formData.delete('reference_table')
            formData.delete('reference_key')
            formData.delete('reference_value')
            formData.delete('group_id');
            formData.delete('file');
        })
    })
}