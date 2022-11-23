<template>
    <form-page linkBack="/main/bank-reconciliations" :config="config">

        <expandable-content class="margin-bottom" title="Carregar arquivo OFX" :defaultOpen="false" >
            <wrapper-load-OFX @result="handleOFX"/>
        </expandable-content>

        <expandable-content class="margin-bottom" title="Informacoes" :defaultOpen="true" >
            <wrapper-informations @event-fetch-transactions="fetchTransactions"/>
        </expandable-content>

        <expandable-content class="margin-bottom" title="" :defaultOpen="true" :excludeLabel="true">
            <wrapper-transactions :transactions="transactions" @set="items = $event"/>
        </expandable-content>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue";
import { useStore } from "@/components/formPage/store.js";
import expandableContent from "./components/expandableContent.vue";

import wrapperLoadOFX from "./wrappers/loadOFX.vue"
import wrapperInformations from "./wrappers/informations.vue"
import wrapperTransactions from "./wrappers/transactions.vue"
import { ref, toRef } from 'vue';
import { extractDataXml } from "./utils"
// import dayjs from "dayjs"
import axios from "@/services/api"

export default {
    name: "index-form-bank-account",
    components:{
        formPage,
        expandableContent,
        wrapperLoadOFX,
        wrapperInformations,
        wrapperTransactions
    },
    setup(){
        const store = useStore()
        store.resetState()

        const config = {
            urls: {
                fetch: "/financial/bank/reconciliations/?",
                create: "/financial/bank/reconciliations",
                edit: "/financial/bank/reconciliations/?",
                delete: ""
            }
        }

        const items = toRef(store.form, "items")
        const transactions = ref({})
        transactions.value = { local: [], server: []}

        function handleOFX(xml){
            const data = extractDataXml(xml)

            store.$patch( state => {
                state.form.account_id = data.bank_number
                state.form.started_at = data.start_date
                state.form.ended_at = data.end_date
                state.form.closing_balance = data.closing_balance
                state.form.items = []
                transactions.value.local = data.ofx_transactions
            })

            fetchTransactions()
        }
        async function fetchTransactions(){
            try {
                const url = `/financial/bank/transactions?${ new URLSearchParams(store.form).toString() } `
                const { data } = await axios.get(url)
                transactions.value.server = data
            } catch (error) {
                console.error(error)
            }
        }

        return {
            config,
            transactions,
            items,
            // methods
            fetchTransactions,
            handleOFX
        }
    }
}
</script>
<style lang="less" scoped src="./style.less"></style>
<style lang="less" scoped>
    :deep(.margin-bottom){
        margin-bottom: 32px;
    }
</style>