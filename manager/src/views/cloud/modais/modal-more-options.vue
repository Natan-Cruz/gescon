<template>
    <Modal :maxWidth="400" @close-modal="$emit('close-modal')">
        <div class="header">
            <h2 class="title">{{ itemName }}</h2>
        </div>
        <div class="body">
            <form-loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" />
            <ul>
                <li class="item item-star" :class="{ 'item-star-filled': item.is_favorite }" @click="togleHighlighted">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
                    <p>{{ item.is_favorite ? "Remover dos" : "Adicionar aos" }} favoritos</p>
                </li>
                <li class="item" @click="handleDownloadItem">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z"/></svg>
                    <p>Download</p>
                </li>
                <li class="item" @click="handleRenameItem">
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><g><polygon points="15,16 11,20 21,20 21,16"/><path d="M12.06,7.19L3,16.25V20h3.75l9.06-9.06L12.06,7.19z M5.92,18H5v-0.92l7.06-7.06l0.92,0.92L5.92,18z"/><path d="M18.71,8.04c0.39-0.39,0.39-1.02,0-1.41l-2.34-2.34C16.17,4.09,15.92,4,15.66,4c-0.25,0-0.51,0.1-0.7,0.29l-1.83,1.83 l3.75,3.75L18.71,8.04z"/></g></g></svg>				
                    <p>Renomear</p>
                </li>
                <!-- <li class="item" @click="handleShowDetails">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                    <p>Detalhes</p>
                </li> -->
                <li class="item" @click="handleDeleteItem">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                    <p>Excluir</p>
                </li>
            </ul>
        </div>
    </Modal>
</template>

<script>
import { reactive } from 'vue';
import axios from '@/services/api';
import { notify } from '@kyvg/vue3-notification';

import { useStore as useStoreCloud } from "../store.js"
import { saveAs } from 'file-saver';

export default {
    name: 'modal-more-options',
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }){
        const storeCloud = useStoreCloud()
        const state = reactive({ isLoading: false, errorMsg: "" })

        const isFolder = !!props.item.folder_name
        const itemName = props.item.folder_name || props.item.file_name

        async function togleHighlighted(){
            state.isLoading = true;
            state.errorMsg = "";
            try {
                const { data } = await axios.put("/cloud/toggle-favorite", {
                    type: isFolder ? "folder" : "file",
                    id: props.item.id
                })
                storeCloud.editItem(data);

                let title;
                if(data.is_favorite){
                    title = "Adicionado aos favoritos";
                    storeCloud.addInFavorites(data)
                } else {
                    title = "Removido dos favoritos";
                    storeCloud.removeFromFavorites(data)
                }

                emit("close-modal")

                notify({
                    title: title,
                    type: "success",
                    duration: 5000
                })

            } catch (error) {
                console.error(error)
                state.errorMsg = "Ops, ocorreu um problema, por favor tente novamente!"
            }finally{
                state.isLoading = false;
            }
        }  
        
        async function handleDownloadItem(){
			let url = "", downloadName = "";

			if(isFolder){
				url = `/cloud/folder/${props.item.id}/download`;
				downloadName =  `${itemName}.zip`
			}else{
				url = `/files/${props.item.id}`;
				downloadName =  itemName;
			}

            saveAs(`https://gescon-tec.herokuapp.com/erp${ url }`, downloadName);
            emit("close-modal")
		}

        function handleRenameItem(){
            emit("close-modal")
            emit("open-modal-edit-folder-or-file")
        }

        function handleShowDetails(){
            // emit("close-modal")
            // this.$modal.show('folder-informations', props.item.id)
        } 

        async function handleDeleteItem(){
			state.isLoading = true;
            state.errorMsg = ""
            const url = isFolder ? `/cloud/folder/${ props.item.id }` : `/files/${ props.item.id }`;
			try {
                await axios.delete(url)
                storeCloud.removeItem({ id: props.item.id })
                storeCloud.removeFromFavorites({ id: props.item.id })
                notify({
                    title: "Item deletado com sucesso",
                    type: "success",
                    duration: 5000
                })
                emit("close-modal")
			} catch (error) {
                state.errorMsg = "Ops, ocorreu um problema, por favor tente novamente!"
			}
			finally{
				state.isLoading = false;
			}
		}

        return {
            state,
            isFolder,
            itemName,
            togleHighlighted,
            handleDownloadItem,
            handleRenameItem,
            handleShowDetails,
            handleDeleteItem
        }
    }
}
</script>
<style lang="less" scoped>
    .wrapper{
        width: 100%;
        height: auto;
        overflow:auto; 
        position: relative;
    }
    .header{
        width: 100%;
        padding: 10px;
        border-bottom: solid 1px gray
    }

    .title{
        font-size:2em;
        text-align: center;
    }

    .btn-close{
        z-index: 100;
    }

    .body{
        padding: 10px;
    }

    .item{
		position: relative;
		border-bottom: dashed 1px gray;
		&:last-child{
			border: none;
		}
		svg{
			width: 24px;
			height: 24px;
			position: absolute;
			top: 6px;
			left: 0;
		}
        p, a{
            cursor: pointer;
            color: #444444;
            display: block;
            font-size: 1.7em;
            white-space: nowrap;
            padding: 10px 0;
            padding-left: 30px;
            &:hover{
                color: #000;
            }
        }
	}

    .item-star{
        fill: none;
        stroke: #ffcd3c;
    }
    .item-star-filled{
        fill: #ffcd3c;
    }
   
    @media screen and (min-width:1000px) {
        :global(.modal-container_custom){
            align-items: center;
            justify-content: flex-end;
        }
        .global__modal{
            height: 100vh;
        }
    }

    @media screen and (max-width: 1000px){
        :global(.modal-container_custom){
            align-items: flex-end;
        }
        .global__modal{
            max-width: 100%;
            width: 100%;
        }
    }
</style>