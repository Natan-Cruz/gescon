import RRule from "rrule"
import dayjs from "dayjs"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isSameOrAfter).extend(weekOfYear).extend(advancedFormat).extend(isoWeek)

export function generateInstallments(recurrence, reqQuery){
    switch(recurrence.frequency){
        case "daily":
            return generateInstallmentsDaily(recurrence, reqQuery)
        case "weekly":
            return generateInstallmentsWeekly(recurrence, reqQuery)
        case "monthly":
            return generateInstallmentsMonthly(recurrence, reqQuery)
        case "yearly":
            return generateInstallmentsYealy(recurrence, reqQuery)
    }
}

function generateInstallmentsDaily(recurrence){
    const rule = new RRule({
        freq: RRule.DAILY,
        dtstart: (recurrence.start_date),
        until: recurrence.end_date,
        interval: 1
    })
    return rule.all().map( d => {
        console.log(d)
        return {
            ...recurrence,
            billing_date: dayjs(d).format("YYYY-MM-DD"),
            due_date: dayjs(d).format("YYYY-MM-DD"),
            date: dayjs(d).format("YYYY-MM-DD")
        }
    })
}

function generateInstallmentsWeekly(recurrence){
    const rule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: recurrence.start_date,
        until: recurrence.end_date,
        interval: 1
    })
    return rule.all().map( d => {
        return {
            ...recurrence,
            billing_date: dayjs(d).day(recurrence.billing_date).format("YYYY-MM-DD"),
            due_date: dayjs(d).day(recurrence.due_date).format("YYYY-MM-DD"),
            date: dayjs(d).format("YYYY-[W]WW")
        }
    })
}

function generateInstallmentsMonthly(recurrence, { start_date, end_date }){
    let dtstart;
    let until;

    if(start_date && dayjs(start_date).isAfter(recurrence.start_date)){
        dtstart = dayjs(start_date).toDate()
    }else{
        dtstart = dayjs(recurrence.start_date).toDate()
    }
    
    if(end_date && dayjs(end_date).isBefore(recurrence.end_date)){
        until = dayjs(end_date).toDate()
    }else{
        until = dayjs(recurrence.end_date).toDate()
    }

    const rule = new RRule({
        freq: RRule.MONTHLY,
        dtstart: dtstart,
        until: until,
        interval: 1
    })  
    return rule.all().map( d => {
        return {
            ...recurrence,
            billing_date: dayjs(d).date(recurrence.billing_date).format("YYYY-MM-DD"),
            due_date: dayjs(d).date(recurrence.due_date).format("YYYY-MM-DD"),
            date: dayjs(d).format("YYYY-MM")
        }
    })
}

function generateInstallmentsYealy(recurrence){
    const rule = new RRule({
        freq: RRule.YEARLY,
        dtstart: recurrence.start_date,
        until: recurrence.end_date,
        interval: 1
    })

    return rule.all().map( d => {
        return {
            ...recurrence,
            billing_date: dayjs(d).date(recurrence.billing_date).format("YYYY-MM-DD"),
            due_date: dayjs(d).date(recurrence.due_date).format("YYYY-MM-DD"),
            date: dayjs(d).format("YYYY")
        }
    })
}