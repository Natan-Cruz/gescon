<template>
    <div style="height: 100%">
        <page-with-filters
            :showPrintOutButton="true"
            :showButtonClearFilter="showButtonClearFilter"
            contentStyle="background-color: #fff;box-shadow: 0 0 5px rgba(0, 0, 0, .2);"
            @submit="handleSubmit" 
            @search="stateFilters.search = $event; handleSubmit()" 
            @set-filters-by-url-query="handleSetFiltersByUrlQuery"
            @clear-filters="handleResetFilters">

            <template v-slot:popup_content="{ hide }">
                <p class="p_title">Exportar dados</p>
                <p class="p_item" @click="handlePrintOut(); hide()">Imprimir {{ hasSelectedItems ? "(Selecionados)" : "" }}</p>

                <template v-if="isBillsToReceive && accountsGeneratePayments.length">
                    <p class="p_title">Ações</p>
                    <p class="p_item" @click="handleOpenModalGeneratePayments(); hide()">Gerar e enviar boletos</p>
                </template>
            </template>

            <template v-slot:content>
                <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetch" />
                
                <content-component 
                    v-if="!state.isLoading && !state.error"
                    :data="stateData" 
                    :account_type="account_type" 
                    :headerDateLabel="headerDateLabel"
                    :sortPreferences="sortPreferences"
                    @select-account="handleSelectAccount('registrations/show_financial', $event)"
                    @event-toggle-item="handleToggleItem"
                    @open-modal-fast-access="handleOpenModal"
                    @delete-account="handleDeleteAccount"
                    @event-sort-column="handleSortColumn"
                    @select-all="handleSelectAll">
                </content-component>
            </template>

            <template v-slot:filters>
                <filters :account_type="account_type" :filters="stateFilters" />
            </template>

            <template v-slot:button-circle>
                <button-circle v-can="permissionName" @click="handleSelectAccount('registrations/form_financial')"/>
            </template>

        </page-with-filters>

        <modal v-if="state.modalIsShow" 
            :account="state.accountSelected"
            :showArrowLeft="showArrowLeft"
            :showArrowRight="showArrowRight"
            @close-modal="handleCloseModal" 
            @previous="handlePrevious" 
            @next="handleNext" 
            @update-account="handleUpdateAccount"
            @remove-account="handleRemoveAccount"
            @print-receipt="handlePrintOutReceipt">
        </modal>

        <modal-generate-payments 
            v-if="state.modalGeneratePaymentsIsShow"
            :accounts="accountsGeneratePayments"
            @close-modal="handleCloseModalGeneratePayments"
            @success="handleSetBankSlips" />

        <print-out-module 
            ref="print_out_module" 
            :headerDateLabel="headerDateLabel" 
            :account_type="account_type" 
            :accounts="accountsPrintOut" 
            :start_date="stateFilters.start_date" 
            :end_date="stateFilters.end_date">
        </print-out-module>

        <modal-receipt-module :account="state.accountSelected" ref="print_receipt_module"/>
    </div>
</template>

<script>
// global components
import pageWithFilters from "@/components/pageWithFilters/pageWithFilters.vue"
import buttonCircle from "@/components/buttons/buttonCircle.vue"

// local components
import filters from "./components/filters.vue"
import contentComponent from "./components/content.vue"
import printOutModule from "./components/printOutModule.vue"
import modalReceiptModule from "./components/receiptModule.vue"

// modal
import modal from "./modal/quickAccess.vue";
import modalGeneratePayments from "./modal/generatePayments.vue";

import { reactive, ref, watch, computed } from 'vue'
import axios from "@/services/api"
import { useStore as useStoreHistory } from "@/store/history"
import { useRouter, useRoute } from "vue-router";
import { notify } from '@kyvg/vue3-notification'
import dayjs from 'dayjs'
import { dynamicSort } from "./utils.js"


