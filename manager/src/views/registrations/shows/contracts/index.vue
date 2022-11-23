<template>
    <form-page-without-script :showFooter="false" :isLoading="state.isLoading" :error="state.error" @event-retry="fetchContract">
        <row label="ID do contrato" :value="state.contract.id"></row>
        <row label="Tipo do contrato" :value="typeContract"></row>
        <row label="Status do contrato" :value="statusContract"></row>
        <row label="Nome do cliente" :value="state.contract.customer_name">
            <router-link :to="{ name: 'registrations/form_entity', params: { id: state.contract.customer_id }, query: { previous: $route.fullPath }}" class="button button-tertiary text-medium link">Consultar cliente</router-link>
        </row>
        <row label="Ativo" :value="state.contract.asset_name">
            <router-link :to="{ name: 'registrations/form_asset', params: { id: state.contract.asset_id }, query: { previous: $route.fullPath }}" class="button button-tertiary text-medium link">Consultar ativo</router-link>
        </row>

        <p class="sub-title">Ações</p>
        <div class="ctn-buttons">
            <button :disabled="showButtonCancelContract" class="button-action no_highlights" @click="handlePushForm">Editar</button>
            <button :disabled="showButtonCancelContract" class="button-action no_highlights" @click="handleOpenModalCancelContract">Distratar</button>
        </div>

        <div class="sub-header">
            <p class="sub-title">Parcelas e pagamentos</p>
            <button class="button-print-out" @click="handlePrintOut">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M16 8V5H8v3H6V3h12v5ZM4 10h16H6Zm14 2.5q.425 0 .712-.288.288-.287.288-.712t-.288-.713Q18.425 10.5 18 10.5t-.712.287Q17 11.075 17 11.5t.288.712q.287.288.712.288ZM16 19v-4H8v4Zm2 2H6v-4H2v-6q0-1.275.875-2.137Q3.75 8 5 8h14q1.275 0 2.138.863Q22 9.725 22 11v6h-4Zm2-6v-4q0-.425-.288-.713Q19.425 10 19 10H5q-.425 0-.713.287Q4 10.575 4 11v4h2v-2h12v2Z"/></svg>
                <span>Imprimir</span>
            </button>
        </div>

        <table-component :installments="state.installments" :total="state.total"/>

        <print-out-module 
            ref="print_out_module" 
            :contract_customer_name="state.contract.customer_name" 
            :contract_asset_name="state.contract.asset_name" 
            :installments="state.installments" 
            :total="state.total"/>


        <modal-cancel-contract 
            v-if="state.cancelContractModalIsShow"
            :contract_id="state.contract.id"
            :contract_asset_cost_center="state.contract.asset_cost_center_id"
            @close-modal="handleCloseModalCancelContract"
            @success="fetchContract">
        </modal-cancel-contract>

    </form-page-without-script>
</template>

<script>
import formPageWithoutScript from "@/components/formPage/formPageWithoutScript.vue"
// import buttonRedirect from "@/components/formPage/formPageWithoutScript.vue"
import row from "@/components/row.vue"
import printOutModule from "./printOutModule.vue"
import tableComponent from "./tableComponent.vue"
// modals
import modalCancelContract from "./modal/cancelContract.vue"
// scripts
import { formatDate, formatCurrency } from "@/Utils/index.js"
import { reactive, ref, computed } from 'vue'
import axios from "@/services/api"
import { useStore as useStoreHistory } from "@/store/history"
import { useRoute, useRouter } from "vue-router";

