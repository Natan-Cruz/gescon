<template>
    <li class="item grid" >
        <div class="description">
            <p>{{ account.transaction.name }}</p>
            <p v-if="account.transaction.cost_center_name" style="color: gray;margin-left: 2px;">{{ account.transaction.cost_center_name }}</p>
        </div>

        <div class="amount">
            <p>{{ formatCurrency(amount) }}</p>
            <p v-if="amount !== paymentFineAndReadjustment">{{ formatCurrency(paymentFineAndReadjustment) }}</p>
        </div>

        <p class="date">{{ formatDate(account.transaction.due_date) }}</p>

        <div class="ctn_email">
            <div style="width: 60%">
                <input type="email" placeholder="Email da cobrança" class="input-email" :class="{ 'input-error': account.errors.email }" ref="input_email" v-model="email" :disabled="input_email_disabled">
                <p class="msg-error-input-email" v-show="account.errors.email">{{ account.errors.email }}</p>
            </div>
            <button class="button button-tertiary btn-change-email" @click="handleChangeEmail">{{ input_email_disabled ? "Mudar email" : "Confirmar" }}</button>
            <button v-show="!input_email_disabled" class="button button-tertiary btn-change-email" @click="resetEmail">Cancelar alteração</button>
        </div>

        <expandable-content class="ctn_address"  title="Endereço" :defaultOpen="contentIsOpen">
            <address-component
                :error_cep="account.errors.cep"
                :error_street="account.errors.street"
                :error_state="account.errors.state"
                :error_city="account.errors.city"
                :error_number="account.errors.number"
                :error_neighborhood="account.errors.neighborhood"
                v-model:cep="cep"
                v-model:street="street"
                v-model:state="state"
                v-model:city="city"
                v-model:number="number"
                v-model:neighborhood="neighborhood" />
        </expandable-content>
    </li>
</template>

<script>
import addressComponent from "@/components/addressComponent.vue"
import expandableContent from "../expandableContent.vue"

import { formatCurrency, formatDate } from "@/Utils/index.js"
import { computed, onMounted, ref } from 'vue';

export default {
    components: { expandableContent, addressComponent },
    props: { account: Object },
    setup(props, { emit }){
        const input_email_disabled = ref(true);
        const input_email = ref(null);
        let original_email;

        onMounted(() => original_email = props.account.customer.email)

        const amount = (() => {
            const { amount, forecast_amount } = props.account.transaction;
            const value = amount|| forecast_amount
            return value
        })()
        const paymentFineAndReadjustment = (() => {
            const { amount, forecast_amount, payment_fine, readjustment } = props.account.transaction;
            const value = (amount || forecast_amount) + payment_fine + readjustment
            return value
        })()
        const contentIsOpen = computed(() => {
            const { cep, street, state, city, neighborhood } = props.account.customer;
            return (cep && street && state && city && neighborhood) ? false : true 
        })

        const email = computed({
            get: () => props.account.customer.email,
            set: email => emit("edit", { ...props.account.customer, email })
        })
        const cep = computed({
            get: () => props.account.customer.cep,
            set: cep => emit("edit", { ...props.account.customer, cep })
        })
        const street = computed({
            get: () => props.account.customer.street,
            set: street => emit("edit", { ...props.account.customer, street })
        })
        const number = computed({
            get: () => props.account.customer.number,
            set: number => emit("edit", { ...props.account.customer, number })
        })
        const state = computed({
            get: () => props.account.customer.state,
            set: state => emit("edit", { ...props.account.customer, state })
        })
        const city = computed({
            get: () => props.account.customer.city,
            set: city => emit("edit", { ...props.account.customer, city })
        })
        const neighborhood = computed({
            get: () => props.account.customer.neighborhood,
            set: neighborhood => emit("edit", { ...props.account.customer, neighborhood })
        })

        function handleChangeEmail(){
            if(input_email_disabled.value){
                setTimeout(() => {
                    input_email.value.focus()
                }, 120);
            }
            input_email_disabled.value = !input_email_disabled.value;
        }

        function resetEmail(){
            input_email_disabled.value = true;
            email.value = original_email
        }
    
        return {
            contentIsOpen,
            original_email,
            cep,
            street,
            number,
            state,
            city,
            neighborhood,
            // 
            input_email_disabled,
            input_email,
            amount,
            paymentFineAndReadjustment,
            // computed 
            email,
            // methods
            formatDate,
            formatCurrency,
            resetEmail,
            handleChangeEmail
        }
    }
}
</script>

<style lang="less" scoped> 
    .grid{
        display: grid;
        grid-template-rows: auto;
        gap: 12px;
        grid-template-areas: "description amount date" "email email email" "c_address c_address c_address";
        grid-template-columns: 3fr 1fr 1fr;
        grid-template-rows: repeat(3, auto);
    }
    .item{
        width: 100%;
        min-height: 60px;
        height: auto;
        border: solid 1px rgb(150, 150, 150);

        border-radius: 5px;
        position: relative;
        padding: 12px 8px;

        margin-bottom: 16px;

        &:last-child{
            margin-bottom: 0;
        }
    }

    .description{ grid-area: description }
    .amount{ grid-area: amount }
    .date{ grid-area: date }
    .ctn_email{ grid-area: email }
    .ctn_address{ grid-area: c_address }

    // description
    .description, .amount, .date{
        font-size: 1.6em;
        align-self: center;
        span, p{
            font-size: 1em;
        }
    }

    .amount{
        color: #287928;
        font-weight: bold;
    }

    // email
    .ctn_email{
        display: flex;
        align-items: center;
        flex-direction: row;

        border-top: dashed 1px gray;
        border-bottom: dashed 1px gray;
        padding: 10px 0 14px 0;
        outline: none;
    }
    .input-email{
        width: 100%;
        height: 30px;
        border: none;
        outline: none;
        font-size: 1.6em;
        padding-left: 5px;
        border-bottom: solid 1px gray;

        &:disabled{
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
    }
    .input-error{
        border-color: #ff3333;
        border-bottom-width: 2px;
        &::placeholder{
            color: #ff3333;
        }
    }
    .msg-error-input-email{
        font-size: 1.5em;
        color: #ff3333;
        margin-top: 4px;
        display: inline-block;
    }
    .btn-change-email{
        font-size: 1.5em;
        // border
        height: auto;
        width: auto;
        margin-left: 20px;
    }

    // 
</style>