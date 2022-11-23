<template>
    <div style="height: 100%; background-color: #fff">
        <gantt-chart
            :services="services"
            :start_date="start_date"
            :end_date="end_date"
            chart_frequency="day" />
    </div>
</template>

<script>
import ganttChart from "./ganttChart.vue"

export default {
    components: {
        ganttChart
    },
    setup(){
        const services = [
            {
                id: "1",
                name: "Fundação",
                start_date: "2022-10-10",
                end_date: "2022-11-14",
                path: "a",
                isShow: true
            },
            {
                id: "2",
                name: "Escavação",
                start_date: "2022-10-10",
                end_date: "2022-10-16",
                path: "a.a"
            },
            {
                id: "3",
                name: "Armação",
                start_date: "2022-10-17",
                end_date: "2022-10-22",
                path: "a.b"
            },
            {
                id: "4",
                name: "Nivelamento",
                start_date: "2022-10-22",
                end_date: "2022-10-30",
                path: "a.c"
            },
            {
                id: "5",
                name: "Aplicação do concreto",
                start_date: "2022-10-30",
                end_date: "2022-11-14",
                path: "a.d"
            }
        ]

        return {
            services,
            start_date: "2022-01-01",
            end_date: "2022-12-31"
        }
    }
}
</script>

<style>

</style>