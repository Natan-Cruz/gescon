import dayjs from "dayjs"
import isoWeek from 'dayjs/plugin/isoWeek'
import "dayjs/locale/pt-br"
dayjs.extend(isoWeek).locale("pt-br")

export function groupByPeriods(frequency, items){
    switch(frequency){
        case "daily":
            return groupByDaily(items)
        case "weekly":
            return groupByWeekly(items)
        case "monthly":
        case "yearly":
            return groupByMonthly(items)
    }
}

function groupByDaily(items){
    const map = new Map()

    items.forEach( i => {
        const year = dayjs(i.date).format("MMMM [-] YYYY")

        const has = map.get(year)   
        if(has){
            map.set(year, [ ...has, i ])
        }else{
            map.set(year, [ i ])
        }
    })
    return Array.from(map).map(([ key, value ]) => {
        return {
            title: key,
            items: value
        }
    })
}

function groupByWeekly(items){
    const map = new Map()

    items.forEach( i => {
        const year = dayjs(i.date.split("-")[0]).week(i.date.split("-")[1].replace("W", "")).format("MMMM [-] YYYY")

        const has = map.get(year)   
        if(has){
            map.set(year, [ ...has, i ])
        }else{
            map.set(year, [ i ])
        }
    })
    return Array.from(map).map(([ key, value ]) => {
        return {
            title: key,
            items: value
        }
    })
}

function groupByMonthly(items){
    const map = new Map()

    items.forEach( i => {
        const year = dayjs(i.date).format("YYYY")

        const has = map.get(year)   
        if(has){
            map.set(year, [ ...has, i ])
        }else{
            map.set(year, [ i ])
        }
    })
    return Array.from(map).map(([ key, value ]) => {
        return {
            title: key,
            items: value
        }
    })
}
