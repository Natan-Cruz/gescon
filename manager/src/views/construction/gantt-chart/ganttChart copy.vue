<template>
    <div class="gantt-chart">
        <div class="header_1"></div>
        <div class="header_2"></div>
        <div class="content_left">
            <item-service v-for="(service, i) in services" :key="i" :item="service" />

            <select class="select" v-model="state.frequency" @change="handleResize">
                <option value="day">Diário</option>
                <option value="week">Semanal</option>
                <option value="month">Mensal</option>
                <!-- <option value="quarterly">Trimestral</option>
                <option value="semiannual">Semestral</option> -->
                <option value="year">Anual</option>
            </select>
            <p>Diff: {{ state }}</p>
            <p>chart_collumn_width {{ chart_column_width }}</p>
        </div>
        <div class="content_right">
            <div class="container-canvas">
                <div style="position: relative; height: 100%" :style="{ width: state.chart_width + 'px' }">
                    <date-header
                        :chart_start_date="start_date"
                        :chart_end_date="end_date"
                        :chart_collumn_width="chart_column_width"
                        :chart_frequency="state.frequency" />


                <span class="background-lines" v-for="n in state.steps" :key="n" :style="{ left: (n* chart_column_width)  + 'px' }"></span>

                <item-bar v-for="(service, i) in services" :key="i" 
                    :item="service"
                    :chart_start_date="start_date"
                    :chart_end_date="end_date"
                    :chart_collumn_width="chart_column_width"
                    :chart_frequency="state.frequency" />

                </div>
            </div>

            <!-- tooltips -->
            <zoom v-model="state.zoom" @update:modelValue="handleResize"/>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import ItemBar from './components/itemBar.vue'
import itemService from "./components/itemService.vue"
import { getMeasures } from "./utils"
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import bigDecimal from 'js-big-decimal';

import dateHeader from "./components/dateHeader.vue"
import zoom from "./components/zoom.vue"

export default {
    components: { itemService, ItemBar, dateHeader, zoom },
    props: {
        start_date: String,
        end_date: String,
        services: Array
    },
    setup(props){
        const state = reactive({
            // CANVAS
            canvas_width: 0,
            canvas_height: 0,
            // CHART
            chart_width: 0,
            chart_height: 0,
            chart_collumn_width: 30,
            // COLLMN
            column_width: 30,
            zoom: 100,
            frequency: "week",
            dayjs_after_current: 720, // months
            dayjs_before_current: 720, // months
            steps: 0
        })

        const zoom = ref(1)
        const chart_frequency = ref("day")
        // diferenca entre inicio e fim
        const diff = computed(() => {
            return dayjs(props.end_date).diff(dayjs(props.start_date), chart_frequency.value ) || 1;
        })
        console.log(diff.value)
      

        onMounted(() => {
            window.addEventListener("resize", handleResize, false);
            handleResize()
        })
        onBeforeUnmount(() => window.removeEventListener("resize", handleResize, false))

        function handleResize(){
            const ganttScrollContainer = document.querySelector(".content_right");

            const { width, height } = ganttScrollContainer.getBoundingClientRect();

            state.canvas_width = width;
            state.canvas_height = height;

            const diff = dayjs(props.end_date).diff(dayjs(props.start_date), state.frequency ) + 1 || 1;
            state.steps = diff

            state.chart_width = diff * chart_column_width.value * bigDecimal.round(state.zoom / 100, 2);

            console.log(diff, chart_column_width.value)
            
        }   

        const chart_column_width = computed(() => {
            if(!state.chart_width || !state.canvas_width) return 30;

            let columnWidth = 0;
            if(state.chart_width <= state.canvas_width){
                columnWidth = state.canvas_width / dayjs(props.end_date).diff(dayjs(props.start_date), state.frequency);
                console.log(dayjs(props.end_date).diff(dayjs(props.start_date), state.frequency))
            }else{
                columnWidth = state.chart_width / dayjs(props.end_date).diff(dayjs(props.start_date), state.frequency);
            }

            return columnWidth > 30 ? columnWidth : 30
        })


        return {
            state,
            diff,
            getMeasures,
            chart_column_width,
            zoom,
            handleResize,
            chart_frequency
        }
    }
}
</script>

<style lang="less" scoped>
    .gantt-chart{
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-areas: "header_1 header_2" "content_left content_right";
        grid-template-columns: 300px calc(100% - 300px);
        grid-template-rows: 30px 1fr;
    }
    .header_1{ grid-area: header_1; } 
    .header_2{ grid-area: header_2; }
    .content_left{ grid-area: content_left; } 
    .content_right{ grid-area: content_right; }

    @border-color: rgb(187, 187, 187);

    .header_1{
        border-bottom: solid 1px @border-color;
        border-right: solid 1px @border-color;
    }
    .header_2{
        border-bottom: solid 1px @border-color;
    }
    .content_left{
        border-right: solid 1px @border-color;
        box-shadow: 1px 0 1px rgba(0, 0, 0, .2)
    }
    .content_right{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .container-canvas{
        width: 100%;
        height: 100%;
        overflow: auto auto;
        position: relative;
        padding-top: 70px;
    }
   
    .background-lines{
        width: 1px;
        height: 100%;
        position: absolute;
        top: -30px;
        background-color: rgb(230, 230, 230);
    }

    .select-scale{
    }
</style>