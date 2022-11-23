import RRule from "rrule"

import dayjs from "dayjs"
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import objectSupport from "dayjs/plugin/objectSupport"
import "dayjs/locale/pt-br"

dayjs.extend(isSameOrAfter)
    .extend(isSameOrBefore)
    .extend(customParseFormat)
    .extend(objectSupport)
    .locale("pt-br");

export function generatePlannedRecurrence(frequency, dtstart, repetions, due_date){
    if(!dtstart) return [];
    if(frequency === "monthly" && !due_date) return []

    const options = { 
        dtstart: dayjs(dtstart).toDate(),
        repetions,
        due_date
    }

    switch(frequency){
        case "daily": return generateInstallmentsDaily(options)
        case "weekly": return generateInstallmentsWeekly(options)
        case "monthly": return generateInstallmentsMonthly(1, options)
        case "every_two_months": return generateInstallmentsMonthly(2, options)
        case "every_three_months": return generateInstallmentsMonthly(3, options)
        case "every_four_months": return generateInstallmentsMonthly(4, options)
        case "every_six_months": return generateInstallmentsMonthly(6, options)
        case "yearly": return generateInstallmentsYealy(options)
    }
}

function generateInstallmentsDaily({ dtstart, repetions }){
    const rule = new RRule({
        freq: RRule.DAILY,
        dtstart: dtstart,
        count: repetions,
        interval: 1
    })
    return rule.all()
}

function generateInstallmentsWeekly({ dtstart, repetions }){
    const rule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: dtstart,
        count: repetions,
        interval: 1
    })
    return rule.all()
}

function generateInstallmentsMonthly(interval = 1, { dtstart, repetions, due_date }){
    let r;
    due_date = [parseInt(due_date)]

    if(due_date <= 28){
        const rule = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dtstart,
            count: repetions,
            interval: interval,
            bymonthday: due_date
        })
        
        r = rule.all()
    }else if(due_date === 31){
        const rule = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dtstart,
            count: repetions,
            interval: interval,
            bymonthday: -1
        })

        r = rule.all()
    }else{
        const ruleFeb = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dtstart,
            count: repetions,
            interval: interval,
            bymonth: 2,
            bymonthday: 28,
        })

        const ruleRemaing = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dtstart,
            count: repetions,
            interval: interval,
            bymonthday: 30
        })
        r = [ ...ruleFeb.all(), ...ruleRemaing.all() ]
    }
    return r
}

function generateInstallmentsYealy({ dtstart, repetions }){
    const rule = new RRule({
        freq: RRule.YEARLY,
        dtstart: dtstart,
        count: repetions,
        interval: 1
    })
    return rule.all()
}