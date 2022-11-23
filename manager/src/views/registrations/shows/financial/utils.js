export function fnFrequency(frequency){
    let f;
    switch(frequency){
        case "daily": f = 'Diário'; break
        case "weekly": f = 'Semanal'; break
        case "monthly": f = 'Mensal'; break
        case "yearly": f = 'Anual'; break
        case "every_two_months": f = 'Bimestral'; break;
        case "every_three_months": f = 'Trimestral'; break;
        case "every_four_months": f = 'Quadrimestral'; break;
        case "every_six_months": f = 'Semestral'; break;
        default: f = "Única"
    }
    return f
}

export function setStyle(transaction){
    const { type, paid_at } = transaction;
    let color, opacity;

    switch(type){
        case "inflow": color = "#287928"; break;
        case "outflow": color = "#F51720"; break;
    }
    if(paid_at) 
        opacity = "1"
    else
        opacity = ".7"

    
    return `background-color: ${ color }; opacity: ${ opacity }`
}

export function setValues(transaction){
    let type, labelAmount, status;
    if(transaction.type === "inflow"){
        type = "Entrada";
        labelAmount = "Valor recebido";
        status = transaction.paid_at ? "Conta recebida" : "A receber"
    }else{
        type = "Saída";
        labelAmount = "Valor pago";
        status = transaction.paid_at ? "Conta paga" : "A pagar"
    }
    return { type, labelAmount, status }
}