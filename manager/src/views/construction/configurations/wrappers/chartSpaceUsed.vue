<template>
    <div class="main-wrapper wrapper-chart-space-used">
        <p class="sub-title bold">Espaço na nuvem usado:</p>
       
        <div class="chart-container">
            <canvas id="doughnut-chart"></canvas>
        </div>
    </div>
</template>

<script>
import { formatBytes } from "@/Utils/index.js"
import randomColor from "randomcolor";
import { onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels)
export default {
    name: 'wrapper-chart-space-used',
    props: {
        spaceUsed: Object
    },
    setup(props){
        const elemChart = ref(null)

        const centerText = {
            id: "centerText",
            afterDatasetsDraw(chart){
                const { ctx, chartArea: { width, height }} = chart;

                ctx.save();
                const total = chart.data.datasets[0].data.reduce((acc, cur) => {
                    acc += cur 
                    return acc
                }, 0)

                ctx.font = "bolder 18px roboto";
                ctx.fillStyle = "#000",
                ctx.textAlign = "center";
                ctx.fillText(formatBytes(total), width / 2, (chart.height - height - 20) + height / 2);
                ctx.restore()
            }
        }
        const spacing = {
            id: "spacing",
            beforeInit(chart) {
                // Get reference to the original fit function
                const originalFit = chart.legend.fit;
                // Override the fit function
                chart.legend.fit = function fit() {
                    // Call original function and bind scope in order to use `this` correctly inside it
                    originalFit.bind(chart.legend)();
                    // Change the height as suggested in another answers
                    this.height += 25;
                }
            }
        }
        onMounted(() => {
            const colors = props.spaceUsed.types.map(() => randomColor({ luminosity: 'bright', hue: 'random'}))

            elemChart.value = new Chart(document.getElementById('doughnut-chart'), {
                type: 'doughnut',
                data: {
                    labels: props.spaceUsed.types.map(({ type }) => type),
                    datasets: [{
                        label: "",
                        data: props.spaceUsed.types.map(({ size }) => size),
                        backgroundColor: colors
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        datalabels: {
                            formatter: formatBytes,
                            align: "end",
                            offset: 32
                        },
                        legend: {
                            position: "top"
                        }
                    },
                    layout: {
                        padding: {
                            bottom: 20
                        }
                    }
                },
                plugins: [ centerText, spacing ]
            })
        })

        watch(() => props.spaceUsed, renderChart)

        function renderChart(spaceUsed){
            const colors = spaceUsed.types.map(() => randomColor({ luminosity: 'bright', hue: 'random'}))
            const labels = spaceUsed.types.map(({ type }) => type)

            elemChart.value.data.labels.splice(0)
            labels.forEach( label => {
                elemChart.value.data.labels.push(label) 
            })

            elemChart.value.data.datasets[0].label = ""
            elemChart.value.data.datasets[0].data =  spaceUsed.types.map(({ size }) => size)
            elemChart.value.data.datasets[0].backgroundColor = colors
            elemChart.value.update();
        }
 
        return {}
    }
}
</script>