import dayjs from "dayjs";

function formatNumbers(num){
    return (Math.round(num * 100) / 100).toFixed(2);
}

export function buildDataAccumulatedWork(productions, isGrouped, inPercentage){

    const labelsMap = new Map()
    productions.forEach( production => {
        const key = dayjs(production.created_at).format("DD/MM/YY")
        const has = labelsMap.get(key);
        const name = isGrouped ? production.production_unity : `${ production.name }/${ production.production_unity }`

        if(has){
            const unity = has.get(name)
            const data = inPercentage ? ( unity || 0 + ((production.value / production.production_total) * 100)) : (unity || 0) + production.value
            has.set(name, data)
            labelsMap.set(key, has)  
        }else{
            const data = inPercentage ? ((production.value / production.production_total) * 100) : production.value 
            labelsMap.set(key, new Map().set(name, data))
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
    const data = []
    const labels = Array.from(labelsMap).map(([ key ]) => key );

    Array.from(map).forEach(([ key, value ]) => {
        let values = [] 
        value.map((v, i) => {
            values[i] = (values[i - 1] || 0) + v
        })
        labels.forEach(( _, i) => {
            if(!values[i]) 
                values[i] = values[values.length - 1]
        })

        data.push({ label: key, values: values.map(formatNumbers) })
    });

    return {
        labels: labels,
        data: data
    }
}