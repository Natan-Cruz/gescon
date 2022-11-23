<template>
    <div class="form-page" :class="{ 'not-footer': !showFooter }"> 
        <div class="header">
            <div class="content-header">

                <button class="button-back" @click="goBack" >
                    <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>

                    <div class="title">
                        <p>{{ title }}</p>
                    </div>
                </button>


                <popup-options v-if="store.data.id && !store.data.deleted_at && config.urls.delete && permissions.delete" class="popup-options" v-slot="{ hide }">
                    <div class="container-loading" v-if="popupLoading">
                        <spinner-loading :loading="popupLoading" />
                    </div>
                    
                    <p class="text-medium" @click="handleDelete(hide)">Excluir</p>
                </popup-options>
            </div>
        </div>

        <div class="body">
            <div class="content-body" :style="`max-width: ${ maxWidth }`">
                <loading-or-error :isLoading="isLoading" :error="errorMsg" @event-retry="fetch" style="background-color: #fff"/>
                <div v-if="store.data.deleted_at" class="container-alert">
                    <span>Deletado!!</span>
                </div>
                <slot />
                <!-- <template v-if="Object.entries(store.data)"> -->
                <!-- </template> -->
            </div>
        </div>

      
        <div class="footer" v-if="showFooter">
            <div class="content-footer">
                <slot name="footer" :submit="submit">

                    <div v-can="permissions.edit" v-if="showEditButton" >
                        <button  class="button button-primary text-medium" @click="edit">Editar</button>
                    </div>

                    <div v-can="permissions.create" v-if="showSaveButton">
                        <button-submit :selected="selected" :disabled="isLoading" @select-function="selected = $event"  @submit="submit"  />
                    </div>

                    <button class="button button-second text-medium" @click="cancel" v-show="showCancelButton" >Cancelar</button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
import buttonSubmit from "./buttonSubmit.vue"
import popupOptions from '@/components/popup-options.vue';

import { useStore } from "./store"
import { storeToRefs } from "pinia"
import { useRoute, useRouter } from "vue-router"
import { notify } from "@kyvg/vue3-notification";
import axios from "@/services/api"
import _ from "lodash"
import { ref, computed } from 'vue'
import { useStore as useStoreUploader } from "@/store/uploader" 
import { isFile } from "@/Utils/index.js"
import Rules from "./Rules.js"

