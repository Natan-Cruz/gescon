<template>
    <div class="content-width">
        <ul>
            <item-account-header 
                :classGrid="classGrid" 
                :headerDateLabel="headerDateLabel" 
                :sortPreferences="sortPreferences"
                @event-sort-column="$emit('event-sort-column', $event)"
                @select-all="$emit('select-all', $event)">
            </item-account-header>

            <item-account v-for="account in data" 
                :account="account" :key="account.id"
                :classGrid="classGrid"
                :account_type="account_type"
                @select-account="$emit('select-account', $event)" 
                @open-modal-fast-access="$emit('open-modal-fast-access', $event)"
                @delete-account="$emit('delete-account', $event)"
                @event-toggle-item="$emit('event-toggle-item', $event)">
            </item-account>
        </ul>

        <div v-if="data.length" class="total-financial-information">
            <div class="row">
                <span class="key">{{ title }}</span>
                <div>
                    <div class="value" :style="valueColor">{{ formatCurrency(total_sum) }}</div>
                    <div class="value" v-show="total_sum !== total_sum_with_fines_and_corrections" :style="valueColor">{{ formatCurrency(total_sum_with_fines_and_corrections) }}</div>
                </div>
            </div>
        </div>
        <p v-else class="without-item">Nenhum item</p>
    </div>
   
</template>

<script>
import itemAccountHeader from "../items/itemAccountHeader.vue"
import itemAccount from "../items/itemAccount.vue"

import { formatCurrency } from "@/Utils/index.js"
import { computed, ref } from 'vue'
import { fNumber } from '../utils'

export default {
    components: {
        itemAccountHeader,
        itemAccount
    },
    props: {
        data: {
            type: Array,
            required: true,
            default: () => []
        },
        account_type: String,
        headerDateLabel: String,
        sortPreferences: Object
    },
    setup(props){
        const valueColor = ref("")
        const title = ref("")

        const classGrid = computed(() => {
            let cls;
            switch(props.account_type){
                case "bills_to_pay": case "bills_to_receive": cls = "forecast_accounts"; break
                case "paid_bills": case "accounts_received": cls = "realized_accounts"; break
            }
            return cls
        })

        const total_sum = computed(() => {
            const total = props.data.reduce((acc, cur) => {
                const { amount, forecast_amount } = cur
                acc += fNumber(amount) || fNumber(forecast_amount)
                return acc
            }, 0)
            return total

        })

        const total_sum_with_fines_and_corrections = computed(() => {
            const total = props.data.reduce((acc, cur) => {
                const { amount, forecast_amount, payment_fine, readjustment } = cur;
                acc += (fNumber(amount) || fNumber(forecast_amount)) + fNumber(payment_fine) + fNumber(readjustment)
                return acc
            }, 0)

            return total
        })

        switch(props.account_type){
            case "bills_to_pay": 
                valueColor.value = "color: #F51720";
                title.value = "Total a pagar:";
                break
            case "paid_bills":
                valueColor.value = "color: #F51720";
                title.value = "Total pago:";
                break
            case "bills_to_receive": 
                valueColor.value = "color: #287928"
                title.value = "Total a receber:";
                break
            case "accounts_received": 
                valueColor.value = "color: #287928";
                title.value = "Total recebido:"
                break
        }

        return {
            classGrid,
            total_sum,
            total_sum_with_fines_and_corrections,
            valueColor,
            title,
            // methods
            formatCurrency
        }

    }
}
</script>


<style lang="less" scoped>
    .content-width{
        width: min-content;
        min-width: 100%;
    }
    .total-financial-information{
        padding: 30px 20px;
    }
    .row{
        display: flex;
        justify-content: left;
        align-items: flex-start;
    }
    .key{
        grid-area: key;
        font-weight: bold;
        margin-right: 12px;
        font-size: 2em;
        color: rgb(44, 44, 44);
    }
    .value{
        grid-area: value;
        font-weight: bold;
        font-size: 1.8em;
    }
</style>