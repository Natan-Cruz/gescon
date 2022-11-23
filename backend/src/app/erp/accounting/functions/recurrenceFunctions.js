import RRule from "rrule";
import dayjs from "dayjs";

const condenseInfo = (recurrence, date) => {
    const due_date = recurrence.due_date ? dayjs(date).set("date", recurrence.due_date).format("YYYY-MM-DD") : undefined ;
    const billing_date = dayjs(date).set("date", recurrence.billing_date || 1).format("YYYY-MM-DD");

    return {
        ...recurrence, 
        uuid: `${ recurrence.id }__${ due_date ? due_date.replace(/-/g, "_") : date }`,
        due_date,
        billing_date,
        date
    }
}

export function generateInstallmentsDaily(recurrence, { dtstart, until }){
    const rule = new RRule({
        freq: RRule.DAILY,
        dtstart: dtstart,
        until: until,
        interval: 1
    })
    return rule.all().map(date => condenseInfo(recurrence, date))
}

export function generateInstallmentsWeekly(recurrence, { dtstart, until }){
    const rule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: dtstart,
        until: until,
        interval: 1
    })
    return rule.all().map(date => condenseInfo(recurrence, date))
}

export function generateInstallmentsMonthly(recurrence, interval = 1, { dtstart, until }){
    let r;
    const dueDate = parseInt(recurrence.due_date) || 1;
    
    if(dueDate <= 28){
        const rule = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dtstart,
            until: until,
            interval: interval,
            bymonthday: dueDate
        })
        
        r = rule.all()
    }else if(dueDate === 31){
        const rule = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dtstart,
            until: until,
            interval: interval,
            bymonthday: -1
        })

        r = rule.all()
    }else{
        const ruleFeb = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dtstart,
            until: until,
            interval: interval,
            bymonth: 2,
            bymonthday: 28,
        })

        const ruleRemaing = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dtstart,
            until: until,
            interval: interval,
            bymonthday: 30
        })
        r = [ ...ruleFeb.all(), ...ruleRemaing.all() ]
    }
    return r.map(date => condenseInfo(recurrence, date))
}

export function generateInstallmentsYealy(recurrence, { dtstart, until }){
    const rule = new RRule({
        freq: RRule.YEARLY,
        dtstart: dtstart,
        until: until,
        interval: 1
    })
    return rule.all().map(date => condenseInfo(recurrence, date))
}