export default {
    props: { account_type: String, permissionName: String },
    components: {
        pageWithFilters,
        buttonCircle,
        modalReceiptModule,
        // 
        filters,
        contentComponent,
        // 
        modal,
        printOutModule,
        modalGeneratePayments
    },
    setup(props){
        const $router = useRouter();
        const $route = useRoute();
        const history = useStoreHistory();

        const state = reactive({ 
            isLoading: false, 
            error: "", 
            data: [], 
            modalIsShow: false, 
            accountSelected: {}, 
            modalGeneratePaymentsIsShow: false
        })
        const sortPreferences = reactive({ columnName: "", sortOrder: 0 })

        // state filters
        const initialState = {
            start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
            end_date: dayjs().endOf("month").format("YYYY-MM-DD")
        }
        const stateFilters = reactive({ ...initialState })

        const print_out_module = ref(null);
        const print_receipt_module = ref(null)

        const headerDateLabel = computed(() => {
            let label;
            switch(props.account_type){
                case "bills_to_pay": label = "Data de venc."; break
                case "bills_to_receive": label = "Data de venc."; break
                case "paid_bills": label = "Data de pagamento"; break
                case "accounts_received": label = "Data de rec."; break
            }
            return label
        })
        const showArrowLeft = computed(() => state.data.findIndex( elem => elem.id === state.accountSelected.id) > 0)
        const showArrowRight = computed(() => state.data.findIndex( elem => elem.id === state.accountSelected.id) < (state.data.length - 1) )
        const showButtonClearFilter = computed(() => JSON.stringify(stateFilters) !== JSON.stringify(initialState))

        const isBillsToReceive = computed(() => props.account_type === "bills_to_receive")
        const hasSelectedItems = computed(() => state.data.findIndex( itm => itm.isChecked === true ) > -1)
        const accountsPrintOut = computed(() => {
            const data = state.data.filter( trx => trx.isChecked ) 
            return data.length ? data : state.data
        })
        const accountsGeneratePayments = computed(() => {
            return state.data.filter( trx => trx.isChecked && !trx.slip_id) 
        })

        watch(() => $route.name, routeName => {
            if(routeName.startsWith("financial")) setTimeout(handleResetFilters, 120)
        });


        async function fetch(){
            state.isLoading = true;
            state.error = "";
            state.data = [];

            let defaultQuery;
            switch(props.account_type){
                case "bills_to_pay":
                    defaultQuery = { type: "outflow", payment_state: "2" };
                    break
                case "paid_bills":
                    defaultQuery = { type: "outflow", payment_state: "1" };
                    break
                case "bills_to_receive":
                    defaultQuery = { type: "inflow", payment_state: "2" };
                    break
                case "accounts_received":
                    defaultQuery = { type: "inflow", payment_state: "1" };
                    break
            }
            
            const urlQuery = new URLSearchParams({ ...stateFilters, ...defaultQuery }).toString()

            try {
                const { data } = await axios.get("/accounting?" + urlQuery)
                state.data = data;
                // handleOpenModalGeneratePayments()
            } 
            catch (error) { state.error = error } 
            finally { state.isLoading = false }
        }
        
        function handleSetFiltersByUrlQuery(query){
            if(query){
                Object.entries(query).forEach(([ key, value ]) => {
                    stateFilters[key] = value;
                })
            }else{
                const yearStartDate = dayjs().startOf("month").format("YYYY-MM-DD");
                const yearEndDate = dayjs().endOf("month").format("YYYY-MM-DD");

                stateFilters.start_date = yearStartDate;
                stateFilters.end_date = yearEndDate;
            }

        }

        function loadSortPreferences(){
            const sort = localStorage.getItem($route.name + '-sort-table-account')
            if(sort){
                const { columnName, sortOrder } = JSON.parse(sort)
                sortPreferences.columnName = columnName;
                sortPreferences.sortOrder = sortOrder
            }
        }
        function handleSortColumn(columnName){
            if(!sortPreferences.columnName && !sortPreferences.sortOrder){

                sortPreferences.columnName = columnName
                sortPreferences.sortOrder = 1
            }
            else
            if(sortPreferences.columnName === columnName) {
                if(sortPreferences.sortOrder === 1)
                    sortPreferences.sortOrder = -1
                else
                if(sortPreferences.sortOrder === -1)
                    sortPreferences.sortOrder = 0
                else
                if(sortPreferences.sortOrder === 0)
                    sortPreferences.sortOrder = 1
            }
            else {
                sortPreferences.columnName = columnName
                sortPreferences.sortOrder = 1
            }

            localStorage.setItem($route.name + '-sort-table-account', JSON.stringify(sortPreferences))
        }

        const stateData = computed(() => {
            if(sortPreferences.columnName)
                return state.data.slice().sort(dynamicSort(sortPreferences.columnName, sortPreferences.sortOrder))

            return state.data
        })

        function handleSubmit(){
            $router.replace({ query: stateFilters })
            fetch();
            loadSortPreferences()
        }
       
        function handleSelectAccount(routeName, account_id){
            let type, wasPaid;
            switch(props.account_type){
                case "bills_to_pay": type = "outflow"; break
                case "bills_to_receive": type = "inflow"; break
                case "paid_bills": type = "outflow"; wasPaid = "1"; break
                case "accounts_received": type = "inflow"; wasPaid = "1"; break
            }
            $router.push({ 
                name: routeName, 
                params: { 
                    id: account_id 
                }, 
                query: { 
                    previous: $route.fullPath,
                    type, 
                    wasPaid
                } 
            })
        }

        function handleResetFilters(){
            Object.entries(stateFilters).forEach(([key]) => {
                if(initialState[key])
                    stateFilters[key] = initialState[key]
                else
                    delete stateFilters[key]
            })
            handleSubmit()
        }

        function handlePrintOut(){
            print_out_module.value.printOut()
        }
        function handlePrintOutReceipt(){
            print_receipt_module.value.printOut()
        }


        // modal 
        function handleOpenModal(account){
            // console.log(account)
            history.push({ name: "modal_fast_access", fn: handleCloseModal })
            state.modalIsShow = true;
            state.accountSelected = account;
        }

        function handleCloseModal(){
            history.remove("modal_fast_access")
            state.modalIsShow = false;
            state.accountSelected = {}
        }

        function handlePrevious(){
            if(!state.accountSelected) return;

            const index = state.data.findIndex( elem => elem.id === state.accountSelected.id)

            if(index === 0) return

            const newAccountSelected = state.data[index - 1]
            if(newAccountSelected)
                state.accountSelected = newAccountSelected
        }

        function handleNext(){
            if(!state.accountSelected) return;

            const index = state.data.findIndex( elem => elem.id === state.accountSelected.id)

            if(index === state.data.length - 1) return

            const newAccountSelected = state.data[index + 1]
            if(newAccountSelected)
                state.accountSelected = newAccountSelected
        }
        function handleUpdateAccount(account){
            const index = state.data.findIndex( elem => elem.id === account.id)
            if(index > -1)
                state.data.splice(index, 1, account)
        }

        function handleRemoveAccount(account_id){
            const index = state.data.findIndex( elem => elem.id === account_id )
            if(index > -1)
                state.data.splice(index, 1)
        }
        // modal generate payments
        function handleOpenModalGeneratePayments(){
            history.push({ name: "modal_generate_payments", fn: handleCloseModalGeneratePayments })
            state.modalGeneratePaymentsIsShow = true;
        }


        function handleCloseModalGeneratePayments(){
            history.remove("modal_generate_payments")
            state.modalGeneratePaymentsIsShow = false;
        }

        function handleSetBankSlips(bank_slips){
            state.data = state.data.map( trx => {
                const bankSlip = bank_slips.find( itm => itm.transaction_id === trx.id )
                if(bankSlip)
                    trx.bank_slip = bankSlip;

                trx.isChecked = false
                return trx
            })
        }

        async function handleDeleteAccount(account_id){
            try {
                await axios.delete("/accounting/" + account_id)
                notify({
                    title: "Conta deletada!",
                    type: "success",
                    duration: 5000
                })

                const index = state.data.findIndex( elem => elem.id === account_id)
                state.data.splice(index, 1)
            } catch (error) {
                console.error(error);
                notify({
                    title: "Erro ao deletar conta!",
                    type: "error",
                    duration: 5000
                })
            }
        }

        function handleToggleItem({ id, isChecked }){
            const index = state.data.findIndex( itm => itm.id === id)
            const itemAccount = state.data.find( itm => itm.id === id)
            if(index === -1 || !itemAccount) return;
            state.data.splice(index, 1, { ...itemAccount, isChecked })
        }

        function handleSelectAll(isChecked){
            state.data = state.data.map( trx => {
                trx.isChecked = isChecked;
                return trx
            })
        }

        return {
            headerDateLabel,
            showButtonClearFilter,
            showArrowLeft,
            showArrowRight,
            hasSelectedItems,
            // 
            isBillsToReceive,
            accountsPrintOut,
            accountsGeneratePayments,
            // states
            state,
            stateFilters,
            sortPreferences,
            stateData,
            // refs
            print_out_module,
            print_receipt_module,
            // methods
            fetch,
            handleSelectAccount,
            handleDeleteAccount,
            handlePrintOut,
            handlePrintOutReceipt,
            // methods initial
            handleSetFiltersByUrlQuery,
            handleSubmit,
            // modal account quick access
            handleOpenModal,
            handleCloseModal,
            handlePrevious,
            handleNext,
            handleUpdateAccount,
            handleRemoveAccount,
            // modal generate payments
            handleOpenModalGeneratePayments,
            handleCloseModalGeneratePayments,
            handleSetBankSlips,
            // methods header
            loadSortPreferences,
            handleSortColumn,
            handleResetFilters,
            // payments
            handleToggleItem,
            handleSelectAll
        }
    }
}
</script>