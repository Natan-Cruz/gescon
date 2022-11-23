<template>
    <!-- name of transaction -->
    <wrapper-input label="Nome:" id="name" class="form_spacing_bottom" :error="errors.name">
        <input type="text" class="input input_error" id="name" v-model="name" :disabled="disabled" placeholder="Nome para identificar essa transação">
    </wrapper-input>
    
    <!-- anotations -->
    <wrapper-input label="Anotação ou descrição:" class="form_spacing_bottom">
        <textarea-autosize
            placeholder="Alguma descrição ou anotação, faça aqui... 🖊️"
            :minHeight="40"
            :maxLength="256"
            :maxHeight="300"
            v-model="description"
            :disabled="disabled">
        </textarea-autosize>
    </wrapper-input>

    <div class="form_row">
        <!-- chat account -->
        <wrapper-input label="Plano de contas:" :error="errors.chart_account_id">
            <input-suggest-list
                :url="chartAccountUrl"
                :options="{ key: 'id', displayName: 'long_description'}"
                placeholder="Selecione um plano de conta"
                v-model="chart_account_id" :disabled="disabled"/>
        </wrapper-input>

        <!-- bank account -->
        <wrapper-input label="Conta bancária:" :error="errors.account_id">
            <input-suggest-list
                url="/financial/bank/accounts"
                :options="{ key: 'id', displayName: 'name'}"
                placeholder="Selecione uma conta bancaria de destino"
                v-model="account_id" :disabled="disabled"/>
        </wrapper-input>
    </div>

    <div class="form_row">
        <wrapper-input label="Tipo:" :error="errors.type">
            <select class="select input_error" v-model="type" :disabled="disabled">
                <option value="inflow">Entrada</option>
                <option value="outflow">Saida</option>
            </select>
        </wrapper-input>

        <wrapper-input label="Centro de custos:" :class="{ 'hidden-field': showConfig.cost_center }" :error="errors.cost_center_id">
            <input-suggest-tree
                url="/financial/cost-center"
                :options="{ key: 'id', displayName: 'name'}"
                placeholder="Selecione um centro de custo"
                :url_search="false"
                v-model="cost_center_id" :disabled="disabled" >
            </input-suggest-tree>
        </wrapper-input>

        <wrapper-input label="Fornecedor ou cliente:" :class="{ 'hidden-field': showConfig.entity }">
            <!-- ['? - ?', 'name', 'role'] -->
            <input-suggest-list
                url="/registrations/all?non_grouped=1"
                :options="{ key: 'id', displayName: 'name' }"
                placeholder="Selecione um cliente, fornecedor ou empresa tercerizada"
                v-model="entity_id" :disabled="disabled">
            </input-suggest-list>

            <button-redirect v-if="!showConfig.entity" routeName="registrations/form_entity">Cadastrar novo fornecedor</button-redirect>
        </wrapper-input>
    </div>
    
    <div class="ctn_checkbox form_row">
        <checkbox label="Está pago?" v-model="wasPaid" :disabled="disabled || chargeInterest || hasRecurrence"/>
        <checkbox label="Cobrar juros" v-model="chargeInterest" :disabled="disabled || wasPaid"/>
        <checkbox  label="É recorrente" v-model="hasRecurrence" :disabled="disabled || wasPaid"/>
    </div>

    <div class="form_row">
        <!-- amount -->
        <wrapper-input  label="Valor esperado:" id="forcast_amount" :error="errors.forecast_amount">
            <input-money id="forecast_amount" class="input input_error" v-model="forecast_amount" :disabled="disabled" />
            <button v-show="hasRecurrence && !disabled"  tabindex="-1" class="button-calc-values" @click="handleDefineForecastAmount">Calcular valor total</button>
        </wrapper-input>

        <template v-if="wasPaid">
            <wrapper-input label="Valor:" id="amount" :error="errors.amount">
                <input-money id="amount" class="input input_error" v-model="amount" :disabled="disabled" />
            </wrapper-input>
        </template>

        <template v-if="hasRecurrence">
            <wrapper-input label="Valor da parcela:" id="installments" :error="errors.installments">
                <input-money id="installments" class="input input_error" v-model="installments" :disabled="disabled" />
                <button v-show="!disabled" tabindex="-1" class="button-calc-values" @click="handleDefineInstallment">Calcular valor da parcela</button>
            </wrapper-input>

            <wrapper-input label="Parcelas:" id="quantity_installments" :error="errors.quantity_installments">
                <input type="number" class="input input_error" v-model="quantity_installments" :disabled="disabled" min="1">
                <button v-show="!disabled" tabindex="-1" class="button-calc-values" @click="handleDefineQuantityInstallment">Calcular quant. de parcelas</button>
            </wrapper-input>
        </template>

    </div>

    <div class="form_row">

        <wrapper-input label="Método de pagamento:" :error="errors.payment_method">
            <select-payment-methods class="input_error" v-model="payment_method" :disabled="disabled" />
        </wrapper-input>

        <wrapper-input id="due_date" label="Data de vencimento:" :error="(errors.due_date && wasPaid) ? errors.due_date : ''">
            <input type="date" class="input input_error" id="due_date" v-model="due_date" :disabled="disabled || hasRecurrence">
        </wrapper-input>

        <wrapper-input label="Data de pagamento:" :error="(errors.paid_at && wasPaid) ? errors.paid_at : ''">
            <input type="date" class="input input_error" id="paid_at" v-model="paid_at" :disabled="disabled || !wasPaid">
        </wrapper-input>
    </div>


    <div class="container-warning" v-show="lastInstallment">
        <span class="msg">A ultima parcela será de R${{ lastInstallment }}</span>
        <div class="ctn_buttons">
            <button class="button button-primary text-medium" @click="roundUp">Arredondar para cima</button>
            <button class="button button-primary text-medium" @click="roundDown">Arredonda para baixo</button>
        </div>
    </div>
