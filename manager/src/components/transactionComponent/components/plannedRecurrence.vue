<template>
    <expandable-content title="Recorrência planejada" :font="16" style="margin-bottom: 14px">
        <ul>
            <li class="item-header" v-show="showTitle">
                <p class="r_title"></p>
                <p class="forecast_amount">Valor esperado</p>
                <p class="amount">Valor recebido</p>
                <p class="paid_at">Data do pagamento</p>
            </li>

            <item-planned-recurrence v-for="(data, i) of teste" :key="data.date" 
                :data="data" 
                :plannedRecurrenceLength="plannedRecurrence.length" 
                :idx="i"
                @event-edit="handleEditItem"
                @event-remove="handleRemoveItem" >
            </item-planned-recurrence>
        </ul>
    </expandable-content>
</template> 

<script>
import expandableContent from "@/components/expandableContent.vue"

import { ref, computed, watch } from "vue"
import { generatePlannedRecurrence } from "../generatePlannedRecurrence.js"
import itemPlannedRecurrence from "../items/itemPlannedRecurrence.vue"

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat)

export default {
    emits: ["event-edit"],
    components: { itemPlannedRecurrence, expandableContent },
    props: {
        trx: Object,
        index: Number
    },
    setup(props, { emit }){
        const plannedRecurrence = ref([]);
        const showTitle = computed(() => installments_paid.value ? installments_paid.value.filter( planned => planned.wasPaid ).length : false)
        const installments_paid = computed({
            get: () => props.trx.installments_paid,
            set: installments_paid => emit("event-edit", { ...props.trx, installments_paid })
        })
        const teste = computed(() => {
            if( !plannedRecurrence.value || !plannedRecurrence.value.length) return []

            return plannedRecurrence.value.map( date => {
                const has = installments_paid.value && installments_paid.value.find( itm => itm.date === formatDate(date))
                return has || { date: formatDate(date), paid_at: dayjs(date).set("date", props.trx.due_date).format("YYYY-MM-DD") }
            })
        })

        function formatDate(date){
            switch(props.trx.frequency){
                case "daily":  
                case "weekly": return dayjs(date).format("DD/MM/YY");
                case "monthly": 
                case "every_two_months": 
                case "every_three_months": 
                case "every_four_months": 
                case "every_six_months": 
                case "yearly": return dayjs(date).format("MM/YYYY");
            }
        }

        watch([
            () => props.trx.frequency,
            () => props.trx.start_date,
            () => props.trx.quantity_installments,
            () => props.trx.due_date
        ], calcRecurrence)

        function calcRecurrence(){
            const { frequency, start_date, quantity_installments, due_date } = props.trx;
            if(!frequency || !start_date || !quantity_installments) 
                return;

            plannedRecurrence.value = [];
            installments_paid.value = []

            console.info("recalc recurence")
            
            plannedRecurrence.value = generatePlannedRecurrence(frequency, start_date, quantity_installments, due_date)
        }

        function handleEditItem({ item }){
            const elem = teste.value.find( elem => elem.date === item.date)
            const idx = installments_paid.value.findIndex( elem => elem.date === item.date)

            if(!elem) return

            if(elem.wasPaid !== item.wasPaid)
                if(item.wasPaid){
                    installments_paid.value ? installments_paid.value.push(item) : installments_paid.value = [ item ]
                }else{
                    installments_paid.value.splice(idx, 1)
                }
            else{
                installments_paid.value.splice(idx, 1, item)
            }
        }

        function handleRemoveItem({ index }){
            installments_paid.value.splice(index, 1)
        }

        return {
            plannedRecurrence,
            installments_paid,
            showTitle,
            teste,
            handleEditItem,
            handleRemoveItem
        } 
    }
}
</script>

<style lang="less" scoped>
    .item-header{
        width: 100%;
        display: grid;
        grid-template-areas: 'r_title forecast_amount paid_at amount';
        grid-template-columns: 350px repeat(3,160px);
        column-gap: 20px;
        padding-bottom: 12px;

        p{
            font-size: 1.6em;
            font-weight: bold;
        }
    }
    .r_title{
        grid-area: r_title;
    }
    .forecast_amount{
        grid-area: forecast_amount;
    }
    .amount{
        grid-area: amount;
    }
    .paid_at{
        grid-area: paid_at;
    }
</style>