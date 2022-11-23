<template>
    <Modal :maxWidth="400" @close-modal="$emit('close-modal')">
        <p class="title">Editar {{ isFolder ? "Pasta" : "Arquivo" }}</p>

        <form action="#" @submit.prevent="submitForm">
            <div class="row">
                <input type="text" class="input" v-model="state.itemName">
                <span class="text-medium filetype" v-show="!isFolder">.{{ state.fileType }}</span>
            </div>

            <form-loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" />

            <div style="position: relative; height: 42px">
                <button type="submit" class="button button-primary text-medium" @click="submitForm" :disabled="state.isLoading">Salvar</button>
            </div>
        </form>
    </Modal>
</template>

<script>
import { useStore as useStoreCloud } from "../store.js"

import { computed, onMounted, reactive } from 'vue';
import { notify } from '@kyvg/vue3-notification';
import axios from "@/services/api"

export default {
    name:"modal-edit-folder-or-file-name",
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }){
        const storeCloud = useStoreCloud()
        const state = reactive({ isLoading: false, errorMsg: "", fileType: "", itemName: "" })
        const isFolder = computed(() => props.item && props.item.folder_name ? true : false)

        onMounted(() => {
            const { folder_name, file_name } = props.item
            if(isFolder.value)
                state.itemName = folder_name;
            else{
                const [ name, fileType ] = file_name.split('.')
                state.fileType = name;
                state.itemName = fileType
            }
        })


        async function submitForm(){
            state.isLoading = true;
            state.errorMsg = "";
            try {
                if(isFolder.value){
                    const { data } = await axios.put(`/cloud/folder/${ props.item.id }`, { folder_name: state.itemName })
                    storeCloud.editItem(data)
                }else{   
                    const { data } = await axios.put(`/files/${ props.item.id }`, { file_name: `${ state.itemName }.${ state.fileType }` })
                    console.log(data)
                    storeCloud.editItem(data)
                }

                notify({
                    title: "Nome alterado!!",
                    type: "success",
                    duration: 5000
                })

                emit("close-modal")

            } catch (error) {
                state.errorMsg = error
            }finally{
                state.isLoading = false
            }
        }   

        return {
            state,
            isFolder,
            submitForm,
        }
    }
}
</script>
<style lang="less" scoped>
    .title{
        font-size: 2em;
        font-weight: bold;
        text-align: center;
    }
    .row{
        position: relative;
        height: 40px;
        margin: 16px 0;
    }
    .input{
        padding-right: 36px;
    }
    .filetype{
        position: absolute;
        right: 6px;
        top: 0;
        width: auto;
        height: 100%;
        background-color: transparent;
        padding: 11px 0;
    }

    .button{
        width: 140px;
        height: 42px;
        position: absolute;
        bottom: 0;
        right: 0;
    }
</style>