import dayjs from "dayjs";

function formatNumbers(num){
    return (Math.round(num * 100) / 100).toFixed(2);
}

export function buildDataMaterialsDelivered(materials, isGrouped){

    const labelsMap = new Map();
    // em primeiro lugar agrupa por data seguindo o padrao brasileiro DD/MM/YY
    materials.forEach( material => {
        const key = dayjs(material.created_at).format("DD/MM/YY")
        const has = labelsMap.get(key);
        const k = isGrouped ? material.unity : `${ material.material_name }/${ material.unity }`

        if(has){
            const unity = has.get(k)
            has.set(k, (unity || 0) + material.quantity)
            labelsMap.set(key, has)  
        }else{
            labelsMap.set(key, new Map().set(k, material.quantity ))
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