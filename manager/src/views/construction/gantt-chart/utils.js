import dayjs from "dayjs"
/* eslint-disable */

export function getMeasures(chart_start_date, chart_end_date, chart_collumn_width, chart_frequency, service_start_date, service_end_date){
    
    const diff = dayjs(chart_end_date).diff(dayjs(chart_start_date), chart_frequency, true )
    const chartWidth = diff * chart_collumn_width
    
    const serviceDiff = dayjs(service_end_date).diff(dayjs(service_start_date), chart_frequency ,true);

    
    const serviceWidth = (chartWidth * serviceDiff) / diff

    const diffBetweenStartDatesService_Chart =  dayjs(service_start_date).diff(dayjs(chart_start_date), chart_frequency ,true);
    const left = diffBetweenStartDatesService_Chart * chart_collumn_width
    return {
        width: serviceWidth,
        left: left
    }
}


