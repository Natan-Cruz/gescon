<template>
    <div class="calendar">
        <div class="cell" v-for="( date, i ) in calendarDates" :key="i" @click="handleDayClick(date)" :class="{ 'day-of-last-month': dayIsOfLastMonth(date) }"> 
            <p class="bold">{{ formatD(date.day, i)}}</p>
            <p :class="{ 'is-today': isToday(date.day) }">{{ formatDay(date.day) }}</p>

            <span class="detail" :style="`background-color: ${ colorBackground(date.status) }`" v-if="date.status"></span>
            <button class="button-add" title="Adicionar relatorio" v-else>&#x2b;</button>

            <div class="container-loading" style="position: relative; background-color: rgba(255,255,255,.6)" v-if="date.isLoading">
                <spinner-loading :loading="date.isLoading"></spinner-loading>
            </div>
        </div>
    </div>
</template>

<script>
import { Calendar } from './Calendar';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router"
import axios from "@/services/api";
import { edit } from "@/Utils/arrayDb"

import dayjs from "dayjs"
import isToday from 'dayjs/plugin/isToday'
import { notify } from '@kyvg/vue3-notification';
dayjs.extend(isToday)

export default {
    props: {
        type: String,
        start_date: String,
        end_date: String,
        reports: Array
    },
    setup(props){
        const calendar = Calendar()
        const calendarDates = ref([]);
        const $route = useRoute()
        const $router = useRouter();

        function formatDay(date){
            return dayjs(date).format("DD")
        }

        function formatD(date, i){
            if( i < 7)
                return dayjs(date).format("ddd")
        }

        function isToday(date){
            return dayjs(date).isToday()
        }

        function colorBackground(status){
            switch(status){
                case "open": 
                    return "#ddb500"
                case "closed":
                    return "#038503"
            }
        }

        async function handleDayClick(data){
            const report_id = data.id, date = dayjs(data.day).format("YYYY-MM-DD");

            if(report_id)
                return $router.push({ name: "construction/diary/anotations", params: { id: report_id }, query: { previous: $route.fullPath } })
            

                const url = `/constructions/${ $route.params.constructionID }/reports`;
                calendarDates.value = edit(calendarDates.value, { day: data.day }, { isLoading: true})
            try {
                const { data } = await axios.post(url, { date: date })

                $router.push({ 
                    name: "construction/diary/anotations", 
                    params: { 
                        id: data.id 
                    }, 
                    query: { 
                        previous: $route.fullPath 
                    } 
                })
            } catch (error) {
                notify({
                    title: "Erro ao tentar criar relatório",
                    type: "error",
                    duration: 5000
                })
            } finally {
                calendarDates.value = edit(calendarDates.value, { day: data.day }, { isLoading: false })
            }
        }

        function renderCalendar(){
            calendarDates.value = calendar.monthDates(props.start_date, props.end_date).map( date => {
                let obj = {}
                props.reports.forEach( report => {
                    if(dayjs(date).format("DD-MM-YY") === dayjs(report.date).format("DD-MM-YY")){
                        obj = {
                            ...report
                        }
                    }
                })
                obj.day = date
                return obj
            })

                calendarDates.value = edit(calendarDates.value, { date: "2022-03-10" }, { isLoading: true})
        }

        function dayIsOfLastMonth({ day }){
            const dateMonth = dayjs(day).format("MM")
            const currentMonth = dayjs(props.start_date).format("MM")

            if(dateMonth < currentMonth) return true
            else return false
        }

        renderCalendar()

        watch(() => props.type, renderCalendar)
        watch(() => [ props.start_date, props.end_date ], renderCalendar)
        watch(() => props.reports, renderCalendar)

        return { 
            calendarDates,
            formatDay,
            formatD,
            isToday,
            colorBackground,
            handleDayClick,
            dayIsOfLastMonth
        }
    }
}
</script>

<style lang="less" scoped>
    .calendar{
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(5, 1fr);
        cursor: default;
    }

    .cell{
        border-right: solid 1px #dadce0;
        border-bottom: solid 1px #dadce0;
        padding: 2px;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;

        position: relative;

        p{
            position: relative;
            font-size: 1.5em;
            padding: 6px;
        }

        &:hover{
            background-color: rgb(236, 236, 236);
        }
    }

    .is-today{
        background-color: #f70;
        border-radius: 50%;
        color: #fff;
    }

    .button-add, .detail{
        background-color: rgb(146, 146, 146);
        border-radius: 50%;
        color: #fff;
        border: none;

        width: 26px;
        height: 26px;

        font-size: 2em;
        line-height: 1em;
        font-weight: bold;

        cursor: pointer;

        position: absolute;
        top: calc(66% - 13px);
        left: calc(50% - 13px);
    }

    .day-of-last-month{
        color: rgb(158, 158, 158);
    }
</style>