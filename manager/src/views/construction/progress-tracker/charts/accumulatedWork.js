import Chart from 'chart.js/auto';

export class ChartAccumulatedWork {
    constructor(element_chart_id){
        this.element_chart_id = element_chart_id;
        this.chart = undefined;
        this.inPercentage = undefined;
    }
    init(){
        const chartELement = document.getElementById(this.element_chart_id);
        this.chart = new Chart(chartELement, {
            type: 'line',
            data: {},
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: value => this.inPercentage ? value + "%" : value
                        }
                    }
                },
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            }
        })
    }

    render(labels, data, colors, inPercentage){
        this.inPercentage = inPercentage;
        
        this.chart.data.labels.splice(0)
        labels.forEach( label => {
            this.chart.data.labels.push(label) 
        })
        this.chart.data.datasets.splice(0)
        data.forEach(({ label, values }, i) => {
            this.chart.data.datasets.push({
                label: label,
                data: values,
                fill: false,
                borderColor: colors[i],
                tension: 0.1
            });
        })
        this.chart.update();
    }
}