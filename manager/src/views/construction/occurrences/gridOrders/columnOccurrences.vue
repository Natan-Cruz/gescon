<template>
    <div class="column-occurrences">
        <div class="header">
            <p class="title-header">{{ title }}</p>

            <button-refresh @click="fetchOccurrences" />
        </div>
        <div class="body">
            <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchOccurrences" />
            <ul class="content-body" @mousemove="handleMousemove" @mouseout="handleCancel">
                <template v-if="state.data.length">
                    <item-occurrence 
                        v-for="occurrence in state.data" 
                        :key="occurrence.id" 
                        :item="occurrence" 
                        @select-item="$emit('select-item', $event)"
                        @change-status-item="alterStatusOccurrence"
                        @delete-item="deleteOccurrence" />
                </template>
                <template v-else>
                    <li class="text-15" style="margin-top: 20px;text-align:center;" >Nenhuma ocorrência</li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
import buttonRefresh from "@/components/buttons/buttonRefresh.vue";
import itemOccurrence from "./itemOccurrence.vue";

import { reactive, watch, onBeforeUnmount } from 'vue';
import axios from '@/services/api';
import { notify } from '@kyvg/vue3-notification'

const INTERVAL_TIME = 1000 * 60; // 1 minuto

import dayjs from "dayjs"
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime).extend(updateLocale).updateLocale('en', {
    relativeTime: {
        future: "%s",
        past: "%s",
        s: 'Agora',
        m: "Há 1 min",
        mm: "Há %d min",
        h: "1 hora atrás",
        hh: "Há %d horas",
        d: "Há um dia",
        dd: "Há %d dias",
        M: "Há um mês",
        MM: "Há %d meses",
        y: "Há um ano",
        yy: "Há %d anos"
    }
})

export default {
    name: "column-occurrences",
    components: { buttonRefresh, itemOccurrence },
    props:{
        title:  String,
        routeApi: String,
        occurrences: Array,
        field:  String
    },
    setup(props, { emit, expose }){
        const state = reactive({
            error: "",
            isLoading: false,
            intervalID: undefined,
            data: []
        })
        let intervalID;

        function handleMousemove(evt){
            const item = evt.target.closest(".item-occurrence")
            // se não for item
            if(!item) return;

            // item já expandido
            if(item.clientHeight > 74) return

            const itemMargin = 14 + 14,
                contentDescription = item.querySelector('.content-description').clientHeight

            if(itemMargin + contentDescription < 70) return

            item.style.height =  itemMargin + contentDescription + "px"
        }
        function handleCancel(){
            const items = document.querySelectorAll('.item-occurrence')
            items.forEach( item => item.style.height = "70px")
        }
        async function fetchOccurrences(){
            state.isLoading = true;
            state.error = ""
            state.data = []

            try {
                const { data } = await axios.get(props.routeApi)
                state.data = data.map(formatDate)
            } catch (error) {
                state.error = error                
            } finally {
                state.isLoading = false
            }
        }

        function formatDate(occurrence){
            return {
                ...occurrence,
                created_at: dayjs(occurrence.createdAt).fromNow()
            }
        }

        async function pushOccurrence(occurrence){
            state.data.push(occurrence)
        }

        async function alterStatusOccurrence(occurrence){
            const url = `/constructions/occurrences/${ occurrence.id }/status`;

            try {
                await axios.post(url, { status_code: occurrence.status });
                notify({
                    title: "Status alterado com sucesso!",
                    type: "success",
                    duration: 500
                })
                state.data = state.data.filter( occ => occ.id !== occurrence.id )
                emit("push-new-column", occurrence)
            } catch (error) {
                notify({
                    title: "Erro ao alterar status!", 
                    type: "error",
                    duration: 5000
                })
                console.error(error)
            }
        }

        async function deleteOccurrence(occurrenceId){
            const url = `/constructions/occurrences/${ occurrenceId }`;
            try {
                await axios.delete(url);
                notify({
                    title: "Ocorrência deletada!", 
                    type: "success",
                    duration: 5000
                })
                state.data = state.data.filter( occurrence => occurrence.id !== occurrenceId )
            } catch (error) {
                notify({
                    title: "Erro ao deletar ocorrência!", 
                    type: "error",
                    duration: 5000
                })
                console.error(error)
            }
        }

        fetchOccurrences()
        intervalID = setInterval(fetchOccurrences, INTERVAL_TIME);
        watch(() => props.routeApi, fetchOccurrences)
        onBeforeUnmount(() => clearInterval(intervalID))
        expose({ pushOccurrence })

        return {
            state,
            // methods
            handleMousemove,
            handleCancel,
            fetchOccurrences,
            deleteOccurrence,
            alterStatusOccurrence
        }
    }
}
</script>

<style lang="less" scoped>
    .column-occurrences{
        width: 100%;
        height: 100%;
        border-radius: 10px;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 1px 1px 5px -2px rgba(0, 0, 0, .4);
        position: relative;
    }
    .header{
        width: 100%;
        height: 60px;

        background-color: #fff;
        box-shadow: 0 2px 6px -4px  rgba(0, 0, 0, .4);
        border-bottom: solid 1px rgb(211, 211, 211);
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        padding: 0 20px;

        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 100;
    }
    .title-header{
        font-size: 1.8em;
        line-height: 1em;
        color: #222;
        font-weight: bold;
    }
    // 
    .body{
        width: 100%;
        height: calc(100% - 60px);
        overflow: hidden auto;
    }
    .content-body{
        width: 90%;
        margin: 0 auto;
        padding-bottom: 80px;
    }


    // /* Para navegadores webkit (Chrome, Safari, Opera 15+): */

    // scroll bar em geral
    ::-webkit-scrollbar {
        width: 8px;
    }

    // fundo da scroll bar
    ::-webkit-scrollbar-track {
        background: rgb(235, 235, 235);
        border-radius: 10px;
    }

    // botao da scroll bar
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius:10px;
    }

    // O resto das propriedades disabilita por segunraça
    ::-webkit-scrollbar-button,
    ::-webkit-scrollbar-corner,
    ::-webkit-scrollbar-track-piece,
    ::-webkit-resizer {
        display: none;
    }

    .container-loading{
        z-index: 0;
    }
</style>