export default {
    components: { formPageWithoutScript, row, printOutModule, modalCancelContract, tableComponent },
    setup(){
        const $route = useRoute();
        const $router = useRouter();
        const history = useStoreHistory();
        const state = reactive({ 
            isLoading: false, 
            error: "", 
            contract: {}, 
            installments: [], 
            total: { total: 0, receivable: 0, received: 0, receivablesWithCorrections: 0 },
            cancelContractModalIsShow: false
        })
        const print_out_module = ref(null);

        const typeContract = computed(() => {
            if(!state.contract.type) return ""

            const options = {
                rent: "Aluguel",
                sale: "Venda"
            }
            const type = options[state.contract.type]
            return  type || ""
        })

        const statusContract = computed(() => {
            if(!state.contract.status) return ""
            
            const options = {
                canceled_contract: "Contrato cancelado",
                active: "Contrato ativo",
                draft: "Contrato em rascunho"
            }
            const status = options[state.contract.status]
            return  status || ""
        })

        const showButtonTransferContract = computed(() => state.contract.type === 'sale' && state.contract.type !== "canceled_contract")
        const showButtonCancelContract = computed(() => state.contract.type === "canceled_contract")


        async function fetchContract(){
            const url = `/registrations/contracts/${ $route.params.id }/show`;

            state.isLoading = true;
            state.error = ""
            try {
                const { data } = await axios.get(url);

                const urlReceivable = `/accounting?start_date=&end_date=&cost_center=${ data.asset_cost_center_id }&type=inflow&payment_state=2`
                const urlReceived = `/accounting?start_date=&end_date=&cost_center=${ data.asset_cost_center_id }&type=inflow&payment_state=1`;

                const [ receivable, received ] = await Promise.all([
                    axios.get(urlReceivable),
                    axios.get(urlReceived),
                ])

                state.contract = data;
                state.installments = [ ...received.data, ...receivable.data ].sort((a,b) => new Date(a.due_date) - new Date(b.due_date))

                state.total.receivable = receivable.data.reduce(sum, 0)
                state.total.received = received.data.reduce(sum, 0)
                state.total.total = [ ...received.data, ...receivable.data ].reduce(sum, 0)
                state.total.receivablesWithCorrections = receivable.data.reduce(sumWithCorrections, 0)
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        function sum(acc, cur){
            const { amount , forecast_amount } = cur;
            acc += amount || forecast_amount
            return acc
        }

        function sumWithCorrections(acc, cur){
            const { amount , forecast_amount, payment_fine, readjustment } = cur;
            acc += (fNumber(amount) || fNumber(forecast_amount)) + fNumber(payment_fine) + fNumber(readjustment)
            return acc
        }

        function fNumber(strNumber){
            if(!strNumber) return 0
            return parseFloat(strNumber)
        }


        fetchContract()

        function handlePrintOut(){
            print_out_module.value.printOut()
        }

        function handlePushForm(){
            $router.push({ 
                name: 'registrations/form_contract', 
                params: { id: state.contract.id }, 
                query: { previous: $route.fullPath } 
            })
        }
        
        function handleOpenModalCancelContract(){
            history.push({ name: "modal_cancel_contract", fn: handleCloseModalCancelContract })
            state.cancelContractModalIsShow = true;
        }

        function handleCloseModalCancelContract(){
            history.remove("modal_cancel_contract")
            state.cancelContractModalIsShow = false;
        }

        return {
            state,
            print_out_module,
            typeContract,
            statusContract,
            showButtonTransferContract,
            showButtonCancelContract,
            // methods
            formatDate,
            formatCurrency,
            fetchContract,
            handlePrintOut,
            // actions
            handlePushForm,
            // modals
            handleOpenModalCancelContract,
            handleCloseModalCancelContract
        }
    }
}
</script>

<style lang="less" scoped>
    .link{
        justify-content: flex-start;
        height: auto;
        margin-top: 4px;
    }
    .ctn-buttons{
        margin-bottom: 12px;
    }
    .button-action{
        width: auto;
        height: auto;

        padding: 10px 12px;
        font-size: 1.7em;
        border-radius: 5px;
        border: none;
        background-color: rgb(197, 197, 197);
        color: rgb(31, 31, 31);

        margin-right: 16px;

        cursor: pointer;
        transition: 120ms;

        &:active{
            transform: scale(.8);
        }

        &:disabled{
            opacity: .6;
        }
    }

    .sub-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;

        width: 100%;
    }
    .sub-title{
        font-size: 1.7em;
        font-weight: bold;
        margin: 12px 0 16px 0;
    }
    .button-print-out{
        font-size: 1.7em;
        border-radius: 5px;
        padding: 4px 10px;
        border: solid 1px gray;

        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;

        span{
            font-size: 1em;
            margin-left: 8px;
        }
    }
</style>