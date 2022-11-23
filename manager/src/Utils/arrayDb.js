export function remove(array, query){
    const [[ key, value ]] = Object.entries(query)

    return array.filter( item => {
        if(item[key] !== value) return item
    })
}

export function edit(array, query, alterations){
    const [[ key, value ]] = Object.entries(query)

    return array.map( item => {
        if(item[key] === value) 
            return {
                ...item,
                ...alterations
            }
        else
            return item
    })
}

export function editAll(array, alterations){
    return array.map( item => {
        return {
            ...item,
            ...alterations
        }
    })
}

export function find(array, query){
    const [[ key, value ]] = Object.entries(query)

    const [item] =  array.filter( item => {
        if(item[key] === value) 
            return item
    })

    return item
}

export function push(array, item){
    array.push(item)
    return array
}

export function has(object){
    return Object.entries(object).length > 0
}