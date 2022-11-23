import RRule from "rrule"

import dayjs from "dayjs"
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import objectSupport from "dayjs/plugin/objectSupport"
import "dayjs/locale/pt-br"

dayjs.extend(isSameOrAfter).extend(isSameOrBefore).extend(customParseFormat).extend(objectSupport).locale("pt-br");

export function calcEndDate(startDate, repetions, frequence){
    let unit;
    switch(frequence){
        case "daily":
            unit = "day"
            break
        case "monthly":
            unit = "month";
            break
        case "weekly":
            unit = "week"
            break
        case "yearly":
            unit = "year"
    }
    return new Date(dayjs(startDate).add(repetions, unit).format())
}

export function generatePlannedRecurrence(start_date, end_date, freq, instructions){
    if(!freq || !start_date) return []
    if(freq === "weekly" && !instructions) return []
    
    const endDate = end_date ? end_date : calcEndDate(start_date, 12, freq)
    
    if(freq === "daily"){
        let until;
        // infinito
        if(endDate)
            until = new Date(endDate)     
        else    
            until = new Date()

        const rule = new RRule({
            freq: RRule.DAILY,
            dtstart: new Date(start_date),
            until: until,
            interval: 1
        })

        return rule.all()
    }

    if(freq === "weekly"){
        const instr = instructions.split("-").map( s => parseInt(s))
        let until;
        // infinito
        if(endDate)
            until = new Date(endDate)     
        else    
            until = new Date()


        const rule = new RRule({
            freq: RRule.WEEKLY,
            dtstart: new Date(start_date),
            until: until,
            interval: 1,
            byweekday: instr,
        })

        return rule.all()
    }

    if(freq === "monthly"){
        // const instr = instructions !== "" ? instructions.map( s => parseInt(s)) : [new Date().getDate()]
        const instr = instructions !== "" ? [parseInt(instructions)] : [new Date().getDate()]
        let until;

        if(endDate)
            until = new Date(endDate)     
        else    
            until = new Date()

        if(allNumberAreLessOrEqualThanX(instr, 28)){
            const rule = new RRule({
                freq: RRule.MONTHLY,
                dtstart: dayjs(start_date).toDate(),
                until: until,
                interval: 1,
                bymonthday: instr
            })
            return rule.all()
        }

        const ruleFeb = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dayjs(start_date).toDate(),
            until: until,
            interval: 1,
            bymonth: 2,
            bymonthday: 28,
        })
        const ruleRemaing = new RRule({
            freq: RRule.MONTHLY,
            dtstart: dayjs(start_date).toDate(),
            until: until,
            interval: 1,
            bymonthday: instr.map( num => num !== 31 ? num : -1)
        })
        return [ ...ruleFeb.all(), ...ruleRemaing.all() ].sort(comparar).filter( date => { if(dayjs(date).isSameOrAfter(start_date)) return date })
    }

   
    if(freq === "yearly"){
        let until;
        // infinito
        if(endDate)
            until = new Date(endDate)     
        else    
            until = new Date()
        const rule = new RRule({
            freq: RRule.YEARLY,
            dtstart: dayjs(start_date).toDate(),
            until: until,
            interval: 1
        })
        return rule.all()
    }
}

function allNumberAreLessOrEqualThanX(array, x){
    for(const elem of array){
        if(elem > x)
            return false
    }
    return true
}
function comparar(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    // a deve ser igual a b
    return 0;
}