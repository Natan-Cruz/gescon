<template>
    <expandable-content title="Ações" :defaultOpen="true">     
            <!-- ERROR -->
        <div class="container-error" v-if="errorMsg">
            <p class="error">{{ errorMsg }}</p>
        </div>
        <div class="wrapper">
            <button class="button-action" @click="alterStatusOccurrence(4)" v-show="currentStatus.status_code < 3">Marcar como "Pendente"</button>
            <button class="button-action" @click="alterStatusOccurrence(STATUS_IN_PROGRESS)" v-show="currentStatus.status_code < 5">Marcar como "Em progresso"</button>
            <button class="button-action" @click="alterStatusOccurrence(STATUS_COMPLETED_BY_CONSTRUCTION_COMPANY)" >Finalizar ocorrência</button>
            <button class="button-action btn-delete-report" @click="deleteOccurrence">Deletar ocorrência</button>
        </div>
    </expandable-content>
</template>

<script>
import expandableContent from "../../expandableContent.vue"

import { notify } from "@kyvg/vue3-notification";
import { computed, ref } from 'vue';
import axios from "@/services/api"
import { useRoute, useRouter } from 'vue-router';

export default {
    name: "wrapper-actions",
    components: { expandableContent },
    props: {
        status: Array,
        disabled: Boolean
    },
    setup(props){
        const errorMsg = ref("")
        const $route = useRoute()
        const $router = useRouter()

        const { constructionID, id:occurrenceID } = $route.params;

        const STATUS_IN_PROGRESS = 5
        const STATUS_COMPLETED_BY_CONSTRUCTION_COMPANY = 7

        const currentStatus = computed(() => {
            if(props.status && props.status.length)
                return Object.assign([], props.status).pop()
            else
                return undefined
        })

        async function alterStatusOccurrence(statusCode){
            errorMsg.value = "";
            const url = `/constructions/occurrences/${ occurrenceID }/status`;

            try {
                await axios.post(url, { status_code: statusCode });
                notify({
                    title: "Alterado com sucesso!",
                    type: "success",
                    duration: 500
                })
            } catch (error) {
                errorMsg.value = "Ocorreu um problema, por favor tente novamente"
            }
        }
        
        async function deleteOccurrence(){
            errorMsg.value = "";

            const url = `/constructions/occurrences/${ occurrenceID }`;

            try {
                await axios.delete(url);
                // this.$store.commit("occurrences/REMOVE_OCCURRENCE", {
                //     occurrenceID: this.$route.query.occurrenceID
                // })
                notify({
                    title: "Ocorrência deletada!", 
                    type: "success",
                    duration: 5000
                })
                $router.replace({ name: "construction/occurrences", params: { constructionID }})
            } catch (error) {
                errorMsg.value = "Ocorreu um problema, por favor tente novamente"
            }
        }

        return {
            currentStatus,
            STATUS_IN_PROGRESS,
            STATUS_COMPLETED_BY_CONSTRUCTION_COMPANY,
            errorMsg,
            alterStatusOccurrence,
            deleteOccurrence
        }
    }
}
</script>

<style lang="less" scoped>
    .button-action{
        width: auto;
        height: auto;
        background-color: #189AB4;
        border: none;
        border-radius: 5px;
        padding: 6px 10px;
        font-size: 1.8em;
        font-weight: bold;
        color: #fff;
        margin-bottom: 12px;
        display: block;
        cursor: pointer;
        transition: 100ms;
        &:last-child{
            margin-bottom: 0;
        }

        &:active{
            transform: scale(.8);
        }
    }

    .btn-delete-report{
        background-color: #C70000;
    }

    .container-error{
        width: 100%;
        height: auto;
        background-color: #FF9494;
        padding: 10px;
        margin-bottom: 20px;
        .error{
            font-size: 1.7em;
            color: #6b081c
        }
    }
</style>