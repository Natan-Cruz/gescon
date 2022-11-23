<template>
    <div class="gantt-chart">
        <div class="header_1"></div>
        <div class="header_2"></div>
        <div class="content_left">
            <item-service 
                v-for="(service, i) in servicesHierarchical" 
                :key="i" 
                :item="service"
                @push="handlePushOptions"
                @remove="handlePushOptions" />

            <!-- <select class="select" v-model="state.frequency" @change="handleResize">
                <option value="day">Diário</option>
                <option value="week">Semanal</option>
                <option value="month">Mensal</option>
                <option value="quarter">Trimestral</option>
            </select>
            <p>Diff: {{ state }}</p>
            <p>chart_collumn_width {{ state.chart_collumn_width }}</p> -->
        </div>
        <div class="content_right">
            <div class="container-canvas">

                <div style="position: relative; height: 100%" >
                    <date-header
                        :chart_start_date="start_date"
                        :chart_end_date="end_date"
                        :chart_collumn_width="state.chart_collumn_width"
                        :chart_frequency="state.frequency" />


                    <span class="background-lines" v-for="n in state.steps" :key="n" :style="{ left: (n* state.chart_collumn_width)  + 'px' }"></span>

                    <p class="date-marker-today" :style="{ left: (todayPositionLeft + state.chart_collumn_width / 2) + 'px' }"></p>

                    <item-bar v-for="(service, i) in servicesHierarchical" :key="i" 
                        :item="service"
                        :chart_start_date="start_date"
                        :chart_end_date="end_date"
                        :chart_collumn_width="state.chart_collumn_width"
                        :chart_frequency="state.frequency" />

                </div>
            </div>

            <div class="ctn-buttons" v-if="showLeft || showRight" :style="{ justifyContent: showLeft && 'flex-start', justifyContent: showRight && 'flex-end' }">
                <button v-show="showLeft" class="button-set-today left" @click="setToday(true)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="24" width="24"><path d="m11 18-6-6 6-6 1.4 1.4L7.825 12l4.575 4.6Zm6.6 0-6-6 6-6L19 7.4 14.425 12 19 16.6Z"/></svg>
                    Hoje
                </button>

                <button v-show="showRight" class="button-set-today left" @click="setToday(true)">
                    Hoje
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="24" width="24"><path d="M6.4 18 5 16.6 9.575 12 5 7.4 6.4 6l6 6Zm6.6 0-1.4-1.4 4.575-4.6L11.6 7.4 13 6l6 6Z"/></svg>
                </button>
            </div>

            <!-- tooltips -->
            <zoom v-model="state.zoom" @update:modelValue="handleResize"/>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(quarterOfYear)

