<template>
    <div style="height: 100%; position: relative">
        <!-- <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetch"></loading-or-error> -->

        <wrapper title="Gráfico">
            <chart-component
                :actualCashFlow="info.actualCashFlow" 
                :forecastCashFlow="info.forecastCashFlow" 
                :labels="info.labels" >
            </chart-component>
        </wrapper>

        <wrapper title="Sumário">
            <table-component
                :actualCashFlow="info.actualCashFlow" 
                :labels="info.labels">
            </table-component>
        </wrapper>
    </div>
</template>


<script>
/* eslint-disable */
// import pageCommon from "@/components/pageCommon/pageCommon.vue"

import wrapper from "./wrapper.vue"
import chartComponent from "./chart/chart.vue"
import tableComponent from "./table/table.vue"

import { serializeData } from "./serializeData"

import { reactive, watch } from 'vue';
import axios from "@/services/api"

export default {
    name: "financial-home",
    components: {
        wrapper,
        chartComponent,
        tableComponent,
        // pageCommon
    },
    setup(){
        const info = reactive({
            actualCashFlow: [],
            forecastCashFlow: [],
            labels: []
        })
        const state = reactive({
            data: undefined,
            isLoading: false,
            errorMsg: "",
            timeoutID: undefined,
            timeOfPause: 250
        })
        const filters = reactive({
            start_date: "2022-01-01",
            end_date: "2022-12-30",
            search: "",
            type: "",
            payment_state: "3",
        })

        fetch()
        // o primeiro "fetch" e dado pelo
        async function fetch(){
            const url = `/financial/accounting?${ new URLSearchParams(filters).toString() }`;
            
            state.data = [];
            state.isLoading = true;
            state.error = "";
            
            try {
                const { data } = await axios.get(url)
                state.data = data;
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        watch(() => state.data, defineData)
        watch(() => filters.typeIntervalDates, defineData)
        watch([ () => filters.start_date, () => filters.end_date, () => filters.type, () => filters.payment_state, () => filters.search ], fetch)

        function defineData(){
            if(!state.data || !state.data.length) return;
            const { labels, actualCashFlow, forecastCashFlow } = serializeData(state.data, filters.typeIntervalDates, filters.start_date, filters.end_date)

            info.labels = labels
            info.actualCashFlow = actualCashFlow
            info.forecastCashFlow = forecastCashFlow
        }

        function handleSearch(search){
            console.log(search)
        }

        return {
            info,
            state,
            filters,
            // 
            fetch,
            handleSearch
        }
    },
}
</script>