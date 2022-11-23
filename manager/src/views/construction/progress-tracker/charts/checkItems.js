import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels)

export class ChartCheckItems {
    constructor(element_chart_id){
        this.element_chart_id = element_chart_id;
        this.chart = undefined
    }
    init(){
        const chartELement = document.getElementById(this.element_chart_id);
        this.chart = new Chart(chartELement, {
            type: 'doughnut',
            data: {
                labels: ["Conformes", "Não-conformes", "Reinspencionados" , "Restantes"],
                datasets: []
            },
            options: {
                circumference: 180,
                rotation: -90,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        formatter: value => {
                            return value > 0 ? value : ""
                        },
                        color: "#ffffff",
                        font: {
                            weight: "bold",
                            size: 15
                        }
                    },
                }
            },
        })
    }

    render(data){
        this.chart.data.datasets.splice(0)
        this.chart.data.datasets.push({
            data: Object.values(data).map( value => value ),
            backgroundColor: [
                '#008000',
                '#ff0000',
                '#FFA500',
                '#808080'
            ],
            borderWidth: 0
        })
      
        this.chart.update();
    }
}