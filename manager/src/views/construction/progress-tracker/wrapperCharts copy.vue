<template>
    <div style="margin-bottom: 24px">
        <div class="header content" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))">
            <wrapper-input label="Local">
                <input-suggest-tree
                    url="/financial/cost-center"
                    :options="{ key: 'path', displayName: 'name'}"
                    placeholder="Selecione um local" v-model="filters.tree_structure_id"/>
            </wrapper-input>

            <wrapper-input label="Fornecedor">
                <input-suggest-list
                    url="/registrations/service-provider"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione um fornecedor" v-model="filters.entity_id"/>
            </wrapper-input>

            <wrapper-input label="Serviço">
                <input-suggest-list
                    url="/services/s-grouped"
                    :options="{ key: 'group_id', displayName: 'group_name'}"
                    placeholder="Selecione um serviço" v-model="filters.service_group_id"/>
            </wrapper-input>

            <wrapper-input :label="`${ betweenDates ? 'Entre datas' : 'Data' }:`" >
                <div v-if="betweenDates" class="form_row" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: 8px">
                    <input type="date" class="input" v-model="filters.dates[0]">
                    <input type="date" class="input" v-model="filters.dates[1]">
                </div>
                <div v-else style="margin-bottom: 8px">
                    <input type="date" class="input" v-model="filters.dates[0]">
                </div>
                <toggle v-model="betweenDates" label="Entre datas?"></toggle>
            </wrapper-input>

            <button class="button button-second text-medium" @click="$emit('remove', item.id)">Remover</button>
        </div>

        <div class="container-path_name" v-if="pathName">
            <p class="path_name"> {{ pathName }} </p>
        </div>

        <div class="content">
            <template v-if="state.isLoading"> 
                <div class="card" v-for="n in 3" :key="n">
                    <div class="display_flex">
                        <p class="skeleton-text" style="width: 120px; height: 17px; display: block"></p>
                        <p class="skeleton-text" style="width: 100px; height: 25px; display: block"></p>
                    </div>
                    <div class="display_flex_center skeleton-text" style="width: 100%; height: calc(100% - 46px); border-radius: 15px"></div>
                </div>
            </template>
                   
            <div class="card" v-show="!state.isLoading">
                <div class="display_flex">
                    <p class="title">Progresso</p>
                </div>
                <div class="chart-container" style="position: relative; height: 390px; width: 100%">
                    <canvas :id="`half-donnut-chart-${ item.id }`"></canvas>
                </div>
            </div>
            <div class="card" v-show="!state.isLoading">
                <div class="display_flex">
                    <p class="title">Taxa de produção</p>
                    <toggle label="Agrupar em unidades" v-model="grouped" :height="36"></toggle>
                </div>
                <div class="chart-container" style="position: relative; height: 390px; width: 100%">
                    <canvas :id="`production-rate-chart-${ item.id }`"></canvas>
                </div>
            </div>
            <div class="card" v-show="!state.isLoading">
                <div class="display_flex">
                    <p class="title">Trabalho completo acumulado</p>
                    <toggle label="Em porcentagem?" v-model="inPercentage" :height="36"></toggle>
                </div>
                <div class="chart-container" style="position: relative; height: 390px; width: 100%">
                    <canvas :id="`cumulative-work-chart-${ item.id }`"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import inputSuggestTree from "@/components/inputSuggest/inputSuggestTree.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import toggle from "@/components/toggle/toggle.vue"

import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import axios from "@/services/api";
import randomFlatColors from "random-flat-colors";

import { ChartCheckItems } from "./charts/checkItems"
import { ChartRateProduction } from "./charts/rateProduction"
import { ChartAccumulatedWork } from "./charts/accumulatedWork"

import { buildDataRateProduction } from "./group/rateProduction"
import { buildDataAccumulatedWork } from "./group/accumulatedWork"

