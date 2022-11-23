<template>
    <button-circle-with-content :isLoading="state.isLoading" :isShow="state.isShow" @open="openButton" @close="closeButton"> 
        <!-- Criar nova pasta -->
        <li @click="createNewFolder">Criar pasta</li>

        <!-- Carregar arquivos -->
        <li @click="closeButton">
            Carregar arquivo(s)
            <label for="input-file" class="input-file-label"></label>
            <input type="file" id="input-file" @input="uploadFiles" multiple="multiple" style="display:none">
        </li>
        
        <!-- Carregar pasta -->
        <li @click="closeButton">
            Carregar pastas(s)
            <label for="input-folder" class="input-file-label"></label>
            <input type="file" id="input-folder" @input="uploadFolders" webkitdirectory directory multiple="multiple" style="display:none" >
        </li>
    </button-circle-with-content>
</template>

<script>
import buttonCircleWithContent from "@/components/buttons/buttonCircleWithContent.vue"

import { reactive } from 'vue';
import axios from '@/services/api';
import { notify } from '@kyvg/vue3-notification';

import { useStore as useStoreUploader } from '@/store/uploader';
import { useStore as useStoreHistory } from "@/store/history"
import { useStore as useStoreCloud } from "../store"
import { buildPaths } from "./buildPath"
import { nanoid } from "nanoid"

export default {
    name: 'custom-button',
    components: { buttonCircleWithContent },
    props:{
        path: String,
        pathLtree: String,
        space: String,
    },
    setup(props, { emit }){
        // store uploader
        const uploader = useStoreUploader();
        const history = useStoreHistory();
        const storeCloud = useStoreCloud();
        const state = reactive({ isShow: false, isLoading: false })

		function openButton(){
            state.isShow = true;
            history.push({ name: "button_cloud", fn: closeButton })
        }
        function closeButton(){
            state.isShow = false;
            history.remove("button_cloud")
        }

        function createNewFolder(){
            emit("open-modal")
            closeButton()
        }
		function uploadFiles(evt){
            const evtFiles = evt.target.files;

            const reqHeaders = {
				fileFullPath: props.path,
				pathltree: props.pathLtree,
                group_id: nanoid(6)
			};

            uploader.push(Array.from(evtFiles), reqHeaders)

            evt.target.value = ""
		}
        async function uploadFolders(evt){
            state.isLoading = true;

			const evtFiles = evt.target.files;
            // Extrai somente o root path;
            // const rootPaths = Array.from(evtFiles).map( file => file.webkitRelativePath)
            try{
                const rootPaths = Array.from(evtFiles).map( file => file.webkitRelativePath)
                if(!rootPaths || !Array.isArray(rootPaths) || !rootPaths.length)
                    throw new Error("Não foi possivel subir a pasta")

                const paths = buildPaths(rootPaths)

                const url = "/files/init-upload",
                    body = {
                        root_path_ltree: props.pathLtree,
                        paths: paths,
                        space: props.space
                    };
                
                const { data } = await axios.post(url, body);
                storeCloud.addFolder(data[0]);

                Array.from(evtFiles).forEach( evtFile => {
                    const relativePath = evtFile.webkitRelativePath.split('/')
                    // O ultimo "path" é o nome do arquivo;
                    relativePath.pop();
                    const { pathltree } = paths.find( ({ path }) => path === relativePath.join("/"));
                    
                    const reqHeaders = {
                        fileFullPath: relativePath.join('/'),
                        pathltree: `${ props.pathLtree }.${ pathltree }`
                    };
                    uploader.push([evtFile], reqHeaders)
                })    
            }catch(error){
                console.error(error)
                return notify({
                    title: error,
                    type: "error",
                    duration: 5000
                })   
            }finally{
                state.isLoading = false;
                evt.target.value = ""
            }
		}

        return {
            state,
            openButton,
            closeButton,
            createNewFolder,
            uploadFiles,
            uploadFolders
        }
    }
}
</script>

<style lang="less" scoped>
    .input-file-label{
        cursor: pointer;

        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>