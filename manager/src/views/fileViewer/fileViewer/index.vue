<template>
    <div class="wrapper-file-viewer">
        <loading-or-error :isLoading="state.isLoading" :width="60" :error="state.errorMsg" @event-retry="loadFile"></loading-or-error>
        
        <!-- PDF VIZUALIZER -->
        <div class="file-viewer file-viewer-pdf" v-if="isFile">
            <VuePdf
                v-for="i in state.numPages"
                :key="i"
                :src="pdfSrc"
                :page="i"
            ></VuePdf>
        </div>

        <div ref="file_viewer" class="file-viewer ctn-center" v-else></div>
       
    </div>
</template>

<script>
import { VuePdf, createLoadingTask } from 'vue3-pdfjs/esm';
// import mime from "mime";

import { renderImage, renderAudioPlayer, renderVideoPlayer } from "./renders";
import axios from "axios";
import { onBeforeMount, onMounted, watch, reactive, ref, computed} from 'vue';
export default {
    name: "body-component",
    components: { VuePdf },
    props:{
        file: Object,
        userToken: String
    },
    setup(props){    
        // aproximadamente 20MB
        const BYTES_LIMIT = 2e+7
        const state = reactive({ isLoading: false, errorMsg: "", src: "", numPages: "" })
        const file_viewer = ref(null)
        const isFile = computed(() => {
            if(!props.item) return false;
            return props.item.file_type.split("/").pop() === "pdf"
        })
        const url = computed(() => `https://gescon-tec.herokuapp.com/erp/files/${ props.file.id }`)

        async function loadFile(){

            state.isLoading = true;
            state.errorMsg = "";

            const [ type, subtype ] = props.file.file_type.split('/')
            const fileViewer = file_viewer.value;
            try {
                switch(type){
                    case "image":
                        await renderImage(fileViewer, url.value)
                    break;
                    case "video":
                        await renderVideoPlayer(fileViewer, url.value)
                    break;
                    case "audio":
                        await renderAudioPlayer(fileViewer, url.value)
                    break;
                    case "text":
                        await renderText(fileViewer, url.value)
                    break;
                    case "application":
                        switch(subtype){
                            case "pdf":
                                await renderApplicationPDF(url.value)
                                break;
                            default:
                                fileViewer.innerHTML = '<p style="font-size: 1em">Nenhuma vizualização disponível</p>'
                        }
                }
            } catch (error) {
                console.error(error)
                state.errorMsg = error
            }
            finally{
                state.isLoading = false
            }   
        }

        function renderText(fileViewer, url){
            return new Promise(( resolve, reject ) => {
                if(props.file.size > BYTES_LIMIT){
                    return reject("Arquivo muito pesado para ser vizualizado")
                }
                axios({ 
                    url, 
                    responseType: 'text'
                })
                .then(({ data }) => {
                    // output `null`, illegal, awesome!
                    fileViewer.innerHTML = data
                    resolve()
                })
                .catch( error => {
                    console.error(error)
                    reject(error)
                })
            })
        }
        
        function renderApplicationPDF(url){
            return new Promise(( resolve, reject ) => {
                if(props.file.size > BYTES_LIMIT){
                    return reject(`Arquivo muito pesado para ser vizualizado, limite: ${BYTES_LIMIT}`)
                }

                const loadingTask = createLoadingTask(url)
                loadingTask.promise.then( pdf => {
                    state.numPages = pdf.numPages
                }).finally(() => state.isLoading = false)
            })
        }

        onMounted(() => {
            if(props.file.file_type)
                loadFile()
        })

        watch(() => props.file, () => loadFile())

        onBeforeMount(() => {
            const fileViewer = document.querySelectorAll(".file-viewer")
            fileViewer.forEach( viewer => {
                viewer.innerHTML = "";
            })
        })
   
        return {
            state,
            isFile,
            file_viewer,
            loadFile,
            pdfSrc: url
        }
    }
}
</script>

<style lang="less" scoped >
	.container-loading, .ctn-center{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
    .file-viewer{
        padding: 20px;
        font-size: 1.7em;
        border: solid 1px gray;
    }
    .progress{
        font-size: 1.7em;
        position: absolute;
    }

    .no-preview{
        font-size: 1.7em;
    }
</style>