export default {
    components: { inputSuggestTree, inputSuggestList, toggle },
    props: {
        construction_id: String,
        item: Object
    },
    setup(props, { emit }){
        const filters = reactive({})
        const state = reactive({})
        const { item } = toRefs(props)
        const colors = ref([])

        const grouped = ref(false);
        const inPercentage = ref(true);
        const betweenDates = ref(false)

        const chartCheckItems = new ChartCheckItems('half-donnut-chart-' + props.item.id)
        const chartRateProduction = new ChartRateProduction('production-rate-chart-' + props.item.id)
        const chartAccumulatedWork = new ChartAccumulatedWork('cumulative-work-chart-' + props.item.id)

        const pathName = computed(() => {
            if(!state.data) return ""
            if(!state.data.path_name) return ""

            return state.data.path_name.replace(/\//g, " > ")
        })

        filters.entity_id = item.value.entity_id || ""
        filters.service_group_id = item.value.service_group_id || ""
        filters.tree_structure_id = item.value.tree_structure_id || ""
        filters.dates = item.value.dates || []

        betweenDates.value = filters.dates.length === 2

        watch( filters , filters => {
            emit("edit", { item_id: props.item.id, alterations: filters })
            fetch()
        })

        watch(grouped, () => {
            defineDataRateProduction();
            defineDataAccumulatedWork()
        })

        watch(inPercentage, () => {
            defineDataAccumulatedWork();
        })

        onMounted(() => {
            initCharts()
            fetch();
        })

        function initCharts(){
            chartCheckItems.init()
            chartRateProduction.init()
            chartAccumulatedWork.init()
        }

        async function fetch(){
            state.isLoading = true;
            state.errorMsg = ""
            try {
                const url = `/progress-tracker/?construction_id=${ props.construction_id }&${ new URLSearchParams(filters).toString() }`
                const { data } = await axios.get(url)
                state.data = data;

                colors.value = data.productions.map(() => randomFlatColors())
                defineDataCheckItems()
                defineDataRateProduction()
                defineDataAccumulatedWork();
            } catch (error) {
                state.errorMsg = error
            } finally {
                state.isLoading = false
            }
        }


        function defineDataCheckItems(){
            chartCheckItems.render(state.data.check_items);
        }

        function defineDataRateProduction(){
            const { labels, data } = buildDataRateProduction(state.data.productions, grouped.value)
            chartRateProduction.render(
                labels,
                data,
                colors.value
            )
        }

        function defineDataAccumulatedWork(){
            const { labels, data } = buildDataAccumulatedWork(state.data.productions, grouped.value, inPercentage.value)

            chartAccumulatedWork.render(
                labels,
                data,
                colors.value,
                inPercentage.value
            )
        }

        return {
            grouped,
            inPercentage,
            betweenDates,
            pathName,
            filters,
            state,
            fetch
        }
    }
}
</script>

<style lang="less" scoped>
    .display_flex_center{
        height: calc(100% - 46px);
        display: flex;
        align-items: center;
        justify-content: center;

    }
</style>

<style lang="less" scoped>
    .header{
        background-color: #fff;
        border-radius: 5px;
        padding: 20px;

        margin-bottom: 24px;
    }

     .container-path_name{
        width: 100%;
    }
    .path_name{
        font-size: 1.7em;
        color: rgb(61, 61, 61);
        padding-bottom: 24px;
        text-align: justify;
    }

    .content{
        width: 100%;
        position: relative;

        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-template-rows: auto;
        gap: 20px;
    }
    .card{
        width: 100%;
        height: 470px;
        border-radius: 5px;
        background-color: #fff;
        padding: 20px;

        position: relative;
    }
    .display_flex{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 0 10px 0;
        margin-bottom: 10px;
        border-bottom: solid 1px gray;

        flex-wrap: wrap;
    }
    .title{
        font-size: 1.7em;
        line-height: 1em;
        font-weight: bold;
        white-space: nowrap;
        span {
            font-size: 1em;
        }
    }

    .button{
        width: 90px;
        height: 40px;
        align-self: flex-end;
    }
</style>