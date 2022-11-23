export function simpleInterest(amount, annualRate, annualDuration){
    return amount * (annualRate / 100) * annualDuration
}

export function compoundInterest(amount, annualRate, annualDuration){
    return (amount * Math.pow((1 - (annualRate / 100)), annualDuration) - amount ) * -1
}
