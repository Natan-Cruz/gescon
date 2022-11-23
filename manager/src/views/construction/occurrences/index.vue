<template>
    <div style="height: 100%; padding-top: 20px;">
        <div class="ctn-scroll-x">
            <div class="grid-orders">
                <!-- NOVAS OCORRÊNCIAS  -->
                <column-occurrences 
                    title="Novas ocorrências" 
                    :routeApi="urls.newOccurrences" 
                    @select-item="selectItem"
                    @push-new-column="pushInPending" />

                <!-- PENDENTES -->
                <column-occurrences 
                    ref="pedding"
                    title="Pendentes" 
                    :routeApi="urls.pendingOccurrences" 
                    @select-item="selectItem" 
                    @push-new-column="pushInProgress"/>

                <!-- EM PROGRESSO -->
                <column-occurrences 
                    ref="inProgress"
                    title="Em progresso" 
                    :routeApi="urls.occurrencesInProgress" 
                    @select-item="selectItem" 
                    @push-new-column="pushInResolved"/>

                <!-- CONCLUIDAS -->
                <column-occurrences 
                    ref="resolved"
                    title="Esperando aprovação" 
                    :routeApi="urls.resolvedOccurrences" 
                    @select-item="selectItem" />
            </div>
        </div>

        <button-circle @click="selectItem()"/>
    </div>
</template>

<script>
import columnOccurrences from "./gridOrders/columnOccurrences.vue"
import buttonCircle from "@/components/buttons/buttonCircle.vue"

import { useRoute, useRouter } from "vue-router"
import { computed, ref } from 'vue'
// MODAL

export default {
    name: "grid-orders",
    components:{
        columnOccurrences,
        buttonCircle
    },
    setup(){
        const $route = useRoute()
        const $router = useRouter();

        const pedding = ref(null)
        const inProgress = ref(null)
        const resolved = ref(null)

        const urls = computed(() => {
            const constructionID = $route.params.constructionID;
            return {
                newOccurrences: `/constructions/${ constructionID }/occurrences?status[]=1&status[]=2`,
                pendingOccurrences: `/constructions/${ constructionID }/occurrences?status[]=3&status[]=4`,
                occurrencesInProgress: `/constructions/${ constructionID }/occurrences?status=5`,
                resolvedOccurrences: `/constructions/${ constructionID }/occurrences?status=6`
            }
        })
        
        function selectItem(occurrenceId){
            $router.push({ 
                name: 'construction/form_occurrence',
                params: {
                    id: occurrenceId
                },
                query: { 
                    previous: $route.fullPath 
                }
            })
        }

        function pushInPending(occurrence){
            pedding.value.pushOccurrence(occurrence)
        }
        function pushInProgress(occurrence){
            inProgress.value.pushOccurrence(occurrence)
        }
        function pushInResolved(occurrence){
            resolved.value.pushOccurrence(occurrence)
        }


        return {
            urls,
            pedding,
            inProgress,
            resolved,
            // 
            selectItem,
            pushInPending,
            pushInProgress,
            pushInResolved
        }
    }

}
</script>
<style lang="less" scoped>
    .ctn-scroll-x{
        width: 100%;
        height: 100%;
        overflow: auto hidden;
    }
    .grid-orders{
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-areas: 'ctn_01 ctn_02 ctn_03 ctn_04';
        grid-template-columns: repeat(4, minmax(320px, 25%));
        column-gap: 20px;
        grid-template-rows: 100%;
        position: relative;
        padding-bottom: 10px;
    }
    .ctn_new_orders{
        grid-area: ctn_01;
    }
    .ctn_order_accepted{
        grid-area: ctn_02
    }
    .ctn_grouped_orders{
        grid-area: ctn_03;
    }
    .ctn_dispatched_orders{
        grid-area: ctn_04;
    }

    // /* Para navegadores webkit (Chrome, Safari, Opera 15+): */

    // scroll bar em geral
    ::-webkit-scrollbar {
        height: 8px;
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
</style>