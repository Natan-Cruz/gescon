<template>
    <div>
        <template v-if="isLoading">
            <div>
                <div class="display_flex" style="justify-content: space-between;">
                    <div>
                        <p class="skeleton-text" style="width: 143px; height: 17px; display:block; margin-bottom: 6px;"></p>
                        <p class="skeleton-text" style="width: 130px; height: 17px; display:block;"></p>
                    </div>
                    <div style="text-align: right;">
                        <p class="skeleton-text" style="width: 100px; height: 17px; display:block; margin-bottom: 6px;"></p>
                        <p class="skeleton-text" style="width: 75px; height: 17px; display: inline-block;"></p>
                    </div>
                </div>
                <div class="skeleton-text" style="width: 100%; height: 12px; margin: 12px 0; display:block; border-radius: 10px"></div>
            </div>
        </template>
        <template v-else>
            <div class="display_flex" style="justify-content: space-between;">
                <div>
                    <p class="text_2" style="margin-bottom: 6px;">{{ completePercentage }}% completado</p>
                    <p class="text">{{ progressMessage }}</p>
                </div>
                <div>
                    <p class="text_2" style="margin-bottom: 6px;">Data de término prevista</p>
                    <p class="text" style="text-align: right">{{ plannedEndDate || "Não especificada" }}</p>
                </div>
            </div>
            <div class="progress">
                <span class="bar-progress" :style="{ 'width': data && data.progress + '%' }"></span>
            </div>
        </template>

        <div class="display_grid" v-show="isShowingMore && !isLoading">
            <div>
                <hr>
                <div class="chart-container" style="position: relative; width: 100%">
                    <canvas id="verifications-chart"></canvas>
                </div>
            </div>
            <div>
                <hr>
                <div class="chart-container" style="position: relative; height: 110px; width: 100%">
                    <canvas id="production-chart"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue'
import { Chart, BarElement, BarController, Legend, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(BarElement, BarController, Legend, CategoryScale, LinearScale, ChartDataLabels)
Chart.defaults.font.size = 14;


import dayjs from "dayjs"
import "dayjs/locale/pt-br"
dayjs.locale("pt-br")

export default {
    props: {
        data: Object,
        planned_end_date: String,
        isLoading: Boolean,
        isShowingMore: Boolean
    },
    setup(props){
        const plannedEndDate = computed(() => {
            return props.planned_end_date ? dayjs(props.planned_end_date).format("DD MMM YY") : ""
        })
        const completePercentage = computed(() => {
            return (props.data && props.data.progress) ? props.data.progress.toFixed(2) + "%" : ""
        })

        const progressMessage = computed(() => {
            const daysLeft = props.planned_end_date ? dayjs(props.planned_end_date).diff(dayjs(), "days") : ""

            if(!daysLeft)
                return "Sem dados";

            if(daysLeft < 0)
                return `Obra atrasada em ${ daysLeft * -1} dias`
            else
                return `${ daysLeft } dias restantes`
        })

        let chart;
        let productionChart;

       
        onMounted(() => {
            chart = new Chart(document.getElementById('verifications-chart'), {
                type: 'bar',
                data: {
                    labels: ["Verificações"],
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            display: false,
                            stacked: true,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            grid: {
                                display: false,
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            formatter: value => {
                                return value > 0 ? value : ""
                            },
                            align: "top",
                            offset: 14,
                            font: {
                                weight: "bold"
                            }
                        },
                        legend: {
                            position: "bottom",
                            labels: {
                                color: "#000",
                            }
                        },
                    }
                }
            })

            productionChart = new Chart(document.getElementById('production-chart'), {
                type: 'bar',
                data: {
                    labels: ["Produção"],
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            display: false,
                            stacked: true,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            grid: {
                                display: false,
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            formatter: value => {
                                return value ? value.toFixed(2) + " %" : ""
                            },
                            align: "top",
                            offset: 14,
                            font: {
                                weight: "bold"
                            }
                        },
                        legend: {
                            position: "bottom",
                            labels: {
                                color: "#000"
                            }
                        }
                    }
                },
            })
        })

        watch(() => props.data, data => {
            if(!data) return
            chart.data.datasets.splice(0)
            chart.data.datasets.push({
                label: "Conformes",
                data: [data.check_items.conformities],
                backgroundColor: '#008000',
                stack: "stack 0",
                barPercentage: .5
            })
            chart.data.datasets.push({
                label: "Não-conformes",
                data: [data.check_items.unconformities],
                backgroundColor: '#ff0000',
                stack: "stack 0",
                barPercentage: .5
            })
            chart.data.datasets.push({
                label: "Reinspencionados",
                data: [data.check_items.reinspected],
                backgroundColor: '#FFA500',
                stack: "stack 0",
                barPercentage: .5
            })
            chart.data.datasets.push({
                label: "Restantes",
                data: [data.check_items.non_checked],
                backgroundColor: '#808080',
                stack: "stack 0",
                barPercentage: .5
            })
          
            chart.update();

            productionChart.data.datasets.splice(0)
            productionChart.data.datasets.push({
                label: "Completo",
                data: [data.productions],
                backgroundColor: '#f70',
                stack: "stack 0",
                barPercentage: .5
            })
            productionChart.data.datasets.push({
                label: "Restante",
                data: [100 - data.productions],
                backgroundColor: '#808080',
                stack: "stack 0",
                barPercentage: .5
            })

            productionChart.update()
        })
        
        return {
            completePercentage,
            progressMessage,
            plannedEndDate
        }
    }
}
</script>

<style lang="less" scoped>
    @primary-color: #f70;
    @secondary-color: #f8d8bc;

    .display_flex{
        display: flex;
        align-items: center;
        flex-direction: row;
    }

    .display_grid{
        display: grid;
        grid-template-areas: repeat(2, minmax(300px, 1fr));
        grid-template-rows: auto;
    }

    .progress{
        width: 100%;
        height: 12px;
        border-radius: 10px;
        border: 1px solid @primary-color;
        background-color: @secondary-color;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        overflow: hidden;
        margin: 12px 0;
    }
    .bar-progress{
        background-color: @primary-color;
        height: 100%;
        display: block;
        &:last-child{
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }

    .text{
        font-size: 1.7em;
        line-height: 1em;

        span{
            font-size: 1em;
        }
    }
    .text_2{
        font-size: 1.5em;
        line-height: 1em;
        color: gray;
        margin-bottom: 2px;

        span{
            font-size: 1em;
        }
    }

    .chart-container{
        height: 110px;
    }

    @media screen and (max-width: 650px) {
        .chart-container{
            height: 130px;
        }
    }

    hr{
        margin-top: 24px;
        margin-bottom: 15px;
        border: none;
        border-top: dashed 1px gray;
    }
</style>