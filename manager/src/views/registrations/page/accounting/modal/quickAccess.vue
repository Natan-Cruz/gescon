<template>
    <Modal :maxWidth="900" @close-modal="$emit('close-modal')">
        <div class="container-arrow">
            <button class="arrow arrow-left" @click="toLeft" :style="!showArrowLeft && 'visibility: hidden'"> 
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="m15.2 43.9-2.8-2.85L29.55 23.9 12.4 6.75l2.8-2.85 20 20Z"/></svg>
            </button>

            <button class="arrow arrow-right" @click="toRight" :style="!showArrowRight && 'visibility: hidden'">
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="m15.2 43.9-2.8-2.85L29.55 23.9 12.4 6.75l2.8-2.85 20 20Z"/></svg>
            </button>
        </div>

        <h2 class="title">Menu rápido</h2>

        <div class="content-modal" ref="content_modal">
            <div class="info">
                <p class="account-name">{{ account.name }}</p>
                <p style="color: gray;">{{ account.cost_center_name }}</p>
            </div>

            <wrapper-input label="Descrição:" class="form_spacing_bottom">
                <textarea-autosize v-model="form.description" :minHeight="40" :maxLength="255" placeholder="Descreva algo aqui..." />
            </wrapper-input>

            <div class="form_row">
                <wrapper-input label="Valor previsto:">
                    <input-money class="input" id="forecast_amount" v-model="form.forecast_amount" ref="input_money" :disabled="true"/>
                </wrapper-input>

                <wrapper-input label="Data de vencimento:">
                    <input type="date" class="input" id="due_data" v-model="form.due_date" :disabled="true" >
                </wrapper-input>
            </div>

            <div class="form_row">
                <wrapper-input label="Valor:">
                    <input-money class="input" id="forecast_amount" v-model="form.amount" ref="input_money"/>
                </wrapper-input>

                <wrapper-input label="Pago em:">
                    <input type="date" class="input" id="paid_at" v-model="form.paid_at">
                </wrapper-input>

                <wrapper-input label="Método de pagamento:">
                    <select-payment-methods v-model="form.payment_method" />
                </wrapper-input>
            </div>

            <form-loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" />

            <div class="ctn-buttons">
                <button type="button" class="button button-second text-medium button-save-contact" @click="$emit('close-modal')">Cancelar</button>
                <button style="margin-left: 5px" class="button button-secondary text-medium button-save-contact" @click="$emit('print-receipt')"  :disabled="state.isLoading">Imprimir recibo</button>
                <div style="display: flex">
                    <button style="margin-right: 5px" type="submit" class="button button-primary text-medium button-save-contact" @click="submit('launch_account_without_paying')" :disabled="state.isLoading">Lançar conta</button>
                    <button type="submit" class="button button-primary text-medium button-save-contact" :style="account.type === 'inflow' ? 'background-color: #287928' : 'background-color: #F51720' " @click="submit()" :disabled="state.isLoading">{{ account.type === "inflow" ? "Receber" : "Pagar" }}</button>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
import inputMoney from "@/components/inputMoney/inputMoney.vue" 
import selectPaymentMethods from "@/components/selectPaymentMethods.vue" 

import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { notify } from "@kyvg/vue3-notification";
import axios from "@/services/api"
import dayjs from 'dayjs';

