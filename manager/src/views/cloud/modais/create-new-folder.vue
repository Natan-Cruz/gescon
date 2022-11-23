<template>
    <Modal :maxWidth="400" @close-modal="$emit('close-modal')">
        <h2 class="title">Criar nova pasta</h2>

        <form action="#" @submit.prevent="createFolder" autocomplete="off">
            <input autocomplete="false" name="hidden" type="text" style="display:none;">

            <div class="ctn-input">
                <label for="name" class="label" >Nome:</label>
                <input type="text" id="name" class="input" v-model="state.folderName" placeholder="Nome da pasta" ref="input" autocomplete="disabled">
            </div>

            <form-loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" />

            <div class="wrapper-button-relative">
                <div class="ctn-buttons">
                    <button type="button" class="button button-second text-medium button-save-contact" @click="$emit('close-modal')">Cancelar</button>
                
                    <button type="submit" class="button button-primary text-medium button-save-contact" @click="createFolder" :disabled="state.isLoading">Criar pasta</button>
                </div>
            </div>
        </form>
    </Modal>
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import { useStore as useStoreCloud } from "../store.js"
import { onMounted, reactive, ref } from 'vue';
import axios from "@/services/api"

export default {
    name: 'modal-create-new-folder',
    props: {
        pathLtree: {
            type: String,
            required: true
        },
        space: {
            type: String,
            required: true
        }
    },
    setup(props, { emit }){
        const storeCloud = useStoreCloud()
        const state = reactive({ folderName: "", pathLtree: "", isLoading: false, errorMsg: "" })
        const input = ref(null)

        onMounted(() => {
            input.value.focus();
        })

        async function createFolder(){
            state.isLoading = true;
            state.errorMsg = "";

            try {
                const { data } = await axios.post("/cloud/folder", {
                    path_ltree: props.pathLtree,
                    folder_name: state.folderName,
                    space: props.space
                })
                storeCloud.addFolder({ ...data, isNew: true })
                notify({
                    title: "Pasta criada com sucesso!!",
                    type: "success",
                    duration: 5000
                })
                emit("close-modal")

            } catch (error) {
                state.errorMsg = error
            } finally {
                state.isLoading = false
            }
        }

        return {
            state,
            input,
            createFolder
        }
    }
}
</script>

<style lang="less" scoped>
    .title{
        font-size:2em;
        margin-bottom: 20px;
        text-align: center;
    }
    
    .ctn-input{
        margin-bottom: 15px;
    }
    .wrapper-button-relative{
        position: relative;
        height: 50px;
        margin-top: 24px;
    }
    .ctn-buttons{
        position: absolute;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
    }
    .button-save-contact{
        width: 120px;
        height: 46px;
        &:first-child{
            margin-right: 14px;
        }        
    }
    // 
    .btn-close{
        z-index: 100;
    }
</style>