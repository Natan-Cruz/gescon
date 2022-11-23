<template>
    <div class="filter-by-date-component">
        <div class="container-step">
            <span class="arrow arrow-left" @click="onLeft" title="Mês anterior">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z"/></svg>
            </span>
            <span class="viewer-current-date">{{ currentDateFormatted }}</span>

            <span class="arrow arrow-right" @click="onRight" title="Proximo mês">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z"/></svg>
            </span>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import weekOfYear from "dayjs/plugin/weekOfYear"
import advancedFormat from "dayjs/plugin/advancedFormat"
import quarterOfYear from "dayjs/plugin/quarterOfYear"

dayjs.extend(advancedFormat).extend(weekOfYear).extend(quarterOfYear).locale("pt-br")

import { computed, ref, watch } from "vue"

export default {
    name: "filter-by-date-component",
    props: {
        frequency: String,
        start_date: String,
        end_date: String
    },
    setup( props, { emit }){
        const currentDate = ref(dayjs())

        const currentDateFormatted = computed(() => {
            if(!currentDate.value)
                return ""

            let c;
            switch(props.frequency){
                case "monthly":
                    c = currentDate.value.format("MMMM [de] YY")
                break
                case "yearly":
                    c = currentDate.value.format("[Ano ] YY")
                break
            }
            return c
        })

        function buildQueryDates(){
            if(!currentDate.value) return

            let start;
            let end;
            switch(props.frequency){
                case "monthly":
                    start = currentDate.value.startOf("month")
                    end = currentDate.value.endOf("month")
                break
                case "yearly":
                    start = currentDate.value.startOf("year")
                    end = currentDate.value.endOf("year")
                break
            }

            emit("set-dates", [ start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD") ])
        }
        function onLeft(){
            switch(props.frequency){
                case "monthly":
                    currentDate.value = currentDate.value.subtract(1, "month")
                break
                case "yearly":
                    currentDate.value = currentDate.value.subtract(1, "year")
                break
            }
        }
        function onRight(){
            switch(props.frequency){
                case "monthly":
                    currentDate.value = currentDate.value.add(1, "month")
                break
                case "yearly":
                    currentDate.value = currentDate.value.add(1, "year")
                break
            }
        }

        buildQueryDates()
        watch(currentDate, buildQueryDates)
        watch(props.frequency, buildQueryDates)

        return {
            currentDate,
            currentDateFormatted,
            onLeft,
            onRight
        }
    }
}
</script>

<style lang="less" scoped>
    .container-step{
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-right: 18px;

        width: 50%;
        max-width: 212px;
    }

    .arrow{
        width: 32px;
        height: 32px;

        border-radius: 50%;
        cursor: pointer;
        padding: 3px;
        display: block;

        &:active{
            transform: scale(.9);
        }
        &:hover{
            background-color: rgba(238, 238, 238, 0.8);
        }
    }

    .arrow-right svg{
        transform: rotate(-180deg);
    }
    
    .viewer-current-date{
        font-size: 1.7em;
        font-weight: bold;
        padding: 0 8px;
        text-align: center;
        color: rgb(49, 49, 49);
        white-space: nowrap;
    }
</style>