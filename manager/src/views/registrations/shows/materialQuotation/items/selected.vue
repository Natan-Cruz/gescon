<template>
    <div>
        <p class="provider-name">{{ mQuotation.provider_name }}</p>
        <ul >
            <li class="item">
                <p class="material_name">Frete</p>
                <p class="total"><span class="sub-text bold">Total:</span> {{ formatCurrency(mQuotation.freight_cost) }}</p>
            </li>
            <li class="item" v-for="item in mQuotation.items" :key="item.id">
                <p class="material_name">{{ item.material_name }}</p>
                <p class="total"><span class="sub-text bold">Total:</span> {{ formatCurrency(item.quantity * item.unitary_value) }}</p>
            </li>
            <li class="item">
                <p class="material_name"></p>
                <p class="total"><span class="sub-text bold">Total:</span> {{ sum_total }}</p>
            </li>
        </ul>

    </div>
</template>

<script>
import { formatCurrency } from "@/Utils/index.js";
import { computed } from 'vue';

export default {
    props: { mQuotation: Object },
    setup(props){
        const sum_total = computed(() => {
            let value = props.mQuotation.items.reduce((acc, cur) => {
                acc += parseFloat(cur.quantity) * parseFloat(cur.unitary_value)
                return acc
            }, 0)

            if(props.mQuotation.freight_cost)
                value += parseFloat(props.mQuotation.freight_cost)

            return formatCurrency(value)
        })

        return { sum_total, formatCurrency }
    }
}
</script>

<style lang="less" scoped>
    .provider-name{
        font-size: 1.8em;
        font-weight: bold;

        margin-bottom: 12px;
    }

    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: "material_name total";
        grid-template-columns: 3fr 1fr;
        grid-template-rows: auto;
        column-gap: 20px;

        border-bottom: dashed 1px gray;
        margin-bottom: 12px;
        padding-bottom: 12px;
        padding-left: 12px;
        position: relative;

        &:last-child{
            border-bottom: none;
        }

        p{
            font-size: 1.5em;
        }
    }

    .material_name{ grid-area: material_name; align-self: center; }
    .unity{ grid-area: unity; align-self: center;}
    .total{ grid-area: total; align-self: center; white-space: nowrap; }
</style>