/* eslint-disable */
import { defineStore } from "pinia"
import { nanoid } from "nanoid";
import { Uploader } from "../Utils/Uploader"
import { getFile, isFile } from "../Utils/index"
import { edit, find, remove } from "../Utils/arrayDb"
import axios from "../services/api";

export const useStore = defineStore("uploader", {
    state: () => ({
        queue: []
    }),
    actions: {
        push(evtFiles, reqHeaders){
            if(!evtFiles) return;

            if(Array.isArray(evtFiles)){
                const { upload, edit } = evtFiles.reduce(( acc, cur ) => {
                    if(isFile(cur)) 
                        acc.upload.push(cur)
                    else if(cur.action) 
                        acc.edit.push(cur)

                    return acc
                }, { upload: [], edit: [] })
                if(upload && upload.length) upload.forEach( evtFile => this.upload(reqHeaders, evtFile))
                if(edit && edit.length) this.editFiles(edit)
            }else
            if(typeof evtFiles === "object"){
                if(isFile(evtFiles))
                    this.upload(reqHeaders, evtFiles)
                else
                    this.editFiles(evtFiles)
            }
        },
        async upload(reqHeaders, evtFile){
            const _uuid = nanoid();
    
            this.queue.push({
                _uuid: _uuid,
                error: false,
                done: false,
                timeStamp: Date.now(),
                fileName: evtFile.name,
                filePath: reqHeaders.fileFullPath,
                size: evtFile.size,
                uploadProgress: 0,
                reqHeaders
            })

            try {
                const file = await getFile(evtFile, { _uuid })
                const { data } = await Uploader({ configurations: reqHeaders, file }, (progress) => { 
                    this.queue = edit(this.queue, { _uuid: _uuid }, { uploadProgress: progress })
                })
                this.queue = edit(this.queue, { _uuid: _uuid }, { ...data, done: true })
            } catch (error) {
                console.error(error)
                this.queue = edit(this.queue, { _uuid: _uuid }, { error: "Ops, ocorreu um erro!" })
            }
        },
        cancelUpload(_uuid){
            const item = find(this.queue, { _uuid })
            item.request.cancel("Cancelado pelo usuário!")
        },
        removeItem(_uuid){
            this.queue = remove(this.queue, { _uuid })
        },
        async editFiles(files){
            const body = files.map( file => {
                return {
                    id: file.id,
                    action: file.action
                }
            })
            try {
                await axios.put("/files", body)
            } catch (error) {
                console.error(error)
            }
        }
    }
})