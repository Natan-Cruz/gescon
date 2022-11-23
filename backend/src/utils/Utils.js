import nanoid from "./nanoid"
const API_KEY_CURRENCY_RATE = "6efac80571967370c837"
import axios from "axios"
import logger from "./logger.js";

export function filterKeys(allowedKeys, inputObject, addObject, removeEmpty = false){
    if(!allowedKeys && Array.isArray(allowedKeys)) throw new Error("AllowedKeys obrigatoria")
    if(!inputObject) throw new Error("inputObject Obrigatorio")

    const sanitizedObject = {}

    allowedKeys.forEach( allowedKey => {
        Object.entries(inputObject).filter(([ key, value ]) => {
            if(allowedKey === key) {
                if(removeEmpty && value !== "")
                    sanitizedObject[key] = value;
                else if(!removeEmpty)                
                    sanitizedObject[key] = value;
            }
        })
    })

    return { ...addObject, ...sanitizedObject};
}

export function formatActions(contacts, parent_key, parent_id){
    const add = [], remove = [], update = [];
    
    if(!contacts || !Array.isArray(contacts)) 
        return { add, remove, update }
  
    contacts
        // Remove aqueles que não possuem instruções
        .filter( contact => contact.action )
        .forEach( contact => {
            const action = contact.action
            delete contact.action

            switch(action){
                case "ADD": 
                    const item = { id: nanoid(), ...contact }
                    item[parent_key] = parent_id
                    add.push(item); 
                    break
                case "REMOVE": remove.push(contact); break
                case "UPDATE": update.push(contact); break
            }
        });

    return { add, remove, update }
}

export function getCurrencyDollar(){
    const url = "https://free.currconv.com/api/v7/convert?q=USD_brl&compact=ultra&apiKey=" + API_KEY_CURRENCY_RATE
    return new Promise( resolve => {
        axios.get(url)
            .then( response => {
                resolve(response.data.USD_BRL.toFixed(2))
            })
            .catch( () => { 
                logger.error("Erro ao obter currency_rate")
                resolve(null) 
            })
    })    
}