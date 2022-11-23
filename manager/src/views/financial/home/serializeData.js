
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import weekOfYear from "dayjs/plugin/weekOfYear"
import advancedFormat from "dayjs/plugin/advancedFormat"
import quarterOfYear from "dayjs/plugin/quarterOfYear"
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(advancedFormat).extend(weekOfYear).extend(quarterOfYear).extend(isBetween).locale("pt-br")
import RRule from "rrule"

export function serializeData(data, type_interval_dates, start_date, end_date){
   
    const rule = new RRule({
        freq: RRule[type_interval_dates.toUpperCase()],
        dtstart: start_date ? dayjs(start_date).toDate() : dayjs("2022-01-10").toDate(),
        until: end_date ? dayjs(end_date).toDate() : dayjs("2022-12-30").toDate(),
        interval: 1
    })

    const mapActualCashFlow = new Map();
    const mapForecastCashFlow = new Map();

    rule.all().forEach( date => {
        const createdAt = dayjs(date)
        let key;
        switch(type_interval_dates){
            case "daily":
                key = createdAt.format("DD/MM/YY")
                break
            case "weekly":
                key = createdAt.format("[Semana ]wo YY");
            break
            case "monthly":
                key = createdAt.format("MMMM YY")
            break
            case "quarterly":
                key = createdAt.format("[trim. ]Q YY")
            break
            case "yearly":
                key = createdAt.format("YYYY")
        }
        mapActualCashFlow.set(key, { inflows: 0,outflows: 0 })
        mapForecastCashFlow.set(key, { inflows: 0,outflows: 0 })
    })
    data.forEach( d => {
        const createdAt = dayjs(d.created_at)
        let key;
        
        switch(type_interval_dates){
            case "daily":
                key = createdAt.format("DD/MM/YY")
                break
            case "weekly":
                key = createdAt.format("[Semana ]wo YY");
            break
            case "monthly":
                key = createdAt.format("MMMM YY")
            break
            case "quarterly":
                key = createdAt.format("[trim. ]Q YY")
            break
            case "yearly":
                key = createdAt.format("YYYY")
        }
        const has = d.status === "Previsão" ? mapForecastCashFlow.get(key) : mapActualCashFlow.get(key)
        if(has){
            let v = {...has};
            if(d.type === "inflow"){
                v.inflows = v.inflows + parseInt(d.amount)
            }else{
                v.outflows = v.outflows + parseInt(d.amount)
            }

            if(d.status === "Previsão")
                mapForecastCashFlow.set(key, v) 
            else
                mapActualCashFlow.set(key, v)

        }else{
            let v = {
                inflows: 0,
                outflows: 0
            }

            if(d.type === "inflow")
                v.inflows = parseInt(d.amount)
            else
                v.outflows = parseInt(d.amount)

            if(d.status === "Previsão")
                mapForecastCashFlow.set(key, v) 
            else
                mapActualCashFlow.set(key, v)
        }
    })
    
    const labels = []

    const actualCashFlow = {
        inflows: [],
        outflows: [],
    }, forecastCashFlow = {
        inflows: [],
        outflows: [],
    }

    Array.from(mapActualCashFlow).forEach(([ , value ]) => {
        actualCashFlow.inflows.push(value.inflows)
        actualCashFlow.outflows.push(value.outflows)
    })
    Array.from(mapForecastCashFlow).forEach(([ key, value ]) => {
        labels.push(key)
        forecastCashFlow.inflows.push(value.inflows)
        forecastCashFlow.outflows.push(value.outflows)
    })

    return {
        labels,
        actualCashFlow,
        forecastCashFlow
    }
}