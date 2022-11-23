/* eslint-disable */

export default function Rules(form, rules){
    const errors = {}

    Object.entries(rules).forEach(([ key, value ]) => {
        const has = Object.prototype.hasOwnProperty.call(form, key);

        const { type, required, maxLength, isArray, rules, required_if } = value

        if((!has || form[key] === '') && required){
            errors[key] = value.msg || "Preencha este campo";
        }
        if(has && type === "Array"){
            if(!form[key] || !form[key].length) return errors[key] = value.msg || "Preencha este campo";
        }
        if(has && maxLength && form[key]){
            if(form[key].length > maxLength)
                errors[key] = value.msg || "Tamanho máximo do texto atingido";
        }

        if(key === "required_if"){
            value.forEach( r_if => {

                const { condition, rules } = r_if;
                
                Object.entries(form).forEach( ([k,v]) => {
                    if(Object.keys(condition)[0] === k && Object.values(condition)[0] === v){
                        Object.entries(rules).forEach(([ kkey, vall ]) => {
                            const hass = Object.prototype.hasOwnProperty.call(form, kkey);
                            if((!hass || form[kkey] === '') && vall.required){
                                errors[kkey] = value.msg || "Preencha este campo";
                            }                                
                        })
                    }
                })
            })
        }

        if(has && isArray){
            form[key].forEach( (itm, i) => {

                Object.entries(rules).forEach(([ kkey, vall ]) => {
                    const hass = Object.prototype.hasOwnProperty.call(itm, kkey);

                    if((!hass || itm[kkey] === '') && vall.required){
                        if(!errors[key])
                            errors[key] = []

                        if(!errors[key][i])
                            errors[key][i] = {}

                        errors[key][i][kkey] = value.msg || "Preencha este campo";
                    }                                
                })

                if(required_if && typeof required_if === "object" && Array.isArray(required_if)){
                    required_if.forEach( r_if => {

                        const { condition, rules } = r_if;

                        Object.entries(itm).forEach( ([k,v]) => {
                            if(Object.keys(condition)[0] === k && Object.values(condition)[0] === v){
                                Object.entries(rules).forEach(([ kkey, vall ]) => {
                                    const hass = Object.prototype.hasOwnProperty.call(itm, kkey);

                                    if((!hass || itm[kkey] === '') && vall.required){
                                        if(!errors[key])
                                            errors[key] = []

                                        if(!errors[key][i])
                                            errors[key][i] = {}

                                        errors[key][i][kkey] = value.msg || "Preencha este campo";
                                    }                                
                                })
                            }
                        })
                    })
                }
            })

        }
    })

    return errors
}