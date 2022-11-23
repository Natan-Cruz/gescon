<template>
    <li class="item">
        <span class="title">Parcela - {{ idx + 1 }}/{{ plannedRecurrenceLength }}</span>
        <span class="date">{{ data.date }}</span>
        <checkbox class="checkbox" label="Foi pago?" v-model="wasPaid"/>

        <template v-if="wasPaid">
            <input-money class="input forecast_amount" ref="input_amount" v-model="forecast_amount"/>
            <input type="date" class="input paid_at" v-model="paid_at">
            <input-money class="input amount" v-model="amount"/>
        </template>
    </li>
</template>

<script>
import inputMoney from "@/components/inputMoney/inputMoney.vue"
import { computed, ref, watch } from 'vue'

export default {
    components: { inputMoney },
    emits: ["event-edit", "event-remove"],
    props: { 
        data: Object,
        plannedRecurrenceLength: Number,
        idx: Number
    },
    setup(props, { emit }){
        const input_amount = ref(null)
        const wasPaid = computed({
            get: () => props.data.wasPaid,
            set: wasPaid => emit("event-edit", { index: props.idx, item: { ...props.data, wasPaid }})
        })
        const forecast_amount = computed({
            get: () => props.data.forecast_amount,
            set: forecast_amount => emit("event-edit", { index: props.idx, item: { ...props.data, forecast_amount }})
        })
        const amount = computed({
            get: () => props.data.amount,
            set: amount => emit("event-edit", { index: props.idx, item: { ...props.data, amount }})
        })
        const paid_at = computed({
            get: () => props.data.paid_at,
            set: paid_at => emit("event-edit", { index: props.idx, item: { ...props.data, paid_at }})
        })

        watch(() => wasPaid.value, wasPaid => wasPaid && input_amount.value.setFocus(), { flush: "post"})

        return {
            wasPaid,
            forecast_amount,
            amount,
            paid_at,
            input_amount
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: 'title date checkbox forecast_amount paid_at amount';
        grid-template-columns: 120px 70px 120px repeat(3,160px);
        grid-template-rows: auto;
        gap: 20px;
        color: gray;
        position: relative;

        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: dashed 1px gray;

        &:last-child{
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0 ;
        }
    }
    .title{
        grid-area: title;
        font-size: 1.7em;
        align-self: center;
    }
    .date{
        grid-area: date;
        font-size: 1.7em;
        color: gray;
        align-self: center;
    }
    .checkbox{ grid-area: checkbox; }
    .forecast_amount{ grid-area: forecast_amount; }
    .paid_at{ grid-area: paid_at; }

    :deep(.label){
        position: absolute;
        top: -24px;
    }
    .input{
        height: 36px;
    }
</style>