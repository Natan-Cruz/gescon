<template>
    <div>
         <!-- path name -->
        <div class="container-path_name">
            <p class="path_name"> {{ path_name.replace(/\//g, " > ") }} </p>
        </div>

        <!-- actions -->
        <p class="sub-title" style="margin-bottom: 12px">Ações</p>
        <router-link :to="{ name: 'construction/form_occurrence', query: { previous: $route.fullPath, tree_structure_id: data.tree_structure_id }}" class="button-action btn-add-occurrence" style="width: 210px">Adicionar ocorrência</router-link>
        <button v-show="!data.start_date" class="button-action btn-start-service" @click="startService">Iniciar serviço</button>
        <button v-show="data.start_date && data.status !== 'paralyzed'" class="button-action btn-stop-service" @click="stopService">Paralizar serviço</button>
        <button v-show="data.start_date && data.status === 'paralyzed'" class="button-action btn-restart-service" @click="restartService">Reiniciar serviço</button>
        <button v-show="data.start_date && !data.end_date && data.status !== 'paralyzed'" class="button-action btn-conclude-service" @click="concludeService">Finalizar serviço</button>

        <!-- productions -->
        <p class="sub-title">Taxa de produção</p>
        <ul style="position: relative">
            <li class="line-detail" :style="isLoading && 'background-color: #ccc' " ref="line_detail"></li>
            <item-rate-production 
                v-for="(item, i) in data.productions.map(formatDate)" :key="i" 
                :item="item" 
                @click="$router.push({ name: 'constuction/service/production_rate', params: { rate_id: item.id }})"/>
        </ul>
        <li v-if="!data.productions.length" class="without-item">Nenhum item</li>
        <router-link :to="{ name: 'constuction/service/production_rate' }" class="button button-second text-medium" style="width: 175px; height: auto">Adicionar produção</router-link>

        <!-- items of verifications -->
        <p class="sub-title">Itens de verificação</p>
        <ul>
            <item v-for="( item, i ) in data.check_items" :key="i" :item="item" @select-item="$emit('select-item', $event)" @decline-check="handleDeclineCheck" >
                <attachments-for-items :attachments="item.attachments" :id="item.id" :reqHeaders="reqHeaders" />
            </item>
        </ul>
        <li v-if="!data.check_items.length" class="without-item">Nenhum item</li>
    </div>
</template>

<script>
import Item from '../components/item.vue';
import itemRateProduction from "../components/itemProductionRate.vue"
import attachmentsForItems from "@/components/wrapperAttachments/attachmentsForItems.vue"

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '../store';

import dayjs from 'dayjs';
import "dayjs/locale/pt-br"
dayjs.locale("pt-br")

export default {
    components: { Item, attachmentsForItems, itemRateProduction },
    props: {
        data: Object,
        path_name: String
    },
    setup(props){
        const storeService = useStore();
        const $route = useRoute();
        const line_detail = ref(null);

        onMounted(render);

        function render(){
            const balls = document.querySelectorAll(".ball-detail")
            if(!balls.length) return;

            const firstBall = balls[0], lastBall = balls[ balls.length - 1]
            const distanceBetweenBalls = lastBall.getBoundingClientRect().y - firstBall.getBoundingClientRect().y
            line_detail.value.style.height = distanceBetweenBalls + "px"
        }

        const reqHeaders = {
            fileFullPath: "",
            newPathLtree: "",
            rootPathLtree: `${ $route.params.constructionID }._SERVS_`,
            reference_table: "construction_scheme.service_check_item_attachments",
            reference_key: "service_check_item_id",
        }
        function startService(){
            storeService.editService({ 
                id: props.data.id,  
                start_date: dayjs().format("YYYY-MM-DD"),
                status: "initiated"
            })
        }
        function stopService(){
            storeService.editService({ 
                id: props.data.id,  
                status: "paralyzed"
            })
        }
        function restartService(){
            storeService.editService({ 
                id: props.data.id,  
                status: "restarted"
            })
        }
        function concludeService(){
            storeService.editService({ 
                id: props.data.id,
                end_date: dayjs().format("YYYY-MM-DD"),
                status: "concluded"
            })
        }

        function handleDeclineCheck({ id, checked }){
            storeService.editCheckOrUncheckItem(id, checked)
        }

        return {
            formatDate: item => ({ ...item, date: dayjs(item.date).format("DD/MM/YYYY [-] ddd") }),
            line_detail,
            reqHeaders,
            // methods
            startService,
            stopService,
            restartService,
            concludeService,
            handleDeclineCheck
        }
    }
}
</script>

<style lang="less" scoped>
    .container-path_name{
        width: 100%;
    }
    .path_name{
        font-size: 1.7em;
        color: rgb(61, 61, 61);
        text-align: justify;
        padding-bottom: 12px;
        border-bottom: dashed 1px gray;
    }

    .button-action{
        width: auto;
        height: auto;

        border: none;
        font-size: 1.9em;
        border-radius: 5px;
        padding: 12px;
        font-weight: bold;
        color: #fff;
        display: block;

        margin-bottom: 12px;

    }

    .btn-add-occurrence{
        background-color: #EEA800;
    }
    .btn-start-service{
        background-color: #4DA9DC;
    }
    .btn-stop-service{
        background-color: #FF2E2E;
    }
    .btn-restart-service{
        background-color: #38AEE6;
    }
    .btn-conclude-service{
        background-color: #73D393;
    }

    .ctn{
        position: relative;
    }
    .line-detail{
        display:block;
        width: 2px;
        height: 100%;
        background-color: #f70;
        position: absolute;
        left: 5px;
        top: 10px;
    }
    .button{
        margin-top: 26px;

        padding: 10px;
    }
</style>