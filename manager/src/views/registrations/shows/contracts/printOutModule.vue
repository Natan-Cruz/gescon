<template>
    <div style="position: relative; width: 100%; display: none">
        <div id="fragment-print-js">
            <img src="https://storage.googleapis.com/gescon-eea3d.appspot.com/PNU4DZBXOvdmtuGN/logo-estrutural-piramide.jpg" alt="">
            <table class="table-informations">
                <tr>
                    <th>Nome do cliente</th>
                    <td>{{ contract_customer_name }}</td>
                </tr>
                <tr>
                    <th>Ativo</th>
                    <td>{{ contract_asset_name }}</td>
                </tr>
            </table>

            <table class="table-installments">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data de venc.</th>
                        <th>Valor</th>
                        <th>Data de pgto.</th>
                        <th>Valor pago</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="installment in installments" :key="installment.id">
                        <td>{{ installment.name }}</td>
                        <td>{{ formatDate(installment.due_date) }}</td>
                        <td>{{ formatCurrency(installment.forecast_amount) }}</td>
                        <td>{{ formatDate(installment.paid_at) }}</td>
                        <td>{{ formatCurrency(installment.amount) }}</td>
                    </tr>
                </tbody>
            </table>
            <tfoot>
                <tr>
                    <td style="border: none"></td>
                    <td style="border: none"></td>
                </tr>
                <tr>
                    <td colspan="2">Total recebido</td>
                    <td>{{ formatCurrency(total.received) }}</td>
                </tr>
                <tr>
                    <td colspan="2">Total a receber</td>
                    <td>{{ formatCurrency(total.receivable) }}</td>
                </tr>
                <tr>
                    <td colspan="2">Total</td>
                    <td>{{ formatCurrency(total.total) }}</td>
                </tr>
            </tfoot>
        </div>
    </div>
</template>

<script>
import { formatCurrency, formatDate } from '@/Utils/index.js'
import PrintJS from "print-js"
import { computed } from 'vue'

export default {
    props: { 
        contract_customer_name: String,
        contract_asset_name: String,
        installments: Array, 
        total: Object 
    },
    setup(props, { expose }){

        const total_sum = computed(() => {
            if(!props.accounts) return 0;

            const total = props.accounts.reduce((acc, cur) => {
                const { amount, forecast_amount } = cur
                acc += amount || forecast_amount
                return acc
            }, 0)

            const isInflow = props.account_type === "bills_to_receive" || props.account_type === "accounts_received"
            return isInflow ? total : total * -1
        })

        function printOut(){
            // let h1 = "h1{font-size: 30px; text-align: center; }";
            // const table = "table{ border-collapse: collapse; } table, tr{ width: 100%;}";
            // const th_td = "th{ padding-bottom: 6px; text-align: left; } th, td{ width: 17,75%;&:first-child{width: 30%} font-size: 1.5em; padding-bottom: 4px; text-align: left;}"
            // const tfoot = "tfoot{ border-top: solid 1px gray; td{ padding-top: 6px; }}"
            // const bold = ".bold{font-weight:bold}"
            PrintJS({
                printable: "fragment-print-js", 
                type: "html",
                // style: h1 + table + th_td + tfoot + bold,
                headerStyle: "font-size: 30px;",
                documentTitle: ""
            })
        }

        expose({ printOut })
        
        return {
            // computeds
            total_sum,
            // methods
            formatCurrency, 
            formatDate,
            print
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

        .table-informations{
            tr{
                width: 100px;
            }
            th{
                text-align: left;
            }
        }

        .table-installments{
            border-collapse: collapse;
            width: 100%;

            th{
                padding-bottom: 6px;
                text-align: left;
            }
            th, td{
                width: 15%;
                &:first-child{width: 30%}
                font-size: 1.6em;
                padding-bottom: 4px;
                text-align: left !important;
            }
            tfoot{
                border-top: solid 1px gray;
                td{
                    padding: 10px;
                }
            }
        }
    }
</style>