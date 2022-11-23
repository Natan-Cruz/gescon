<template>
    <div style="position: relative; width: 100%; display: none">
        <div id="fragment-receipt-print-js">
            <div>
                <img style="display:inline-block; width: 130px" src="https://storage.googleapis.com/gescon-eea3d.appspot.com/PNU4DZBXOvdmtuGN/logo-estrutural-piramide.jpg" alt="">
                <h1 style="font-size: 30px; text-aling: right">ESTRUTURAL PIRAMIDE CONSTRUTORA LTDA.</h1>
            </div>

            <p> RECIBO DE PAGAMENTO</p>

            <template v-if="Object.entries(account).length">
                <p> 
                    Recebemos do {{ account.customer_name }} a importância de {{ amount }} ({{ amountInString }}), 
                    referente ao pagamento da parcela concernente ao mês de {{ dueDate }}, 
                    do imóvel {{ account.cost_center_name }}
                </p>

                <p> Praia grande, {{ currentDate }}</p>
            </template>

            <p>Assinatura:</p>
        </div>
        
    </div>
</template>

<script>
import { formatCurrency } from '@/Utils/index.js'
import PrintJS from "print-js"
import { computed } from 'vue';
import dayjs from "dayjs"
import extenso from "extenso"

export default {
    props: {
        account: Object
    },
    setup(props, { expose }){
        function printOut(){
            PrintJS({
                printable: "fragment-receipt-print-js", 
                type: "html",
                style: "img{width: 130px}",
                headerStyle: "font-size: 30px;",
                documentTitle: ""
            })
        }
        const currentDate = computed(() => dayjs().format("DD [de] MMMM [de] YYYY"))
        const dueDate = computed(() => dayjs(props.account.due_date).format("MMMM [de] YYYY"))
        const amount = computed(() => formatCurrency(props.account.amount || props.account.forecast_amount))
        const amountInString = computed(() => extenso(props.account.amount || props.account.forecast_amount, { mode: "currency" }))

        expose({ printOut })

        return {
            currentDate,
            dueDate,
            amount,
            amountInString,
            // 
            formatCurrency, 
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
            width: 130px !important;
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
    }
</style>