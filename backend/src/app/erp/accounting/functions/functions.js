import { main as compiler } from "./compile"

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(isSameOrAfter).extend(advancedFormat);

// Coloca numero da parcela ao lado no nome
export function putNumberOfRecurrence(trx){
    const isRecurrence = Object.prototype.hasOwnProperty.call(trx, "recurrence_template_id")

    if(!isRecurrence){
        const { frequency, start_date, end_date, date } = trx;
                
        let unit, quantity_installments = 1;
        switch(frequency){
            case "daily": unit = "day"; break
            case "weekly": unit = "week"; break
            case "monthly": unit = "month"; break
            case "every_two_months": quantity_installments = 2; break
            case "every_three_months": quantity_installments = 3; break
            case "every_four_months": quantity_installments = 4; break
            case "every_six_months": quantity_installments = 6; break
            case "yearly": unit = "year"
        }

        const diff = dayjs(date).diff(start_date, unit)
        const repetions = dayjs(end_date).diff(start_date, unit)
        if(repetions){
            const result = diff / quantity_installments
            trx.name += ` ${ result + 1 }/${ repetions }`
        }
    }

    return trx;
}

// parcelas devedoras
export function onlyDefaulters(defaulters){
    return function(trx) {
        if(!defaulters || defaulters !== "true")
            return trx

        const { due_date, paid_at } = trx
        
        if(paid_at) 
            return;
        
        if(due_date && dayjs().isAfter(due_date))
            return trx
    }
}

// calcula reajuste
export function calcReadjustment(trx){
    const { readjustment_content, amount, forecast_amount, start_date, due_date, date } = trx;
    let corrections = 0;
    if(readjustment_content){
        const params = {
            amount: amount || forecast_amount,
            start_date: start_date,
            end_date: due_date || date
        }
        const result = compiler(readjustment_content, params)
        if(result && typeof result === "number"){
            corrections = (trx.amount || trx.forecast_amount) * result
        }
    }
    trx.corrections = corrections
    return trx
}

// aplica multa
export function applyPaymentFine(trx){
    const { 
        due_date,
        paid_at,
        type_late_fee, 
        late_fee, 
        type_monetary_correction, 
        frequency_monetary_correction, 
        monetary_correction,
        corrections
    } = trx

    // nao possui data de vencimento;
    if(!due_date || paid_at) return trx;
    
    const weekDay = dayjs(due_date).day();
    const dueDateIsWeekend = weekDay === 0 || weekDay === 6;

    let dueDate;
    if(dueDateIsWeekend){
        // domingo
        if(weekDay === 0){
            dueDate = dayjs(due_date).add(1, "day") 
        }
        // sabado
        if(weekDay === 6)
            dueDate = dayjs(due_date).add(2, "day") 

    }else{
        dueDate = dayjs(due_date)
    }

    if(dayjs().isBefore(dueDate)) return trx;

    const amount = (trx.amount || trx.forecast_amount) + (corrections || 0)

    let fees = 0, fine = 0
    // venceu e não é no final de semana
    if(type_late_fee && late_fee){
        let lateFee = parseFloat(late_fee);
        switch(type_late_fee){
            case "value": fees = lateFee; break
            case "percentage": fees =  amount * (lateFee / 100); break
        }
    }

    if(type_monetary_correction && frequency_monetary_correction && monetary_correction){
        let monetaryCorrection = parseFloat(monetary_correction)
        let unit;
        switch(frequency_monetary_correction){
            case "daily": unit = "day"; break
            case "weekly": unit = "week"; break
            case "monthly": unit = "month"; break
        }
        // data transcorrida
        let elapsedDate = dayjs().diff(dayjs(due_date), unit, true)
        elapsedDate = Math.trunc(elapsedDate)
        switch(type_monetary_correction){
            case "value": fine += elapsedDate * monetaryCorrection; break
            case "percentage": fine += amount * elapsedDate * (monetaryCorrection / 100); break
        }
    }
    trx.fees = fees;
    trx.fine = fine;
    return trx
}

export function comparisonAccountDate(acc, cur, i, arr){

    const isTransaction = Object.prototype.hasOwnProperty.call(cur, "recurrence_template_id")
    // = template
    if(isTransaction){
        acc.push(cur)
    }else{
        let format;
        switch(cur.frequency){
            case "daily":
                format = "YYYY-MM-DD"; break
            case "weekly":
                
            format = "w-YYYY"; break
            case "monthly":
            case "every_two_months":
            case "every_three_months": 
            case "every_four_months": 
            case "every_six_months":
                format = "YYYY-MM"; break
            case "yearly": 
                format = "YYYY"; break
        }
        // console.log(arr)
        const [has] = arr.filter( account => {
            return account.recurrence_template_id === cur.id && dayjs(account.due_date || account.date).format(format) === dayjs(cur.date).format(format)
        })

        if(!has) acc.push(cur)
    }

    return acc
}   