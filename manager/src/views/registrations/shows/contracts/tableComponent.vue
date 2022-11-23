<template>
    <table>
        <thead>
            <tr>
                <th>Nome</th>
                <th>Data de vencimento</th>
                <th>Valor</th>
                <th>Data de pagamento</th>
                <th>Valor pago</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="installment in installments" :key="installment.id">
                <td>{{ installment.name }}</td>
                <td>{{ formatDate(installment.due_date) }}</td>
                <td>
                    <p class="sub-text">{{ formatCurrency(installment.forecast_amount) }}</p>
                    <p class="sub-text">{{ formatCurrency(installment.forecast_amount + installment.payment_fine + installment.readjustment) }}</p>
                </td>
                <td>{{ formatDate(installment.paid_at) }}</td>
                <td>{{ formatCurrency(installment.amount) }}</td>
            </tr>
        </tbody>
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
                <td>
                    <p class="sub-text">{{ formatCurrency(total.receivable) }}</p>
                    <p class="sub-text">{{ formatCurrency(total.receivablesWithCorrections) }}</p>
                </td>
            </tr>
            <tr>
                <td colspan="2">Total</td>
                <td>{{ formatCurrency(total.total) }}</td>
            </tr>
        </tfoot>
    </table>
</template>

<script>
import { formatDate, formatCurrency } from "@/Utils/index.js"

export default {
    props: {
        installments: Array,
        total: Object
    },
    setup(){
        return {
            formatDate,
            formatCurrency
        }
    }
}
</script>

<style lang="less" scoped>
    table{
        border-collapse: collapse;
        width: 100%;
        th{
            padding: 10px 0;
        }
        td{
            padding: 10px;
        }
        
        td,th{
            font-size: 1.5em;
            border: solid 1px rgb(218, 218, 218);

        }
    }
</style>