<template>
    <div style="margin-bottom: 24px">
        <div class="content">
            <card title="Taxa de produção" :on_blur="!data.productions || !data.productions.length">
                <template v-slot:toggle>
                    <toggle label="Agrupar em unidades" v-model="grouped" :height="36" />
                </template>
                <div class="chart-container" style="position: relative; height: 390px; width: 100%">
                    <canvas id="production-rate-chart"></canvas>
                </div>
            </card>

            <card title="Trabalho completo acumulado" :on_blur="!data.productions || !data.productions.length">
                <template v-slot:toggle>
                    <toggle label="Em porcentagem?" v-model="inPercentage" :height="36" />
                </template>
                <div class="chart-container" style="position: relative; height: 390px; width: 100%">
                    <canvas id="cumulative-work-chart"></canvas>
                </div>
            </card>

            <card title="Materiais entregues">
                <div class="chart-container" style="position: relative; height: 390px; width: 100%">
                    <canvas id="materials-delivered-chart"></canvas>
                </div>
            </card>

            <card title="Materiais entregues acumulado">
                <div class="chart-container" style="position: relative; height: 390px; width: 100%">
                    <canvas id="materials-delivered-accumulated-chart"></canvas>
                </div>
            </card>

            <card title="Mão de obra">
                <div class="chart-container" style="position: relative; height: 390px; width: 100%">
                    <canvas id="manpower-chart"></canvas>
                </div>
            </card>

            <!-- <card>
                 <div class="display_flex">
                    <p class="title">Progresso</p>
                </div>
                <div class="chart-container" style="position: relative; height: 390px; width: 100%">
                    <canvas :id="`half-donnut-chart-${ item.id }`"></canvas>
                </div>
            </card> -->
        </div>
    </div>
</template>

<script>
import card from "./components/card.vue"
import toggle from "@/components/toggle/toggle.vue"

import { onMounted, ref, watch } from 'vue'
import randomFlatColors from "random-flat-colors";

import { ChartRateProduction } from "./charts/rateProduction"
import { ChartAccumulatedWork } from "./charts/accumulatedWork"
import { ChartMaterialsDelivered } from "./charts/materialsDelivered"

import { buildDataRateProduction } from "./group/rateProduction"
import { buildDataAccumulatedWork } from "./group/accumulatedWork"
import { buildDataMaterialsDelivered } from "./group/materialsDelivered"

export default {
    components: { card, toggle },
    props: {
        construction_id: String,
        data: Object
    },
    setup(props){
        const colors = ref([])

        const grouped = ref(false);
        const inPercentage = ref(true);
        const betweenDates = ref(false)

        const chartRateProduction = new ChartRateProduction('production-rate-chart')
        const chartAccumulatedWork = new ChartAccumulatedWork('cumulative-work-chart')
        const chartMaterialsDelivered = new ChartMaterialsDelivered('materials-delivered-chart')

        watch(grouped, () => {
            defineDataRateProduction();
            defineDataAccumulatedWork()
        })

        watch(inPercentage, () => {
            defineDataAccumulatedWork();
        })

        onMounted(() => {
            initCharts();
            
            if(Object.entries(props.data).length){
                colors.value = props.data.productions.map(() => randomFlatColors())
                defineDataRateProduction();
                defineDataAccumulatedWork()
                defineDataMaterialsDelivered()
            }
        })

        watch(() => props.data, () => {
            if(Object.entries(props.data).length){
                colors.value = props.data.productions.map(() => randomFlatColors())
                defineDataRateProduction();
                defineDataAccumulatedWork()
                defineDataMaterialsDelivered()
            }
        })

        function initCharts(){
            chartRateProduction.init()
            chartAccumulatedWork.init()
            chartMaterialsDelivered.init()
        }

        function defineDataRateProduction(){
            const { labels, data } = buildDataRateProduction(props.data.productions, grouped.value)
            chartRateProduction.render(
                labels,
                data,
                colors.value
            )
        }

        function defineDataAccumulatedWork(){
            const { labels, data } = buildDataAccumulatedWork(props.data.productions, grouped.value, inPercentage.value)

            chartAccumulatedWork.render(
                labels,
                data,
                colors.value,
                inPercentage.value
            )
        }

        function defineDataMaterialsDelivered(){
            const { labels, data } = buildDataMaterialsDelivered(props.data.materials, true)
            chartMaterialsDelivered.render(
                labels,
                data,
                colors.value,
            )
        }

        return {
            grouped,
            inPercentage,
            betweenDates
        }
    }
}
</script>
<style lang="less" scoped>
    .content{
        width: 100%;
        position: relative;

        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(700px, 1fr));
        grid-template-rows: auto;
        gap: 20px;
    }
</style>