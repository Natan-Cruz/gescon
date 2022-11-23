<template>
    <div class="container-scroll">
        <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchPaymentsInformations"/>
        
        <template v-if="state.data">
            <balance :informations="state.data.informations"/>

            <modules-contracted-company :modules="state.data.modules_contracted_company" />

            <modules-contracted-constructions :billings="state.data.modules_contracted_construction" />

            <historical-payments :transactions="state.data.transactions" @select-transaction="openModal"/>
        </template>
        <modal-transaction-details v-if="state.modalIsShow" :transactionId="state.transactionId" @close-modal="closeModal"/>
    </div>
</template>

<script>
import balance from "./wrappers/balance.vue";
import modulesContractedConstructions from "./wrappers/modulesContractedConstructions.vue"
import modulesContractedCompany from "./wrappers/modulesContractedCompany.vue"
import historicalPayments from "./wrappers/historicalPayments.vue";

import ModalTransactionDetails from './modais/modal.vue';

import { reactive } from 'vue';
import axios from "@/services/api"
import { useStore as useStoreHistory } from "@/store/history.js"

export default {
    name: "payments",
    components: {
        balance,
        modulesContractedCompany,
        modulesContractedConstructions,
        historicalPayments,
        ModalTransactionDetails,
    },
    setup(){
        const history = useStoreHistory()
        const state = reactive({ data: undefined, isLoading: false, error: "", modalIsShow: false, transactionId: undefined })

        fetchPaymentsInformations();

        async function fetchPaymentsInformations(){
            state.isLoading = true
            state.error = "";
            state.data = undefined;
            try {
                const { data } = await axios.get("/payments/informations")
                state.data = data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        function openModal(transaction_id){
            state.modalIsShow = true;
            state.transactionId = transaction_id
            history.push({ name: "modal_transaction_details", fn: closeModal })
        }

        function closeModal(){
            state.modalIsShow = false;
            history.remove("modal_transaction_details")            
        }

        return {
            state,
            // methods
            fetchPaymentsInformations,
            openModal,
            closeModal
        }
    }
}
</script>
<style lang="less" scoped>
    .container-scroll{
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden auto;
    }
    .wrapper{
        width: 100%;
        max-width: 1000px;
        margin-bottom: 24px;
        
        box-shadow: 1px 1px 6px rgba(168, 168, 168, 0.3);
        border: solid 1px rgb(212, 212, 212);
        border-radius: 5px;
        background-color: #fff;
        padding: 10px;
        overflow: hidden auto;
        
        &:last-child{
            margin-bottom: 0;
        }
    }
    :deep(.title){
        font-size: 1.7em;
        line-height: 1em;
        font-weight: bold;
        margin-bottom: 18px;
    }
    :deep(.list-modules){
        width: 100%;
        position: relative;
        display:grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        grid-template-rows: auto;
        row-gap: 30px;
        column-gap: 20px;
    }
</style>