export default {
    emits: [ "previous", "next", "update-account", "remove-account", "close-modal"],
    components: { inputMoney, selectPaymentMethods },
    props: { account: Object, showArrowLeft: Boolean, showArrowRight: Boolean },
    setup(props, { emit }){
        const state = reactive({ isLoading: false, errorMsg: "" })
        const form = reactive({});
        const input_money = ref(null);
        const content_modal = ref(null);

        async function submit(mode){
            const url = "/accounting/pay";
            const isRecurrence = Object.prototype.hasOwnProperty.call(props.account, "recurrence_template_id")
            const body = {
                id: props.account.id,
                isRecurrence: !isRecurrence,
                ...form
            };
            let successfulMessage;

            state.isLoading = true;
            state.errorMsg = "";

            if(mode === "launch_account_without_paying"){
                successfulMessage = "Conta lançada com sucesso!"
                delete body.paid_at;
            } else {
                const verb = props.account.type === "inflow" ? "recebida" : "paga";
                successfulMessage = `Conta ${ verb } com sucesso!`
            }

            try {
                await axios({
                    method: "put",
                    url,
                    data: body
                })
                notify({
                    title: successfulMessage,
                    type: "success",
                    duration: 5000
                })

                if(mode === "launch_account_without_paying")
                    emit("update-account", { ...props.account, ...body })
                else
                    emit("remove-account", props.account.id)

                // setTimeout(() => {
                //     // se houver conta passa para proximo
                //     // senao fecha modal
                //     if(props.showArrowRight)
                //         toRight()
                //     else
                //         emit("close-modal")
                // }, 100);
            } catch (error) {
                state.errorMsg = error    
            } finally {
                state.isLoading = false
            }
        }


        function setFormValues(account){
            const { description, amount, forecast_amount, due_date, payment_method } = account;
            form.description = description;
            form.amount = amount;
            form.forecast_amount = forecast_amount ? forecast_amount : amount;
            form.paid_at = dayjs().format("YYYY-MM-DD") // today
            form.due_date = dayjs().set(due_date, "day").format("YYYY-MM-DD")
            form.payment_method = payment_method;

            input_money.value.setFocus()
        }

        watch(() => props.account, setFormValues)
        onMounted(() => {
            setFormValues(props.account)
            window.addEventListener("keydown", hadleKeysLeftOrRight, false)
        })
        onBeforeUnmount(() => {
            window.removeEventListener("keydown", hadleKeysLeftOrRight, false)
        })

        function toLeft(){
            const contentModal = content_modal.value;

            // evita que a passagem de mais de um
            if(
                contentModal.classList.contains("content_modal_animations_to_left") || 
                contentModal.classList.contains("content_modal_animations_to_right")
            ) return;

            contentModal.classList.add("content_modal_animations_to_left")
            emit("previous")
            setTimeout(() => {
                contentModal.classList.remove("content_modal_animations_to_left")
            }, 500);
        }
        function toRight(){
            const contentModal = content_modal.value;

            if(
                contentModal.classList.contains("content_modal_animations_to_left") || 
                contentModal.classList.contains("content_modal_animations_to_right")
            ) return;

            contentModal.classList.add("content_modal_animations_to_right")
            emit("next")
            setTimeout(() => {
                contentModal.classList.remove("content_modal_animations_to_right")
            }, 500);
        }

        function hadleKeysLeftOrRight(evt){
            const keyCode = evt.keyCode

            // left
            if(keyCode === 39 && props.showArrowRight)
                return toRight()

            // right
            if(keyCode === 37 && props.showArrowLeft)
                return toLeft()
            
        }
        
        return {
            state,
            form,
            // refs
            input_money,
            content_modal,
            // methods
            submit,
            // 
            toRight,
            toLeft
        }
    }
}
</script>

<style lang="less" scoped>
    .info{
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: dashed 1px gray;
        p{
            font-size: 1.7em;
            white-space: nowrap;
        }
        .account-name{
            font-size: 2em;
        }
    }
    .title{
        font-size:2em;
        margin-bottom: 20px;
        text-align: center;
    }
    .wrapper-button-relative{
        margin-top: 24px;

        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .ctn-buttons{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .button-save-contact{
        width: auto;
        height: 36px;
        padding: 6px;
        &:last-child{
            margin-left: 4px;
        }        
    }
    .content-modal{
        padding: 0 50px;
        transition: opacity 150ms ;
    }

    .content_modal_animations_to_left{
        animation: content_modal_to_left 500ms ease;
    }

    @keyframes content_modal_to_left {
        30%{
            transform: translateX(30%);
            opacity: 0;
        }
        40%{
            transform: translateX(-30%);
            opacity: 0;
        }
        60%{
            transform: translateX(0);
            opacity: 1;
        }
    }

    .content_modal_animations_to_right{
        animation: content_modal_to_right 500ms ease;
    }

    @keyframes content_modal_to_right {
        30%{
            transform: translateX(-30%);
            opacity: 0;
        }
        40%{
            transform: translateX(30%);
            opacity: 0;
        }
        60%{
            transform: translateX(0);
            opacity: 1;
        }
    }

    .container-arrow{
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        z-index: 1;
        pointer-events: none;
    }
    .arrow{
        border: none;
        background-color: #fff;
        cursor: pointer;
        border-radius: 5px;
        &:hover{
            background-color: rgb(218, 218, 218);
        }
        &:active{
            transform: scale(.8);
        }
        pointer-events: all;
    }

    .arrow-left{
        transform: rotate(180deg);
        &:active{
            transform: rotate(180deg) scale(.8);
        }
    }

    @media screen and (max-width: 600px){
        .container-arrow{
            align-items: flex-start;
        }
        .arrow{
            transform: scale(.7);
        }
        .arrow-left{
            transform: rotate(180deg) scale(.7);
        }
        .content-modal{
            padding: 0;
        }
    }
</style>