import ItemBar from './components/itemBar.vue'
import itemService from "./components/itemService.vue"
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import bigDecimal from 'js-big-decimal';
import { treeify } from "@/Utils/index.js"

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
            canvas_left: 0,
            // CHART
            chart_width: 0,
            chart_height: 0,
            chart_collumn_width: 30,
            // COLLMN
            default_column_width: 60,
            zoom: 100,
            frequency: "month",
            dayjs_after_current: 720, // 24 months
            dayjs_before_current: 720, // 24 months
            steps: 0
        })

        const showRight = ref(false)
        const showLeft = ref(false)
        const ganttScrollContainer = ref(null);
        const servicesOptions = ref([]);

        const servicesHierarchical = computed(() => {
            const services = props.services.map( service => {
                const opts = servicesOptions.value.find( serv => serv.id === service.id )
                if(opts){
                    return { ...service, ...opts }
                }
                return service
            })

            return treeify(services)
        })


        // COMPUTED
        const todayPositionLeft = computed(() => {
            const diff = dayjs().diff(dayjs(props.start_date), state.frequency)
            const left = state.chart_collumn_width * diff
            return left
        })


        onMounted(() => {
            ganttScrollContainer.value = document.querySelector(".container-canvas");

            handleResize();
            nextTick(setToday)

            window.addEventListener("resize", handleResize, false);
            ganttScrollContainer.value.addEventListener("scroll", handleShowTranslateButtons, false)
        })

        onBeforeUnmount(() => {
            window.removeEventListener("resize", handleResize, false)
            ganttScrollContainer.value.addEventListener("scroll", handleShowTranslateButtons, false)
        })

        function handleShowTranslateButtons(evt){
            const scrollLeft = evt.target.scrollLeft
            state.canvas_left = scrollLeft

            if(scrollLeft < todayPositionLeft.value - state.canvas_width){
                showRight.value = true;
                showLeft.value = false
            }else if(scrollLeft > todayPositionLeft.value){
                showRight.value = false;
                showLeft.value = true
            }else{
                showRight.value = false;
                showLeft.value = false
            }
        }

        function handleResize(){
            const { width, height } = ganttScrollContainer.value.getBoundingClientRect();
            const diff = dayjs(props.end_date).diff(dayjs(props.start_date), state.frequency ) + 1 || 1;
            let columnWidth = state.default_column_width * bigDecimal.round(state.zoom / 100, 2);

            if(columnWidth < state.default_column_width) 
                columnWidth = state.default_column_width;
            else if(columnWidth * diff <= state.canvas_width){
                columnWidth = width / diff;
            }

            state.steps = diff
            state.canvas_width = width;
            state.canvas_height = height;
            state.canvas_left = ganttScrollContainer.value.scrollLeft

            const oldChartWidth = state.chart_collumn_width * diff;
            state.chart_collumn_width = columnWidth
            const newChartWidth = columnWidth * diff;

            nextTick(() => {
                const left = (newChartWidth * state.canvas_left + columnWidth) / oldChartWidth 
                translateLeft(left)
            })
        }

        function translateLeft(left, applyBehavior){
            if(applyBehavior)
                ganttScrollContainer.value.scrollTo({ left: left, behavior: "smooth" })
            else
                ganttScrollContainer.value.scrollTo({ left: left })
        }

        function setToday(applyBehavior){
            translateLeft(todayPositionLeft.value, applyBehavior)
        }


        function handlePushOptions(service_id, options){
            const index = servicesOptions.value.findIndex( serv => serv.id === service_id)
            const service = servicesOptions.value.find( serv => serv.id === service_id)
            if(index > -1){
                servicesOptions.value.splice(index, 1, { ...service, ...options })
            }else{
                servicesOptions.value.push({ id: service_id, ...options })
            }
        }
        function handleCloseChildren(service_id){
            const index = servicesOptions.value.findIndex( serv => serv.id === service_id)
            const service = servicesOptions.value.find( serv => serv.id === service_id)
            if(index > -1){
                servicesOptions.value.splice(index, 1, { ...service, isOpen: false })
            }
        }

        return {
            state,
            servicesHierarchical,
            // computed
            todayPositionLeft,
            showRight,
            showLeft,
            // methods
            handleResize,
            setToday,
            handlePushOptions,
            handleCloseChildren
        }
    }
}
</script>

<style lang="less" scoped>
    @paddingTop: 70px;

    .gantt-chart{
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-areas: "header_1 header_2" "content_left content_right";
        grid-template-columns: 400px calc(100% - 400px);
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
        box-shadow: 1px 0 1px rgba(0, 0, 0, .2);
        padding-top: @paddingTop;
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
        padding-top: @paddingTop;
    }
   
    .background-lines{
        width: 1px;
        height: 100%;
        position: absolute;
        top: -30px;
        background-color: rgb(230, 230, 230);
    }

    .date-marker-today{
        width: 2px;
        height: 100%;
        background-color: #f70;
        display: inline-block;

        position: absolute;
        left: 0;
        top: -17px;
        z-index: 30;
    }


    .ctn-buttons{
        width: 100%;
        height: auto;

        position: absolute;
        left: 0;
        top: 0;

        padding: 10px;

        display: flex;
        align-content: center;

        z-index: 200;
    }

    .button-set-today{
        width: 66px;
        height: 30px;
        background-color: #f70;
        color: #fff;
        border: none;
        border-radius: 5px;
        font-size: 1.5em;
        font-weight: bold;

        padding: 0 6px;
        
        display: flex;
        align-items: center;
        justify-content: space-between;

        cursor: pointer;
    }
</style>