// ordena um array de objetos
// requear a propriedade chave e a order
// order: 0 ou 1 ou -1
export function dynamicSort(property, sortOrder) {
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        let value_a = a[property], value_b = b[property], result;

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

export function checkIsTransaction(trx){
    return Object.prototype.hasOwnProperty.call(trx, "recurrence_template_id")
}

export function fNumber(strNumber){
    if(!strNumber) return 0
    return parseFloat(strNumber)
}