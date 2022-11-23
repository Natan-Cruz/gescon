<template>
    <form-page-without-script :showFooter="false" :isLoading="state.isLoading" :error="state.error" @event-retry="fetchTransaction">

        <p class="transaction-id"># {{ state.transaction.id }}</p>

        <div class="ctn_flex">
            <div class="detail" :style="accountTypeStyles"></div>
            <h1 class="account-name">{{ state.transaction.name }}</h1>
            <span v-if="state.transaction.cost_center_name" class="cost-center-name"> - {{ state.transaction.cost_center_name }}</span>
        </div>

        <p class="account-description">{{ state.transaction.description }}</p>

        <div class="ctn_customer" v-if="state.transaction.customer_id">
            <p class="customer-name">{{ state.transaction.customer_name }}</p>
            <!-- <ul class="customer-infos">
                <li>{{ state.transaction.customer_email }}</li>
                <li>{{ state.transaction.customer_commercial_phone }}</li>
                <li>{{ state.transaction.customer_cellphone }}</li>
            </ul> -->
            <router-link :to="routeLinkOptions" class="button button-tertiary link">Consultar cliente</router-link>
        </div>

        <div class="informations">
            <row label="Status" :width="widthRow">
                {{ computedValues.status }}
            </row>
            <row label="Método de pagamento" :width="widthRow" :without="!state.transaction.payment_method" without_text="Não definido">
                {{ state.transaction.payment_method }}
            </row>
            <row label="Frequência" :width="widthRow">
                {{ accountFrequency }}
            </row>
            <row v-if="state.transaction.installment" label="Parcela" :width="widthRow">
                {{ state.transaction.installment }}
            </row>
            <row v-if="state.transaction.paid_at" label="Data de pagamento" :width="widthRow">
                {{ formatDate(state.transaction.paid_at) }}
            </row>
            <row label="Data de vencimento" :width="widthRow">
                {{ formatDate(state.transaction.due_date) }}
            </row>
            <row label="Valor original" :width="widthRow">
                {{ formatCurrency(state.transaction.forecast_amount) }}
            </row>
            <row v-if="state.transaction.amount" :label="computedValues.labelAmount" :width="widthRow">
                {{ formatCurrency(state.transaction.amount) }}
            </row>
            <row label="Correções" :width="widthRow">
                {{ formatCurrency(state.transaction.corrections) }}
            </row>
            <row label="Multa" :width="widthRow">
                {{ formatCurrency(state.transaction.fees) }}
            </row>
            <row label="Juros" :width="widthRow">
                {{ formatCurrency(state.transaction.fine) }}
            </row>
             <row label="Total" :width="widthRow">
                {{ formatCurrency((fNumber(state.transaction.amount) || fNumber(state.transaction.forecast_amount)) + fNumber(state.transaction.corrections) + fNumber(state.transaction.fees) + fNumber(state.transaction.fine)) }}
            </row>
            
        </div>

        <template v-if="state.transaction.bank_slips && state.transaction.bank_slips.length">
            <p class="sub-title">Boletos</p>
            <ul>
                <bank-slip-item 
                    v-for="slip in state.transaction.bank_slips" 
                    :key="slip.id"
                    :slip="slip" />
            </ul>
        </template>

    </form-page-without-script>
</template>

<script>
import formPageWithoutScript from "@/components/formPage/formPageWithoutScript.vue"
import row from "./row.vue"
import bankSlipItem from "./bankSlipItem.vue"
// modals
// scripts
import { formatDate, formatCurrency } from "@/Utils/index.js"
import { computed, reactive } from 'vue'
import axios from "@/services/api"
import { useRoute, useRouter } from "vue-router";
import { fnFrequency, setStyle, setValues } from "./utils"


export default {
    components: { formPageWithoutScript, row, bankSlipItem },
    setup(){
        const $route = useRoute();
        const $router = useRouter();
        const state = reactive({ 
            isLoading: false, 
            error: "", 
            transaction: {}, 
        })
        const routeLinkOptions = computed(() => ({
            name: 'registrations/form_entity', 
            params: { id: state.transaction.customer_id }, 
            query: { previous: $route.fullPath }
        }))

        const computedValues = computed(() => setValues(state.transaction))
        const accountTypeStyles = computed(() => setStyle(state.transaction))
        const accountFrequency = computed(() => fnFrequency(state.transaction.frequency))


        async function fetchTransaction(){
            const url = `/financial/bank/transactions/${ $route.params.id }/show`;

            state.isLoading = true;
            state.error = ""
            try {
                const { data } = await axios.get(url);
                state.transaction = data;
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        fetchTransaction()

        function handlePushForm(){
            $router.push({ 
                name: 'registrations/form_financial', 
                params: { id: state.transaction.id }, 
                query: { previous: $route.fullPath } 
            })
        }

        function fNumber(strNumber){
            if(!strNumber) return 0
            return parseFloat(strNumber)
        }
       
        return {
            state,
            computedValues,
            accountTypeStyles,
            routeLinkOptions,
            accountFrequency,
            widthRow: 170,
            // methods
            fetchTransaction,
            formatDate,
            formatCurrency,
            handlePushForm,
            fNumber
        }
    }
}
</script>

<style lang="less" scoped>
    .transaction-id{
        font-weight: bold;
        color: gray;
        margin-bottom: 12px;
        font-size: 1.6em;
    }
    .ctn_flex{
        display: flex;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;

        min-height: 40px;

        position: relative;
        padding-left: 15px;
    }
    .detail{
        display: block;
        width: 8px;
        height: 100%;
        margin-right: 12px;

        position: absolute;
        top: 0;
        left: 0;
    }
  
    .account-name{
        font-size: 2.4em
    }
    .cost-center-name{
        color: gray;
        font-size: 1.8em;
        margin-left: 8px;
    }

    .informations{
        margin-top: 12px;
    }


    .account-description{
        font-size: 1.6em;
        color: gray;
        margin-top: 10px;
    }

    .ctn_customer{
        cursor: default;
        margin: 12px 0 12px 0;
        padding-bottom: 12px;
        border-bottom: dashed 1px rgb(197, 197, 197)
    }
    .customer-name{
        font-size: 1.7em;
        color: rgb(73, 73, 73);
        cursor: default;
    }
    .customer-infos{
        li{
            font-size: 1.5em;
            color: gray;
            display: inline-block;
            position: relative;
            padding-left: 8px;
            margin-right: 15px;

            &::before{
                content: "";
                display: block;
                position: absolute;
                left: 0;
                top: 8px;
                border-radius: 5px;
                background-color: gray;
                width: 4px;
                height: 4px;
            }
        }
    }


    .link{
        display: block;
        height: auto;
        width: auto;
        margin-top: 4px;
        font-size: 1.5em;
    }
    .sub-title{
        font-size: 1.6em;
        font-weight: bold;
        margin: 12px 0;
        color: rgb(65, 65, 65);
    }
</style>