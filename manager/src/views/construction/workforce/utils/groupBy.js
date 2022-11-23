import dayjs from "dayjs"
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
    relativeTime: {
        future: "%s",
        past: "%s",
        s: 'Hoje',
        m: "Hoje",
        mm: "Hoje",
        h: "Hoje",
        hh: "Hoje",
        d: "Há um dia",
        dd: "Há %d dias",
        M: "Há um mês",
        MM: "Há %d meses",
        y: "Há um ano",
        yy: "Há %d anos"
    }
});
function fromNow(date){
    const last = {
        day: date.get("date"),
        month: date.get("month"),
        year: date.get("year")
    },
    now = {
        day: dayjs().get("date"),
        month: dayjs().get("month"),
        year: dayjs().get("year")
    }

    if(last.day === now.day && last.month === now.month && last.year === now.year)
        return "Hoje"
        
    if( dayjs().subtract(1, "day").get("date") === last.day && (last.month === (now.month - 1) || last.month === now.month) && last.year === now.year )
        return "Ontem"

    if( dayjs().subtract(2, "day").get("date") === last.day && (last.month === (now.month - 1) || last.month === now.month) && last.year === now.year )
        return "Anteotem"

    return date.fromNow()
}

export default function groupBy(reports){
    const result = [];

    reports
        .map( doc => {
            doc.groupTitle = fromNow(dayjs(doc.createdAt))
            return doc
        })
        .forEach(function(item) {
            let i = null
            result.forEach(itm => {
                if (item['groupTitle'] === itm['title'])
                    i = itm
            })
            if (!i) {
                result.push({
                    title: item.groupTitle,
                    items:[{
                    ...item
                    }]
                })
            } else
                i.items.push(item)
        });

    return result;
} 