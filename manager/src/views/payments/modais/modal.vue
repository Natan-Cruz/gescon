<template>
    <Modal @close-modal="$emit('close-modal')">
        <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchTransactionDetails" :position_relative="true"/>

        <ul class="_ctn_" v-if="state.transaction.id">
            <item label="ID da transação" :value="state.transaction.id"/>
            <item label="Movimentação" :value="formatCurrency(state.transaction.amount)"/>
            <item label="Data e hora" :value="formatDate(state.transaction.created_at)"/>
            <item label="Moeda" :value="state.transaction.currency"/>                
            <item label="Tipo" :value="transactionType"/>

            <template v-if="(state.transaction.items && state.transaction.items.length)">
                <p class="sub-title">Cobranças:</p>
                <ul v-for="billing in state.transaction.items" :key="billing.id" class="billings">
                    <item-billing label="Descrição" :value="billing.description" />
                    <item-billing label="Preço" :value="formatCurrency(billing.value)"/>
                </ul>
            </template>
        </ul>
    </Modal>
</template>

<script>
import item from "./item"
import itemBilling from "./itemBilling.vue"

import dayjs from "dayjs"
import { formatCurrency } from "@/Utils/index.js"
import { computed, reactive } from 'vue';
import axios from "@/services/api";

export default {
    props: {
        transactionId: String
    },
    components: { 
        item,
        itemBilling
    },
    setup(props){
        const state = reactive({ transaction: {}, isLoading: false, error: "" })

        const transactionType = computed(() => (state.transaction.type === "incoming") ? "Entrada" : "Saida")

        fetchTransactionDetails()
        async function fetchTransactionDetails(){
            
            const url = `/payments/transaction/details/${ props.transactionId }`

            state.isLoading = true;
            state.error = "";
            try {
                const { data } = await axios.get(url)
                state.transaction = data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        function formatDate(date){
            return dayjs(date).format("DD/MM/YYYY [às] hh:mm [hrs]")
        }

        return {
            state,
            transactionType,
            // 
            formatCurrency,
            formatDate,
            fetchTransactionDetails
        }
    },
}
</script>
<style lang="less" scoped>
    .sub-title{
        font-size: 1.7em;
        font-weight: bold;
        margin: 12px 0
    }
</style>