<template>
    <div class="container-canvas">
        <canvas id="canvas-cash-flow"></canvas>
    </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
    name: "Wrapper-cash-flow",
    data(){
        this.chart = null
        return {}
    },
    props: {
        actualCashFlow: Object,
        forecastCashFlow: Object,
        labels: Array,
    },
    watch: {
        forecastCashFlow: {
            handler(){
                this.main()
            },
            deep: true
        },
        actualCashFlow: {
            handler(){
                this.main()
            },
            deep: true
        }
    },
    mounted(){
        this.main()
    },
    methods: {
        removeData(){
             if(this.chart != null) {
                this.chart.data.labels.splice(-1, 1); // remove the label first
                this.chart.data.datasets.forEach(function(dataset) {
                    //dataset.data.pop();it is dataset.data.shift() is not pop,because pop() only get the data,not get and deleted
                    dataset.data.shift()
                });

                this.chart.update()
            }
        },
        updateChart(chart, labels, actualCashFlow, forecastCashFlow){
            chart.data.labels.length = 0
            chart.data.labels = labels

            chart.data.datasets[0].data = actualCashFlow.inflows
            chart.data.datasets[1].data = actualCashFlow.outflows
            chart.data.datasets[2].data = forecastCashFlow.inflows
            chart.data.datasets[3].data = forecastCashFlow.outflows

            chart.update()
        },
        main(){
            if(!this.chart)
                this.startChart(JSON.parse(JSON.stringify(this.labels)), this.actualCashFlow, this.forecastCashFlow)
            else
                this.updateChart(this.chart, JSON.parse(JSON.stringify(this.labels)), this.actualCashFlow, this.forecastCashFlow)
        },
        startChart(labels, actualCashFlow, forecastCashFlow){
            this.chart = new Chart("canvas-cash-flow", {
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';

                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            type: "linear",
                            ticks: {
                                callback: function(value) {
                                    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
                                }
                            }
                        }
                    },
                },
                data: {
                    datasets: [
                        {
                            type: "bar",
                            label: "Entrada realizada",
                            data: actualCashFlow.inflows,
                            backgroundColor: "#104b5f"
                        },
                        {
                            type: "bar",
                            label: "Saida realizada",
                            data: actualCashFlow.outflows,
                            backgroundColor: "#700b0f"
                        },
                        {
                            type: "bar",
                            label: "Entrada prevista",
                            data: forecastCashFlow.inflows,
                            backgroundColor: "#cbebf760"
                        },
                        {
                            type: "bar",
                            label: "Saida prevista",
                            data: forecastCashFlow.outflows,
                            backgroundColor: "#F5172060"
                        },
                    ],
                    labels: labels
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper{
        height: 400px;
        max-height: calc(100% - 84px);
    }

    .container-canvas{
        width: 100%;
        height: calc(100% - 36px);
        position: relative;

        color: #700b0f;
    }

</style>

<style lang="less">
    .chartWrapper {/* w w w. j a v  a2 s.co  m*/
    position: relative;
    }
    .chartWrapper > canvas {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events:none;
    }
    .chartAreaWrapper {
    width: 600px;
    overflow-x: scroll;
    }
</style>