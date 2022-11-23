import _ from 'underscore';
import { arrayBufferToBlob } from 'blob-util'
import dayjs from "dayjs"
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export function getFile(eventFile, config){

    return new Promise(( resolve, reject ) => {
        const reader = new FileReader()

        reader.onloadend =  ()  => {

            const file = {
                lastModified: eventFile.lastModified,
                fileName: eventFile.name,
                size: eventFile.size,
                fileType: eventFile.type,
                blob: arrayBufferToBlob(reader.result),
                ...config
            }
            
            resolve(file)
        }

        reader.onerror = error => {
            reject(error)
        }
        
        if (eventFile) 
            reader.readAsArrayBuffer(eventFile);
        
    })
}
export function randomID(){
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const isFile = input => 'File' in window && input instanceof File;

export const isBlob = input => 'Blob' in window && input instanceof Blob;

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0 || !bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatCurrency(price){
    if(!price || (typeof price !== "number" && typeof price !== "string"))
        return "R$ -,--"

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return formatter.format(price);
}

export function formatDate(date, format = "DD/MM/YYYY"){
    if(!date) 
        return "--/--/----"

    return dayjs(date).format(format)
}

export function handleErrorAxios(error){
    if (error.response) {
        if(error.response.data.name === "GesconError"){
            return error.response.data.message;
        }else {
            return "Ops, ocorreu um problema"
        }
    }else if (error.request) {
        if (error.message === "Network Error") 
            return 'Ops, problema com a conexão com a internet, por favor tente novamente!'
        
        return 'Ops, deu um problema, por favor tente novamente!'  
    } else {
        return error.message
    } 
}
export function formatBytesPerSecond(bytes, decimals = 2){
    if(!bytes) return ""
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B/S', 'KB/S', 'MB/S', 'GB/S'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export function treeify (paths) {
    var tree = [];

    // This example uses the underscore.js library.
    _.each(paths, function(path) {
        var pathParts = path.newPath ? path.newPath.split(".") : path.path.split('.');
        // pathParts.shift(); // Remove first blank element from the parts array.
        var currentLevel = tree; // initialize currentLevel to root

        _.each(pathParts, function(part, i) {
            // check to see if the path already exists.
            var existingPath = _.findWhere(currentLevel, {
                name: part
            });
            if (existingPath) {
                // The path to this item was already in the tree, so don't add it again.
                // Set the current level to this path's children
                currentLevel = existingPath.children;
            } else {
                var newPart = {
                    path: pathParts.slice(0,i + 1).join("."), 
                    data: path,
                    deep: pathParts.length, 
                    name: part,
                    children: [],
                }

                currentLevel.push(newPart);
                // currentLevel.sort(orderBy) // orderna itens 
                currentLevel = newPart.children;
            }
        });
    });

    return tree
}