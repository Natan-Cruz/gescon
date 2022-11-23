<template>
    <div class="_ctn_">
        <loading-or-error 
            :isLoading="state.isLoading" 
            :error="state.error" 
            @event-retry="fetchReports">
        </loading-or-error>

        <template v-if="!state.isLoading && !state.error">
            <Header :frequency="state.type" :start_date="state.dates.start_date" :end_date="state.dates.end_date" @set-today="selectToday" @set-dates="handleSetDates"/>
            <div class="body">
                <calendar :type="state.type" :start_date="state.dates.start_date" :end_date="state.dates.end_date" :reports="state.reports" />
            </div>
        </template>        
    </div>
</template>

<script>
import Header from "./header/header"
import calendar from "./calendar/calendar.vue"

import { reactive } from 'vue';
import { useRoute } from "vue-router"
import axios from "@/services/api";
import dayjs from 'dayjs';

export default {
    components:{
        calendar,
        Header
    },
    setup(){
        const state = reactive({ isLoading: false, error: "", reports: [], type: "monthly", dates: { start_date: "", end_date: "" } })
        const $route = useRoute()

        state.dates = {
            start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
            end_date: dayjs().endOf("month").format("YYYY-MM-DD")
        }
        
        async function fetchReports(){
            state.reports = [];
            state.isLoading = true;
            state.error = ""
            
            const url = `/constructions/${ $route.params.constructionID }/reports`;

            try {
                const { data } = await axios.get(url)
                state.reports = data;
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }
        fetchReports()

        function selectToday(){
            state.dates = {
                start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
                end_date: dayjs().endOf("month").format("YYYY-MM-DD")
            }
        }

        function handleSetDates([ start_date, end_date ]){
            state.dates = {
                start_date,
                end_date
            }
        }

        return {
            state,
            fetchReports,
            selectToday,
            handleSetDates
        }
    }
}
</script>

<style lang="less" scoped>
    ._ctn_{
        height: 100%;
        background-color: #fff;
        position: relative;
        overflow: hidden;
        border-radius: 10px;
    }
   
    .body{
        // padding: 20px;
        height: calc(100% - 60px);
    }
</style>