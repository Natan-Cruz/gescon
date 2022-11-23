import dayjs from "dayjs";

function formatNumbers(num){
    return (Math.round(num * 100) / 100).toFixed(2);
}

export function buildDataRateProduction(productions, isGrouped){

    const labelsMap = new Map();
    // em primeiro lugar agrupa por data seguindo o padrao brasileiro DD/MM/YY
    productions.forEach( production => {
        const key = dayjs(production.created_at).format("DD/MM/YY")
        const has = labelsMap.get(key);
        const k = isGrouped ? production.production_unity : `${ production.name }/${ production.production_unity }`

        if(has){
            const unity = has.get(k)
            has.set(k, (unity || 0) + production.value)
            labelsMap.set(key, has)  
        }else{
            labelsMap.set(key, new Map().set(k, production.value ))
        }
    })

    const map = new Map()

    Array.from(labelsMap).forEach(([ , value ]) => {
        Array.from(value).forEach(([ key, value ]) => {
            const has = map.get(key)  
            if(has){
                has.push(value)
                map.set(key, has)
            }else{
                map.set(key, [value])
            }
        })
    })
    

    return {
        labels: Array.from(labelsMap).map(([ key ]) => key ),
        data: Array.from(map).map(([ key, value ]) => { return { label: key, values: value.map(formatNumbers) }})
    }
}