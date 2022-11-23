<template>
    <div style="position: relative; width: 100%; display: none">
        <div id="fragment-print-js">
            <img src="https://storage.googleapis.com/gescon-eea3d.appspot.com/PNU4DZBXOvdmtuGN/logo-estrutural-piramide.jpg" alt="">
            <h1 style="font-size: 30px">{{ page_title }}</h1>
            <div class="header">
                <h3 class="custom-h3">Período: {{ formatDate(start_date) }} à {{ formatDate(end_date) }}</h3>
                <h3 class="custom-h3">Emissão: {{ formatDate(new Date()) }}</h3>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>{{ headerDateLabel }}</th>  
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="account in accounts" :key="account.id">
                        <td>
                            <span style="display: block">{{ account.name }} - {{ account.cost_center_name }}</span>
                            <span style="display: block;">{{ account.entity_name }}</span>
                        </td>
                        <td>{{ formatCurrency((fNumber(account.amount) || fNumber(account.forecast_amount)) + fNumber(account.corrections) + fNumber(account.fees) + fNumber(account.fine)) }}</td>
                        <td>{{ account.paid_at ? formatDate(account.paid_at, "DD/MM/YY") : "--" }}</td>
                    </tr>
                </tbody>
            </table>
            <tr>
                <td></td>
                <td class="bold">Total</td>
                <td>{{ formatCurrency(total_sum) }}</td>
            </tr>
        </div>
    </div>
</template>

<script>
import { formatCurrency, formatDate } from '@/Utils/index.js'
import PrintJS from "print-js"
import { computed } from 'vue'
import { fNumber } from '../utils'

export default {
    props: {
        accounts: Array,
        start_date: String,
        end_date: String,
        account_type: String,
        headerDateLabel: String
    },
    setup(props, { expose }){

        const total_sum = computed(() => {
            if(!props.accounts) return 0;

            const total = props.accounts.reduce((acc, cur) => {
                const { amount, forecast_amount } = cur
                acc += fNumber(amount) || fNumber(forecast_amount)
                return acc
            }, 0)

            const isInflow = props.account_type === "bills_to_receive" || props.account_type === "accounts_received"
            return isInflow ? total : total * -1
        })

        const page_title = computed(() => {
            let title;
            switch(props.account_type){
                case "bills_to_pay": title = "Contas a pagar"; break
                case "bills_to_receive": title = "Contas a receber"; break
                case "paid_bills": title = "Contas pagas"; break
                case "accounts_received": title = "Contas recebidas"; break
            }
            return title
        })

        function printOut(){
            let h1 = "h1{font-size: 30px; text-align: center; }";
            const header = ".header{width: 100%; display: flex; justify-content: space-between; border-top: dashed 1px gray; border-bottom: dashed 1px gray; padding: 12px 0; margin: 12px 0; }"
            const h3 = " h3{font-size: 1.8em;}";
            const table = "table{ border-collapse: collapse; } table, tr{ width: 100%;}";
            const th_td = "th{ padding-bottom: 6px; text-align: left; } th, td{ width: 17,75%;&:first-child{width: 30%} font-size: 1.5em; padding-bottom: 4px; text-align: left;}"
            const tfoot = "tfoot{ border-top: solid 1px gray; td{ padding-top: 6px; }}"
            const bold = ".bold{font-weight:bold}"
            PrintJS({
                printable: "fragment-print-js", 
                type: "html",
                style: h1 + header + h3 + table + th_td + tfoot + bold,
                headerStyle: "font-size: 30px;",
                documentTitle: ""
            })
        }

        expose({ printOut })
        
        return {
            // computeds
            page_title,
            total_sum,
            // methods
            formatCurrency, 
            formatDate,
            print,
            fNumber
        }
    }
}
</script>

<style lang="less" scoped>
    #fragment-print-js{
        width: 100%;
        position: absolute;
        left: -1000000%;
        top: -1000000%;
        img{
            width: 130px;
        }
        h1{
            font-size: 30px;
            text-align: center;
        }
        .header{
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            margin: 12px 0;
        }
        h3{
            font-size: 1.8em;
        }
        table{
            border-collapse: collapse;
        }
        table, tr{
            width: 100%;
        }
        th{
            padding-bottom: 6px;
            text-align: left;
        }
        th, td{
            width: 15%;
            &:first-child{width: 40%}
            font-size: 1.6em;
            padding-bottom: 4px;
            text-align: left;
        }
        tfoot{
            border-top: solid 1px gray;

            td{
                padding-top: 6px;
            }
        }

        .teste{
            position: relative;
            padding-left: 4px;
        }
        .teste::before{
                content: "";
                display: block;

                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: gray;

                position: absolute;
                left: 0;
                top: 5px;
            }
    }
</style>