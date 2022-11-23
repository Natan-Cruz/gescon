/* eslint-disable */
import dayjs from "dayjs"
import indexsPoupanca from "./ValoresSerie(SERCODIGO='ANBIMA12_TJPOUP12').json"

var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrBefore).extend(isSameOrAfter)
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const commands = [
    // "@JUROS_COMPOSTOS",
    "@JUROS_SIMPLES",
    "@ARREDONDAR.PARA.CIMA",
    "@ARREDONDAR.PARA.BAIXO",
    "@PERCENTUAL",
    "@IPCA",
    "@IGPM",
    "@POUPANCA",
]

export function main(code, params){
    if(!code) 
        throw new Error("Parametro necessario")

    if(typeof code !== "string")
        throw new Error("Parametro precisa ser string")

    const parsed = parse(code)
    const compiled = compile(parsed, params)
    const executable = code.split(" ").reduce((prev, cur) => {
        const has = compiled.find(({key}) => key === cur)
        if(has)
            cur = has.result

        if(cur === undefined) cur = 0

        return prev ? prev + " " + cur : prev + cur
    }, "");
    try {
        return eval(executable)
    } catch (error) {
        return 0
    }
}   

function parse(code){
    // Obtem todas as funcoes
    const fns = code.match(/@(.*?)\)/gim)
    return fns.map( fn => {
        let p;
        const params = fn.match(/\(.*\)/)

        const nameFunc = fn.match(/@(.*?)\(/)[0].replace("@", "").replace("(", "")
        if(params)
            p = parseFloat(params[0].replace("(","").replace(")",""))

        return {
            key: fn,
            type: "Function",
            name: nameFunc,
            param: p
        }
    })
}

function compile(parsed, params){
    return parsed.map(({ key, type, name, param }) => {
        let result;
        if(type === "Function"){
            switch(name){
                case "JUROS_COMPOSTOS":
                    result = compoundInterest(params, param)
                    break;
                case "JUROS_SIMPLES":
                    result = simpleInterest(params, param)
                    break
                case "IPCA":
                    result = simpleInterest(params, param)
                    break
                case "POUPANCA":
                    result = calcPoupanca(params, param)
                    break
                case "PERCENTUAL":
                    result = calcPercentage(params, param)
                    break
                case "IGPM":
                    result = calcPercentage(params, param)
                    break
                case "ARREDONDAR.PARA.CIMA":
                    result = calcPercentage(params, param)
                    break
                case "ARREDONDAR.PARA.BAIXO":
                    result = calcPercentage(params, param)
                    break
            }
        }

        return { key, result }
    })
}

function simpleInterest(amount, annualRate, annualDuration){
    return amount * (annualRate / 100) * annualDuration
}

function compoundInterest(amount, annualRate, annualDuration){
    return (amount * Math.pow((1 - (annualRate / 100)), annualDuration) - amount ) * -1
}

function calcPoupanca(params, param){
    let f = 0
    const sumPercentage = indexsPoupanca.reduce((acc, cur, i, arr) => {
        const { VALDATA } = cur;
        if(dayjs(VALDATA).isSameOrAfter(params.start_date) && dayjs(VALDATA).isSameOrBefore(params.end_date) && params.start_date !== params.end_date ){
            if(f === 0) f = arr[i -1].VALVALOR
            acc += arr[i -1].VALVALOR
        }
        return acc
    }, 0)
    return ((sumPercentage - f) / 100)
}
function calcPercentage(params, param){
    return param / 100
}


// console.log(redimentoCompostoVariado(indexsPoupanca, 10000, 0, '01/2022', '03/2022')) //=> 20161.722546560424

// function valorIndicador(tabela, mesInicial, mesFinal) {
//     const valor = {}
//     const anoInicial = mesInicial.split('/')[1]
//     const anoFinal = mesFinal.split('/')[1]
//     mesInicial = mesInicial.split('/')[0]
//     mesFinal = mesFinal.split('/')[0]
  
//     for (let ano = anoInicial; ano <= anoFinal; ano++) {
//       const inicio = ano === anoInicial ? mesInicial : 1
//       const fim = ano === anoFinal ? mesFinal : 12
//       for (let mes = inicio; mes <= fim; mes++) {
//         let { VALVALOR } = tabela.find(({ VALDATA }) => dayjs(VALDATA).format("YYYY-MM") === dayjs().set("year", ano).set("month", mes).format("YYYY-MM"))
//         valor[dayjs().set("year", ano).set("month", mes).format("YYYY-MM")] =VALVALOR
//       }
//     }
  
//     return valor
//   }
  
  
// function redimentoCompostoVariado(tabela, valorInicial, aporte, mesInicial, mesFinal) {
//     const juros = Object.values(valorIndicador(tabela, mesInicial, mesFinal))
//     // console.log(juros)
//     return juros
//       .map(juro => juro / 100)
//       .reduce((acumulado, juro) => (acumulado) * (1 + juro), valorInicial)
// }
  