<template>
    <div>
        <ul class="list-info form_spacing_bottom">
            <li>
                <span class="key text-medium bold gray">Nome:</span>
                <span class="text-medium value gray">{{ item.name }}</span>
            </li>
            <li>
                <span class="key text-medium bold gray">Método de checagem:</span>
                <span class="text-medium value gray">{{ item.check_method }}</span>
            </li>
            <li>
                <span class="key text-medium bold gray">Descrição:</span>
                <span class="text-medium value gray">{{ item.description || 'Sem descrição'}}</span>
            </li>
            <template v-if="item.checked === false">
                <li>
                    <span class="key text-medium bold">Descrição do problema:</span>
                    <textarea-autosize :minHeight="120" placeholder="Descreva aqui o problema..." v-model="state.problem_description"/>
                </li>
                <li>
                    <span class="key text-medium bold">Ações corretivas:</span>
                    <textarea-autosize :minHeight="120" placeholder="Descreva aqui alguma anotação" v-model="state.corrective_actions"/>
                </li>
                <li>
                    <span class="key text-medium bold">Data de reinspeção:</span>
                    <input type="date" class="input" v-model="state.reinspection_date">
                </li>
            </template>
        </ul>

        <wrapper-attachments class="form_spacing_bottom" 
            v-model="state.attachments" 
            :id="$route.params.check_item_id"
            :disabled="disabled"/>

    
        <div class="wrapper-buttons">
            <template v-if="disabled">
                <button class="button button-primary text-medium" @click="disabled = false">Editar</button>
            </template>
            <template v-else>
                <button class="button button-second text-medium" @click="handleCancel">Cancelar</button>
                <button class="button button-primary text-medium" @click="handleSubmit">salvar</button>
            </template>
        </div>
    </div>

</template>

<script>
import wrapperAttachments from "@/components/wrapperAttachments/index.vue"

import { reactive, ref, computed } from 'vue';
import { useRoute } from 'vue-router'
import { isFile } from "@/Utils/index.js"
import { useStore as useStoreUploader } from "@/store/uploader"
import { useStore as useStoreService } from '../store';

export default {
    components: { wrapperAttachments },
    props: {
        data: Object
    },
    setup(props){
        const storeService = useStoreService()
        const uploader = useStoreUploader();
        const $route = useRoute();
        const disabled = ref(true)

        const state = reactive({ 
            problem_description: "", 
            corrective_actions: "", 
            reinspection_date: null,
            attachments: []
        })

        const data = computed(() => {
            const item = props.data.check_items.find( item => item.id === $route.params.check_item_id)
            return item
        })

        state.problem_description = data.value.problem_description
        state.corrective_actions = data.value.corrective_actions
        state.reinspection_date = data.value.reinspection_date
        state.attachments = data.value.attachments


        const reqHeaders = {
            fileFullPath: "",
            newPathLtree: "",
            rootPathLtree: `${ $route.params.constructionID }._SERVS_`,
            reference_table: "construction_scheme.service_check_item_attachments",
            reference_key: "service_check_item_id",
        }

        function handleCancel(){
            state.problem_description = data.value.problem_description
            state.corrective_actions = data.value.corrective_actions
            state.reinspection_date = data.value.reinspection_date
            state.attachments = data.value.attachments
            disabled.value = true;
        }

        function handleSubmit(){
            storeService.editCheckItem({ id: $route.params.check_item_id, ...state })
                .then(() => {
                    uploadAttachments($route.params.check_item_id)
                })
        }

        function uploadAttachments(form_id){
            return new Promise( resolve => {
                if(!state.attachments || !Array.isArray(state.attachments))
                    return resolve();

                uploader.push(state.attachments, {
                    ...reqHeaders, reference_value: form_id
                })

                state.attachments = state.attachments.filter( evtFile => {
                    if(!isFile(evtFile)) return evtFile
                })

                resolve()
            })
        }
      
        return {
            state,
            disabled,
            item: data,
            handleCancel,
            handleSubmit
        }
    }
}
</script>

<style lang="less" scoped>
    .list-info{
        li{
            border-bottom: dashed 1px gray;
            padding: 16px 0 ;
        }
        li:first-child{
            padding-top: 0;
        }
    }
    .key{
        color: rgb(44, 44, 44);
        display: block;
        margin-bottom: 12px;
    }

    .gray{
        color: rgb(73, 73, 73);
    }
</style>