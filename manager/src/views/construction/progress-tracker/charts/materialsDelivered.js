import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels)

export class ChartMaterialsDelivered {
    constructor(element_chart_id){
        this.element_chart_id = element_chart_id;
        this.chart = undefined
    }
    init(){
        const chartELement = document.getElementById(this.element_chart_id);
        this.chart = new Chart(chartELement, {
            type: 'bar',
            data: {},
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        display: false
                    },
                }
            }
        })
    }

    render(labels, data, colors){
        this.chart.data.labels.splice(0)
        labels.forEach( label => {
            this.chart.data.labels.push(label) 
        })
        this.chart.data.datasets.splice(0)
        data.forEach(({ label, values }, i) => {
            this.chart.data.datasets.push({
                label: label,
                data: values,
                backgroundColor: colors[i],
                order: i
            });
        })
        this.chart.update();
    }
}