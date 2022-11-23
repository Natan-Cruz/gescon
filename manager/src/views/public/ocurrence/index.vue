<template>
    <div>
        <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchOccurrence" />

        <template v-if="state.has_occurrence">
            <div class="sub-header">
                <div class="row">
                    <h2 class="header-title">#{{ state.occurrence.id }}</h2>
                </div>
                <div class="row">
                    <p class="text-medium">{{ state.occurrence.construction_name }}</p>
                    <p class="text-medium">{{ state.occurrence.construction_company_name }}</p>
                </div>
            
                <button class="button-refresh" @click="fetchOccurrence">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 20q-3.35 0-5.675-2.325Q4 15.35 4 12q0-3.35 2.325-5.675Q8.65 4 12 4q1.725 0 3.3.713 1.575.712 2.7 2.037V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2Q13.625 6 12 6 9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325Q14.75 20 12 20Z"/></svg>
                </button>
            </div>
          
            <div class="content">
                <global-wrapper label="Titulo">
                    <p class="title">{{ state.occurrence.title }}</p>
                </global-wrapper>

                <global-wrapper label="Descrição">
                    <p class="message">{{ state.occurrence.description }}</p>
                </global-wrapper>

                <global-wrapper label="Dados meterológicos">
                    <p class="message">{{ state.occurrence.weather_data || 'Não definido' }}</p>
                </global-wrapper>

                <global-wrapper label="Gravidade da ocorrência">
                    <severity-component :severity="state.occurrence.severity"/>
                </global-wrapper>

                <wrapper-attachments
                    class="form_spacing_bottom"
                    :attachments="state.occurrence.attachments" 
                    @update-attachments="handleUploadAttachment" :id="$route.params.id"/>

                <global-wrapper label="Ações" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0">
                    <actions-component :status="state.occurrence.status"  @change-status="handleChangeStatus"/>
                </global-wrapper>
            </div>
        </template>
    </div>
</template>

<script>
import globalWrapper from "../wrapper.vue";

import severityComponent from "./components/severityComponent.vue"
import actionsComponent from "./components/actionsComponent.vue"
import wrapperAttachments from "@/components/wrapperAttachments/index.vue"

import axios from "@/services/api"
import { useRoute } from "vue-router"
import { reactive } from 'vue';
import { notify } from '@kyvg/vue3-notification';
import { useStore as useStoreUploder } from "@/store/uploader"
import { isFile } from "@/Utils/index.js"

export default {
    components:{
        globalWrapper,
        // 
        severityComponent,
        actionsComponent,
        wrapperAttachments
    },
    setup(){
        const $route = useRoute();
        const state = reactive({ isLoading: false, error: "", occurrence: {}, has_occurrence: false })
        const uploader = useStoreUploder()

        async function fetchOccurrence(){
            state.isLoading = true;
            state.error = "";
            state.occurrence = {}
            state.has_occurrence = false;

            const url = `/constructions/occurrences-public?occurrence_id=${ $route.query.occurrence_id }&contact_id=${ $route.query.contact_id }`;

            try {
                const { data } = await axios.get(url)
                state.occurrence = data;
                state.has_occurrence = true;
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        fetchOccurrence();

        async function handleChangeStatus(statusCode){
            state.error = "" 
            state.isLoading = true;

            const url = `/constructions/occurrences/${ $route.query.occurrence_id }/status`;
            try {
                const { data } = await axios.post(url, { status_code: statusCode });
                state.occurrence.status.push(data)
                notify({
                    title: "Alterado com sucesso!",
                    type: "success",
                    duration: 500
                })
            } catch (error) {
                state.error = "Ocorreu um problema, por favor tente novamente"
            } finally {
                state.isLoading = false
            }
        }   

        function handleUploadAttachment(attachments){
            if(!attachments || !Array.isArray(attachments))
                return;

            uploader.push(attachments, {
                fileFullPath: "",
                newPathLtree: "",
                rootPathLtree: `${ state.occurrence.construction_id }._OCCR_`,
                reference_table: "construction_scheme.occurrence_attachments",
                reference_key: "occurrence_id",
                reference_value: state.occurrence.id
            })

            state.occurrence.attachments = attachments.filter( evtFile => {
                if(!isFile(evtFile)) return evtFile
            })
        }

        return {
            state,
            // methods
            fetchOccurrence,
            handleChangeStatus,
            handleUploadAttachment
        }

    }
}
</script>

<style lang="less" scoped src="../style.less"></style>
<style lang="less" scoped>
    .title{
        font-size: 2em;
        font-weight: bold;
    }
    .message{
        font-size: 1.6em;
        color: rgb(80, 80, 80);
    }
    .list-attachments{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        grid-template-rows: auto;
        row-gap: 12px;
        column-gap: 12px;


        & > :deep(.item-attachment){
            height: 140px;
        }
    }
</style>