</template> 

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import inputSuggestTree from "@/components/inputSuggest/inputSuggestTree.vue"
import buttonRedirect from "@/components/formPage/buttonRedirect.vue"

import inputMoney from "@/components/inputMoney/inputMoney.vue"
import selectPaymentMethods from "../items/selectPaymentMethods";

import { computed, nextTick, ref, watch } from "vue"
export default {
    emits: ["event-edit", "event-remove"],
    components: {
        inputSuggestList,
        inputMoney,
        selectPaymentMethods,
        inputSuggestTree,
        buttonRedirect
    },
    props: {
        trx: Object,
        index: Number,
        has_recurrence: Boolean,
        charge_interest: Boolean,
        disabled: Boolean,
        errors: {
            type: Object,
            required: false,
            default: () => ({})
        },
        showButtonRemove: Boolean,
        showConfig: Object
    },
    setup(props, { emit }){
        const installments = ref("")
        const chartAccountUrl = computed(() => {
            if(props.trx.type === "inflow")
            return "/financial/chart-accounts?type=revenue"
            else
            return "/financial/chart-accounts?type=expense"
        })

        const name = computed({
            get: () => props.trx.name,
            set: name => emit("event-edit", { ...props.trx, name })
        })
        const chart_account_id = computed({
            get: () => props.trx.chart_account_id,
            set: chart_account_id => emit("event-edit", { ...props.trx, chart_account_id })
        })
        const account_id = computed({
            get: () => props.trx.account_id,
            set: account_id => emit("event-edit", { ...props.trx, account_id })
        })
        const type = computed({
            get: () => props.trx.type,
            set: type => emit("event-edit", { ...props.trx, type })
        })
        const cost_center_id = computed({
            get: () => props.trx.cost_center_id,
            set: cost_center_id => emit("event-edit", { ...props.trx, cost_center_id })
        })
        const entity_id = computed({
            get: () => props.trx.entity_id,
            set: entity_id => emit("event-edit", { ...props.trx, entity_id })
        })

        const forecast_amount = computed({
            get: () => props.trx.forecast_amount,
            set: forecast_amount => emit("event-edit", { ...props.trx, forecast_amount })
        })
        const amount = computed({
            get: () => props.trx.amount,
            set: amount => emit("event-edit", { ...props.trx, amount })
        })
        const hasRecurrence = computed({
            get: () => props.trx.hasRecurrence,
            set: has_recurrence => emit("event-edit", { ...props.trx, hasRecurrence: has_recurrence })
        })
        const wasPaid = computed({
            get: () => props.trx.wasPaid,
            set: wasPaid => emit("event-edit", { ...props.trx, wasPaid: wasPaid })
        })
        const chargeInterest = computed({
            get: () => props.trx.chargeInterest,
            set: charge_interest => emit("event-edit", { ...props.trx, chargeInterest: charge_interest })
        })
        const description = computed({
            get: () => props.trx.description,
            set: description => emit("event-edit", { ...props.trx, description })
        })
        const paid_at = computed({
            get: () => props.trx.paid_at,
            set: paid_at => emit("event-edit", { ...props.trx, paid_at })
        })
        const payment_method = computed({
            get: () => props.trx.payment_method,
            set: payment_method => emit("event-edit", { ...props.trx, payment_method })
        })
        const due_date = computed({
            get: () => props.trx.due_date,
            set: due_date => emit("event-edit", { ...props.trx, due_date })
        })
        const quantity_installments = computed({
            get: () => props.trx.quantity_installments,
            set: quantity_installments => emit("event-edit", { ...props.trx, quantity_installments })
        })

        watch(() => wasPaid.value, wasPaid => {
            if(wasPaid) hasRecurrence.value = false
            else paid_at.value = ""
        })
        watch(() => hasRecurrence.value, hasRecurrence => {
            if(hasRecurrence) due_date.value = ""
        })
        

        const lastInstallment = computed(() => {

            if(!forecast_amount.value || !installments.value) return;
            const num = forecast_amount.value / installments.value;
            const ls = !isInt(quantity_installments.value) ? (parseInt(num.toFixed(2).split(".")[1])) / 100 : "" 
            if(!num || !Number.isFinite(num) || ls * installments.value === 0) return;
            return (ls * installments.value).toFixed(2).replace(".", ",")
        })

        function remove(){
            emit("event-remove", { ...props.trx })
        }

        function handleDefineForecastAmount(){
            if(installments.value && quantity_installments.value)
                forecast_amount.value = installments.value * quantity_installments.value
        }
        function handleDefineInstallment(){
            if(forecast_amount.value && quantity_installments.value)
                installments.value = forecast_amount.value / quantity_installments.value
        }
        function handleDefineQuantityInstallment(){
            if(forecast_amount.value && installments.value)
                quantity_installments.value =  forecast_amount.value / installments.value;
        }

        function roundUp(){
            quantity_installments.value = Math.ceil(quantity_installments.value);
            nextTick(handleDefineInstallment)
        }

        function roundDown(){
            quantity_installments.value = Math.floor(quantity_installments.value);
            nextTick(handleDefineInstallment)
        }

        function isInt(n) {
            return n % 1 === 0;
        }

        return {
            name,
            description,
            chart_account_id,
            account_id,
            type,
            cost_center_id,
            entity_id,
            forecast_amount,
            amount,
            quantity_installments,
            installments,
            paid_at,
            payment_method,
            due_date,
            // computed
            chartAccountUrl,
            lastInstallment,
            // 
            hasRecurrence,
            chargeInterest,
            wasPaid,
            // methods
            roundUp,
            roundDown,
            remove,
            // inputs values functions
            handleDefineForecastAmount,
            handleDefineInstallment,
            handleDefineQuantityInstallment
        }
    }
}
</script>

<style lang="less" scoped>
    .container-warning{
        width: 100%;
        height: auto;
        background-color: rgb(253, 240, 143);
        padding: 10px;
        margin: 20px 0;

        display: flex;
        justify-content: space-between;
        align-items: center;

        .msg{
            font-size: 1.7em;
            color: #5c5102
        }
    }

    .button{
        width: 190px;
        height: 36px;
        display: inline-flex;

        &:first-child{
            margin-right: 6px;
        }
    }

    .ctn_checkbox{
        border-top: dashed 1px gray;
        padding-top: 18px;
    }

    .hidden-field{
        opacity: .6;
        filter: blur(1px);
    }
    .button-calc-values{
        font-size: 1.6em;
        background-color: #FF5733;
        border: none;
        border-radius: 5px;
        color: #fff;
        padding: 3px 6px;
        margin-top: 3px;
        cursor: pointer;

        &:active{
            transform: scale(.8);
        }
    }
</style>