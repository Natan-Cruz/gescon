<template>
    <div class="main">
        <header-component 
            :name="state.data.name" 
            :path_name="state.data.path_name" 
            @event-back="toBack" 
            @event-refresh="fetchMaterialOrder" />

        <div class="body">
            <div class="content">
                <loading-or-error 
                    :isLoading="state.isLoading" 
                    :error="state.error" 
                    @event-retry="fetchMaterialOrder" 
                    @event-back="toBack">
                </loading-or-error>

                <content-component 
                    v-if="!state.isLoading && !state.error && state.data.id"
                    :data="state.data"
                    :attachments="state.attachments"
                    @submit="submit"
                    @updated-item-anotation="handleUpdateItemAnotation" >
                </content-component>
            </div>
        </div>
    </div>
</template>

<script>
import headerComponent from "./header.vue";
import contentComponent from "./content.vue";

import axios from "@/services/api"
import { reactive } from 'vue';
import { useRoute, useRouter } from "vue-router"
import { useStore as useStoreUploder } from "@/store/uploader"
import { isFile } from "@/Utils/index.js"
import { notify } from '@kyvg/vue3-notification';

export default {
    components: { headerComponent, contentComponent },
    setup(){
        const $route = useRoute();
        const $router = useRouter();
        const uploader = useStoreUploder()

        const state = reactive({ data: {}, isLoading: false, error: "", attachments: [] })

        fetchMaterialOrder()
      
        async function fetchMaterialOrder(){
            state.isLoading = true;
            state.error = "";
            state.data = {};

            const url = `/materials/receive-material-order/${ $route.params.id }`
            try {
                const { data } = await axios.get(url)
                const { attachments } = data;
                state.data = data;
                state.attachments = attachments;
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        async function submit(){
            state.isLoading = true;
            state.error = "";

            const url = "/materials/receive-material-order",
                body = {
                    id: state.data.id,
                    items: state.data.items.filter( itm => itm.new_anotation )
                }
            try {
                const { data } = await axios.post(url, body)

                state.data.delivered_in = data.delivered_in
                uploadAttachments($route.params.id)
                notify({
                    title: "Material recebido com sucesso!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                notify({
                    title: "Erro ao receber material!",
                    type: "error",
                    duration: 5000
                })
            } finally {
                state.isLoading = false;
            }
        }

        function toBack(){
            const { previous } = $route.query
            if(previous)
                $router.replace(previous)
            else
                $router.replace({ name: "construction/materials/orders" })
        }

        function uploadAttachments(form_id){
            return new Promise( resolve => {
                if(!state.attachments || !Array.isArray(state.attachments))
                    return resolve();

                uploader.push(state.attachments, {
                    fileFullPath: "",
                    newPathLtree: "",
                    rootPathLtree: `${ $route.params.constructionID }._PURMAT_`,
                    reference_table: "construction_scheme.material_order_attachments",
                    reference_key: "order_id",
                    reference_value: form_id
                })

                state.attachments = state.attachments.filter( evtFile => {
                    if(!isFile(evtFile)) return evtFile
                })

                resolve()
            })
        }

        function handleUpdateItemAnotation({ index, anotation }){
            const item = state.data.items[index];
            state.data.items.splice(index, 1, { ...item, new_anotation: anotation })
        }

        return {
            state,
            fetchMaterialOrder,
            toBack,
            submit,
            handleUpdateItemAnotation
        }
    }
}
</script>

<style lang="less" scoped>
    .main{
        width: 100%;
        height: 100vh;
        background-color: #fff;
        position: relative;
        overflow: hidden;
        border-radius: 10px;
    }

    .body{
        position: relative;
        height: calc(100% - 50px);
        overflow: hidden auto;
    }
    .content{
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
    }
</style>