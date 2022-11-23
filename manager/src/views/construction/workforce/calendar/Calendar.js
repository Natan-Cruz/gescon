import RRule from "rrule"
import dayjs from "dayjs"
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(weekOfYear).extend(advancedFormat)

export function Calendar(){
    function monthDates(start_date, end_date){
        const day = dayjs(start_date)
        const lastSunday = day.subtract(day.day(), "day").toDate();
        const rule = new RRule({
            freq: RRule.DAILY,
            dtstart: day.day() >= 0 ? lastSunday : new Date(start_date),
            until: new Date(end_date)
        })
        return rule.all()
    }

    return { monthDates }
}
