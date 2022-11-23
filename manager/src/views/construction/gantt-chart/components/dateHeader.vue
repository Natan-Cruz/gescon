<template>
    <div class="date-header">
        <ul class="list-date-header">
            <li class="dates" v-for="(date, i) in group_date" :key="i" :style="{ width: date.column_width + 'px' }" style="color: #000; font-weight: bold">
                <span>{{ date.value }}</span>
            </li>
        </ul>
        <ul class="list-date-header" >
            <li class="dates" v-for="(date, i) in unitary_date"  :key="i" :style="{ width: date.column_width + 'px' }">
                <span :class="{ 'is-today': date.isToday }">{{ date.value }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
/* eslint-disable */
import { onMounted, watch , ref} from 'vue';
import RRule from "rrule";

import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import isToday from 'dayjs/plugin/isToday'

dayjs.extend(advancedFormat).extend(weekOfYear).extend(quarterOfYear).extend(isToday)

export default {
    props: {
        chart_start_date: String,
        chart_end_date: String,
        chart_collumn_width: Number,
        chart_frequency: String
    },
    setup(props){
        const group_date = ref([]), unitary_date = ref([]);

        function render(){
            let freq_1, freq_2, format_1, format_2, interval = 1;

            switch(props.chart_frequency){
                case "day": {
                    freq_1 = RRule.MONTHLY
                    freq_2 = RRule.DAILY
                    format_1 = "MMMM [de] YYYY"
                    format_2 = "DD";
                    break
                }
                case "week": {
                    freq_1 = RRule.MONTHLY
                    freq_2 = RRule.WEEKLY
                    format_1 = "MMMM [de] YYYY"
                    format_2 = "[Sem] ww"
                    break
                }
                case "month": {
                    freq_1 = RRule.YEARLY
                    freq_2 = RRule.MONTHLY
                    format_1 = "YYYY"
                    format_2 = "MMM"
                    break
                }
                case "quarter": {
                    freq_1 = RRule.YEARLY
                    freq_2 = RRule.MONTHLY
                    interval = 3
                    format_1 = "YYYY"
                    format_2 = "MMM"
                    break
                }
            }

            const dtstart = dayjs(props.chart_start_date).toDate();
            const until = dayjs(props.chart_end_date).toDate();

            const rule_group = new RRule({ freq: freq_1, dtstart, until, interval})
            const rule_unitary = new RRule({ freq: freq_2, dtstart, until, interval })

            group_date.value = rule_group.all().map( date => {
                let step;
                switch(props.chart_frequency){
                    case "day": step = dayjs(date).daysInMonth();  break
                    case "week": step = 4; break
                    case "month": step = 12; break
                    case "quarter": step = 3; break
                }
                return {
                    column_width: step * props.chart_collumn_width,
                    value: dayjs(date).format(format_1)
                }
            })

            unitary_date.value = rule_unitary.all().map( date => {
                return {
                    column_width: props.chart_collumn_width,
                    value: dayjs(date).format(format_2),
                    isToday: dayjs(date).isToday()
                }
            })
        }

        onMounted(render)
        watch([() => props.chart_collumn_width, () => props.chart_frequency], render)
        
        return {
            group_date,
            unitary_date
        }
    }
}
</script>

<style lang="less" scoped>
    .date-header{
        position: absolute;
        left: 0;
        top: -70px;
        background-color: transparent;
        z-index: 10;
        box-shadow: 0 2px 6px #d6d6d6
    }
    .list-date-header{
        border-bottom: solid 1px rgb(209, 209, 209);
        display: flex;
    }
    .dates{
        display: inline-block;
        text-align: center;
        padding: 4px 0;

        border-left: solid 1px rgb(209, 209, 209);
        white-space: nowrap;
        color: gray;

        span{
            width: 20px;
            font-size: 1.5em;
            padding: 2px 3px;
        }
    }

    .is-today{
        background-color: #f70;
        border-radius: 50%;
        color: #fff;
    }
</style>