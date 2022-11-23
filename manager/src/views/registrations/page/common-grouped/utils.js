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
                title: title.str + value[0][title.key],
                // title: value[0][title],
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
        const aa = a[property] ? a[property].toLowerCase() : ""
        const bb = b[property] ? b[property].toLowerCase() : ""
        var result = (aa < bb) ? -1 : (aa > bb) ? 1 : 0;
        return result * sortOrder;
    }
}