export default {
    name: "form-page",
    emits: ["has-offline", "loaded"],
    components: { buttonSubmit, popupOptions },
    props: {
        title: {
            type: String,
            required: false,
            default: "Voltar"
        },
        linkBack: {
            type: String,
            required: false
        },
        maxWidth: {
            type: String,
            required: false,
            default: "1000px"
        },
        footer: {
            type: Boolean,
            required: false,
            default: () => true,
        },
        config: {
            type: Object,
            required: true,
            default: () => {}
        }
    },
    setup(props, { emit }){
        const store = useStore();

        const uploader = useStoreUploader();
        const $route = useRoute();
        const $router = useRouter()
        const { isLoading, errorMsg, showSaveButton, showEditButton, showCancelButton } = storeToRefs(store);
        const selected = ref("Salvar");
        const popupLoading = ref(false);

        const permissions = computed(() => {
            const { moduleName } = $route.meta
            return {
                create: moduleName ? moduleName.filter( mName => mName.startsWith("create")) : undefined,
                edit: moduleName ? moduleName.filter( mName => mName.startsWith("edit")) : undefined,
                delete: moduleName ? moduleName.filter( mName => mName.startsWith("delete")) : undefined,
            }
        })

        const { previous, forceBack } = $route.query;

        const showFooter = computed(() => {
            return props.footer && !store.data.deleted_at
        })

        ;(() => {
            if(store.state.length){
                const last = store.state[store.state.length - 1]
                if(last.pageName === $route.name){
                    Object.entries(last).forEach(([ key, value ]) => {
                        store.form[key] = value
                    })

                    store.state.pop()
                }
            }

            if(forceBack)
                selected.value = "Salvar e voltar"

            const { id } = $route.params;
            if(id){
                fetch()
                store.options.edit_mode = false
            }else{
                store.options.edit_mode = true
        }
        })()

      
        async function fetch(){
            store.isLoading = true;
            store.errorMsg = ""
            try {
                const { data } = await axios.get(props.config.urls.fetch.replace("?", $route.params.id))
                store.data = JSON.parse(JSON.stringify(data));

                Object.entries(data).forEach(([ key, value ]) => {
                    store.form[key] = value
                })

                emit("loaded")
            } catch (error) {
                store.errorMsg = error                
            } finally {
                store.isLoading = false
            }
        }
        
        async function submit(){
            const online = navigator.onLine;
            if(!online){
                notify({
                    title: "Você está offline!",
                    type: "warn",
                    duration: 5000
                })
                return emit("has-offline");
            }
            store.errors = {}
            store.errorMsg = "";

            if(props.config.rules)
                store.errors = Rules(store.form, props.config.rules)
                
            if(Object.entries(store.errors).length)
                return notify({
                    title: "Campos obrigatórios não preenchidos!!",
                    type: "warn",
                    duration: 5000
                })
            
            store.isLoading = true;

            try {
                if(store.hasData){
                    const alterations = _.differenceWith(Object.entries({ ...store.form }), Object.entries({ ...store.data }),  _.isEqual);

                    if(!alterations.length)
                        return notify({
                            title: "Nenhuma alteração foi feita!!",
                            type: "warn",
                            duration: 5000
                        })
                    const body = {
                        id: store.data.id
                    }
                    if(selected.value === "Editar em todos")
                        body['edit_all'] = true;
                        
                    // edit_all é usado para editar todos os registros que possue um grupo

                    alterations.forEach(([ key, value ]) => {
                        body[key] = value
                    })

                    delete body.attachments;
                    await axios.put(props.config.urls.edit, body );
                    await uploadAttachments(store.data.id)
                    store.options.edit_mode = false
                    notify({
                        title: "Editado com sucesso!!",
                        type: "success",
                        duration: 5000
                    })
                }else{
                    const { data } = await axios.post(props.config.urls.create, store.form);
                    await uploadAttachments(data.id)

                    notify({
                        title: "Criado com sucesso!!",
                        type: "success",
                        duration: 5000
                    })

                    if(selected.value === "Salvar"){
                        $router.replace({ name: $route.name, params: { id: data.id }, query: $route.query })
                        store.options.edit_mode = false;
                        store.data = JSON.parse(JSON.stringify(data));
                        Object.entries(data).forEach(([ key, value ]) => {
                            store.form[key] = value
                        });
                    }

                    if(selected.value === "Salvar e continuar"){
                        if(store.fn)
                            store.fn();
                        store.resetState();
                    }

                    if(selected.value === "Salvar e voltar"){
                        goBack()
                    }
                }
            } catch (error) {
                console.error(error)
                notify({
                    title: "Ocorreu um problema, tente novamente!",
                    type: "error",
                    duration: 5000
                })
            } finally {
                store.isLoading = false;
            }
        }

        async function handleDelete(hide){
            popupLoading.value = true
            try{
                await axios.delete(`${ props.config.urls.delete }/${ store.data.id }`)
                notify({
                    title: "Excluido com sucesso!",
                    type: "success",
                    duration: 5000
                })
                hide()
                setTimeout(() => {
                    goBack()
                }, 100);
            } catch{
                notify({
                    title: "Erro ao excluir!",
                    type: "error",
                    duration: 5000
                })
            } finally {
                popupLoading.value = false
            }
        }

        function uploadAttachments(form_id){
            return new Promise( resolve => {
                if(!store.form.attachments || !Array.isArray(store.form.attachments))
                    return resolve();

                const reqHeaders = {
                    ...props.config.reqHeaders,
                    reference_value: form_id
                };
                uploader.push(store.form.attachments, reqHeaders)

                store.form.attachments = store.form.attachments.filter( evtFile => {
                    if(!isFile(evtFile)) return evtFile
                })

                resolve()
            })
        }

        function edit(){
            store.options.edit_mode = true
        }

        function cancel(){
            store.resetForm()
            store.options.edit_mode = false
        }

        function goBack(){
            $router.replace(previous || props.linkBack)
        }

        return {
            // computed
            permissions,
            // 
            store,
            isLoading,
            errorMsg,
            showEditButton,
            showSaveButton,
            showCancelButton,
            selected,
            popupLoading,
            showFooter,
            // methods
            fetch,
            submit,
            edit,
            cancel,
            goBack,
            handleDelete,
        }
    }
}
</script>
<style lang="less" scoped>
     .container-alert{
        width: 100%;
        height: auto;
        background-color: #fde52f;
        padding: 10px;
        font-size: 1.7em;
        margin-bottom: 24px;
        border-radius: 5px;
        span{
            font-size: 1em;
            color: #5f5404;
        }
    }
</style>
<style lang="less" scoped >
    
    .form-page{
        background-color: #e6e6e6;

        display: grid;
        grid-template-areas: "header" "body" "footer";
        grid-template-columns: 100%;
        grid-template-rows: 56px calc(100vh - 55px - 64px) 64px;
    }  

    .not-footer{
        grid-template-areas: "header" "body";
        grid-template-rows: 56px calc(100vh - 55px);
    }
    
    .header{
        grid-area: header;
        position: relative;
        width: 100%;
        height: 56px;
        border-bottom: solid 1px #d7d7d7;
        background-color: #fff;
    }

    .content-header{
        width: 100%;
        max-width: 1000px;
        height: 100%;
        margin: 0 auto;

        display: grid;
        grid-template-areas: "back popup";
        grid-template-columns: 1fr 30px;
        column-gap: 16px;
      
        & > *{
            align-self: center;
        }

        position: relative
    }
  
    .button-back{
        grid-area: back;
		width: 100%;
		height: auto;
        border: none;
        background-color: #fff;
        transition: 150ms;

        margin-right: 8px;

        display: flex;
        align-items: center;
        column-gap: 10px;
        cursor: pointer;
        
        &>svg{
            width: 30px;
            height: 30px;
        }
	}

    .title{
        overflow: hidden;
        p{
            white-space: nowrap;
            font-size: 2em;
            font-weight: bold;
        }
    }

    .popup-options{
        grid-area: popup
    }

    .body{
        grid-area: body;
        width: 100%;
        height: 100;
        // height: calc(100vh - 56px);
        padding: 20px;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
    }
    .content-body{
        max-width: 1000px;
        margin: 0 auto;
        min-height: 100%;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        position: relative;
    }
    .footer{
        grid-area: footer;
        width: 100%;
        height: 64px;
        background-color: #fff;
        border-top: solid 1px #d7d7d7;
        padding: 0 20px;
    }
    .content-footer{
        width: 100%;
        max-width: 1000px;
        height: 100%;

        margin: 0 auto;

        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row-reverse;
    }
    .button{
        width: auto;
        height: 40px;
        padding: 0 16px;
    }

    

    @media screen and (max-width:1000px) {
        .content-header{
            padding:0 10px;
        }
        .body, .content-body, .footer{
            padding: 14px;
        }
    }
</style>
