<template>
    <li class="item">
        <!-- services informations -->
        <div class="ctn-service-informations" @click="$emit('select-service', activity.id)">
            <p class="text bold margin_bottom">{{ activity.name }}</p>
            <p class="text_2 margin_bottom">{{ activity.entity_name }}</p>
            <div class="display_flex margin_bottom">
                <div>
                    <span class="bold">Planejado: </span>                    
                    <span style="white-space: nowrap" v-if="(activity.expected_start_date || activity.expected_end_date)">{{ formatDate(activity.expected_start_date) || "--"  }} à {{ formatDate(activity.expected_end_date) || "--"}}</span>
                    <span  v-else>Não especificada</span>
                </div>
                <div>
                    <span class="bold">Realizado: </span>                    
                    <span style="white-space: nowrap" v-if="(activity.start_date || activity.end_date)">{{ formatDate(activity.start_date) || "--" }} à {{ formatDate(activity.end_date) || "--" }}</span>
                    <span  v-else>Não especificada</span>
                </div>
            </div>
            <p class="text_2">{{ state.pathName.replace(/\//g, " > ") }}</p>
        </div>

        <!-- is loading -->
        <div class="container-loading" v-if="state.isLoading">
            <spinner-loading :loading="state.isLoading"></spinner-loading>
        </div>

        <!-- last productions -->
        <template v-if="activity.productions && activity.productions.length">
            <p class="sub-title">Últimas produções</p>

            <ul>
               <slot name="last-productions" :data="lastProductions"/>
            </ul>

            <button v-show="showButtonShowMore" class="button button-tertiary text-medium button-show-more" @click="state.showMore = !state.showMore">Mostrar {{ state.showMore ? "menos" : "mais" }}</button>
        </template>

        <!-- add production -->
        <p class="sub-title">Adicionar produção</p>

        <slot name="form" :data="state.productions" :handleEdit="handleEdit"></slot>

        <div class="wrapper-buttons">
            <button class="button-add" @click="handleAdd">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M9.125 15.833V10.875H4.167V9.125H9.125V4.167H10.875V9.125H15.833V10.875H10.875V15.833Z"/></svg>
                <span>Adicionar</span>
            </button>

            <button v-show="showButton" class="button button-primary text-medium button-save" @click="handleSubmit">Salvar</button>
        </div>
    </li>
</template>

<script>
import { computed, reactive } from 'vue'
import axios from "@/services/api"
import { notify } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday'
import { formatDate } from "@/Utils/index.js"
dayjs.extend(isToday)

export default {
    name: "item-activity",
    props:{
        activity: Object
    },
    setup(props, { emit }){
        const state = reactive({ isLoading: false, pathName: "", showMore: false, productions: [] })
        const showButton = computed(() => state.productions.length > 0 )
        const showButtonShowMore = computed(() => {
            return props.activity.productions.findIndex( production => dayjs(production.date).isToday() ) > -1
        })
        const lastProductions = computed(() => {
            if(state.showMore)
                return props.activity.productions
            else
                return props.activity.productions.filter( production => {
                    if(dayjs(production.date).isToday()) return production
                })
        })

        getServicePathName();

        async function getServicePathName(){
            const { data } = await axios.get("/financial/cost-center/full-path/" + props.activity.path )  
            state.pathName = data
        }

        async function handleSubmit(){
            state.isLoading = true;
            try {
                const { data } = await axios.post("/services/production-rate", state.productions)
                emit("add-in-productions", data)
                state.productions = []
                notify({
                    title: "Produção adicionada com sucesso!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                console.error(error)
                notify({
                    title: "Erro ao tentar salvar",
                    type: "error",
                    duration: 5000
                })
            } finally {
                state.isLoading = false;
            }
        }

        function handleAdd(){
            state.productions.push({
                service_id: props.activity.id,
                value: 0,
                allocated_labor: 0,
                date: dayjs().format("YYYY-MM-DD")
            })
        }


        function handleEdit({index, item}){
            state.productions.splice(index, 1, item)
        }

        return {
            state,
            showButton,
            lastProductions,
            showButtonShowMore,
            // methods
            handleSubmit,
            handleAdd,
            handleEdit,
            formatDate
        }
    }
}
</script>
<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        border-radius: 5px;
        padding: 10px;
        border: solid 1px gray;

        position: relative;
        margin-bottom: 16px;
    }
    .ctn-service-informations{
        width: 100%;
        &:hover{
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .margin_bottom{
        margin-bottom: 6px;
    }
    .text{
        font-size: 1.8em;
    }
    .text_2{
        font-size: 1.5em;
        line-height: 1em;
        color: rgb(82, 82, 82);
    }
    .display_flex{
        flex-wrap: wrap;
        display: flex;
        row-gap: 4px;
        column-gap: 16px;

        span{
            font-size: 1.4em;
            color: rgb(56, 56, 56);
        }
    }

    .sub-title{
        font-size: 1.7em;
        font-weight: bold;
        // display: none;
        padding-top: 6px;
        margin-top: 12px;
        margin-bottom: 4px;
        border-top: dashed 1px gray;
        color: rgb(75, 75, 75);
    }

    .button-show-more{
        margin: 0 auto;
        height: auto;
    }
    @media screen and (min-width: 500px) {
        .button-show-more{
            margin: 0;
        }
    }

    .wrapper-buttons{
        // max-width igual ao item-production
        max-width: 380px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-top: 12px;
    }
    .button-add{
        width: 120px;
        height: 36px;

        font-size: 1.6em;
        border-radius: 16px;

        display: flex;
        align-items: center;
        justify-content: center;
        column-gap: 6px;
        border: solid 1px rgb(179, 179, 179);
        cursor: pointer;

        &:active{
            transform: scale(.8);
        }

        span{
            font-size: 1em;
        }
    }

    .button-save{
        width: auto;
        height: 36px;

        padding: 0 10px;
    }
</style>
