export function interpoleData(cells, data){
    return data.map( data => {
        const values = []

        cells.forEach( cell => {
            if(typeof cell === "string"){
                const value = data[cell]
                values.push( value || "-")
            }

            if(typeof cell === "object" && Array.isArray(cell)){
                const value = data[cell[0]]
                const fn = cell[1]
                values.push( fn(value) )
            }
        })
        return {
            id: data.id,
            values: values
        }
    }) 
}

export function groupBy(xs, cells, { key, title }) {
    const reduced = xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});

    return Object.entries(reduced).map(([ , value ]) => {
        if(value.length === 1){
            return interpoleData(cells, value)[0]
        }else
            return {
                title: value[0][title],
                items: interpoleData(cells, value)
            }
    })
}

// ordena um array de objetos
// requear a propriedade chave e a order
// order: 0 ou 1 ou -1
export function dynamicSort(property, sortOrder) {
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        let value_a =  a[property], value_b = b[property], result;

        if(value_a && typeof value_a === "string" && value_b && typeof value_b === "string"){
            value_a = value_a.toLowerCase()
            value_b = value_b.toLowerCase()

            result = value_a.localeCompare(value_b, undefined, { numeric: true ,sensitivity: 'base' })
        }

        if(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/.test(value_a) && /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/.test(value_b)){
            value_a = new Date(value_a).getTime()
            value_b = new Date(value_b).getTime()
            result = (value_a < value_b) ? -1 : (value_a > value_b) ? 1 : 0;
        }
        return result * sortOrder;
    }
}