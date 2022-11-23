<template>
    <li class="bank-slip" >
        <div class="bank-slip-detail" :style="styles.color"></div>

        <row label="Data de emissão" :width="widthRow">{{ formatDate(slip.billing_date) }}</row>
        <row label="Data de vencimento" :width="widthRow" >{{ formatDate(slip.due_date) }}</row>
        <row label="Valor" :width="widthRow" >{{ formatCurrency(slip.amount) }}</row>
        <row v-if="slip.paid_at" label="Pago em" :width="widthRow">{{ formatDate(slip.paid_at) }}</row>
        <row label="Status" :width="widthRow" >{{ styles.text }}</row>
        <row label="Url" :width="widthRow" >{{ slip.url_pdf }}</row>
    </li>
</template>

<script>
import row from "./row.vue"
import dayjs from "dayjs"
import { formatDate, formatCurrency } from "@/Utils/index.js"
import { computed } from 'vue'

export default {
    components: { row }, 
    props: { slip: Object },
    setup(props){
        const styles = computed(() => {
            const { due_date, paid_date } = props.slip;
            let text, color;

            if(paid_date){
                color = "#319210";
                text = "Boleto pago"
            }else
            if(dayjs().isAfter(due_date)){
                color = "#ff4b37";
                text = "Boleto vencido"
            }else{
                color = "#5353ec";
                text = "Boleto enviado"
            }

            return { text, color: "background-color:" + color }
        })

        const widthRow = 150

        return { 
            styles,
            formatDate,
            formatCurrency,
            widthRow
        }
    }
}
</script>

<style lang="less" scoped>
    .bank-slip{
        position: relative;
        .row{
            padding-left: 15px;
        }
        .bank-slip-detail{
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            border-radius: 5px;
        }
    }
</style>