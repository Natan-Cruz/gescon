<template>
    <ul class="list-info">
        <li>
            <span class="key">Ganhos brutos:</span>
            <span class="value">{{ formatCurrency(grossEarnings)  }}</span>
        </li>
        <li>
            <span class="key">Descontos:</span>
            <span class="value">-{{ formatCurrency(totalDiscounts) }}</span>
        </li>
        <li>
            <span class="key">Ganhos líquidos:</span>
            <span class="value">{{ formatCurrency(netEarnings) }}</span>
        </li>
        <li>
            <span class="key">Formas de pagamentos</span>
            <ul class="list-payment-methods">
                <li v-for="payment_method in payment_methods" :key="payment_method.id" >
                    {{ payment_method.payment_method }} - {{ payment_method.description }}
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
import { computed } from 'vue'
import { formatCurrency } from "@/Utils/index.js"

export default {
    props: {
        gains: Array,
        discounts: Array,
        payment_methods: Array
    }, 
    setup(props){
        function calcAmount(acc, cur){
            acc += parseFloat(cur.value) || 0
            return acc
        }

        const grossEarnings = computed(() => {
            if(!props.gains || !props.gains.length) return 0

            return props.gains.reduce(calcAmount, 0)
        })
        
        const totalDiscounts = computed(() => {
            if(!props.discounts || !props.discounts.length)
                return 0;

            return props.discounts.reduce(calcAmount, 0)
        })

        const netEarnings = computed(() => {
            const earnings = grossEarnings.value || 0;
            const discounts = totalDiscounts.value || 0
            return earnings - discounts
        })

        return {
            grossEarnings,
            totalDiscounts,
            netEarnings,
            // 
            formatCurrency
        }
    }
}
</script>

<style lang="less" scoped>
    .list-info{
        span{
            font-size: 1.5em;
        }
        & > li{
            border-bottom: dashed 1px gray;
            padding: 4px 0 ;
        }
    }
    .key{
        color: rgb(44, 44, 44);
        font-weight: bold;
        display: block;
        margin: 3px 0;
    }
    // 
    .list-payment-methods{
        li{
            font-size: 1.5em;
            list-style-type: disc;
            margin-left: 24px;
        }
    }
</style>