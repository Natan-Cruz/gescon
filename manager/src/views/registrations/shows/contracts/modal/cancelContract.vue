<template>
    <Modal :maxWidth="900" @close-modal="$emit('close-modal')">
        <h2 class="title">Realizar distrato</h2>

        <checkbox label="Devolução monetária?" style="margin-bottom: 16px" v-model="isChecked"/>

        <transaction-component 
            v-show="isChecked" 
            type="outflow" 
            :errors="state.errors"
            v-model:transaction="state.transaction">
        </transaction-component>

        <form-loading-or-error :isLoading="state.isLoading" :error="state.error" />

        <div class="ctn-buttons">
            <button type="button" class="button button-second text-medium" @click="$emit('close-modal')" :disabled="state.isLoading">Cancelar</button>
            <button type="submit" class="button button-primary text-medium"  @click="handleSubmit" :disabled="state.isLoading">Distratar</button>
        </div>
    </Modal>
</template>

<script>
import transactionComponent from "@/components/transactionComponent/transactionComponent.vue"

import { reactive, ref } from 'vue'
import { notify } from "@kyvg/vue3-notification";
import axios from "@/services/api"
import Rules from '@/components/formPage/Rules';
import dayjs from "dayjs"

export default {
    emits: ["close-modal", "success"],
    components: {transactionComponent },
    props: {
        contract_id: {
            type: String,
            default: ""
        },
        contract_asset_cost_center: {
            type: String,
            default: ""
        }
    },
    setup(props, { emit }){
        const state = reactive({ isLoading: false, error: "", errors: [], transaction: {
            name: "",
            cost_center_id: props.contract_asset_cost_center,
            chart_account_id: "",
            account_id: "",
            forecast_amount: 0,
            amount: 0,
            quantity_installments: 1,
            payment_method: "",
            // recurrence
            start_date: dayjs().format("YYYY-MM-DD"),
            frequency: "monthly",
            due_date: "",
            billing_date: "",
            // readjustment
            readjustment_frequency: "monthly",
            readjustment_content: "",
            // interest
            type_late_fee: "value",
            late_fee: 0,
            // 
            type_monetary_correction: "value",
            frequency_monetary_correction: "monthly",
            monetary_correction: 0
        } })
        const isChecked = ref(false)

        const rules = {
            name: { required: true },
            chart_account_id: { required: true },
            account_id: { required: true },
            amount: { required: true },
            quantity_installments: { required: true },
            payment_method: { required: true },
            required_if: [
                {
                    condition: { wasPaid: true },
                    rules: {
                        due_date: { required: true },
                        paid_at: { required: true }
                    }
                },
                {
                    condition: { hasRecurrence: true },
                    rules: {
                        start_date: { required: true },
                        frequency: { required: true },
                        due_date: { required: true },
                        billing_date: { required: false },
                    }
                },
                {
                    condition: { hasReadjustment: true },
                    rules: {
                        readjustment_frequency: { required: true },
                        readjustment_content: { required: true }
                    }
                }
            ]
        }

        async function handleSubmit(){
            state.errros = {}
            if(isChecked.value) state.errors = Rules(state.transaction, rules)

            if(Object.entries(state.errors).length)
                return notify({
                    title: "Preencha os campos obrigatórios",
                    type: "warn",
                    duration: 6000
                })

            state.isLoading = true;
            state.error = ""
            try {
                await axios.post('/registrations/contracts/actions', { 
                    id: props.contract_id, 
                    action: "cancel_contract", 
                    back_transaction: isChecked.value ? state.transaction : undefined
                })
                notify({
                    title: "Distrato realizado com sucesso!",
                    type: "success",
                    duration: 5000
                })
                emit("close-modal")
                emit("success")
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false;
            }
        }


        return {
            state,
            isChecked,
            // methods
            handleSubmit,
            teste: a => console.log(a) 
        }
    }
}
</script>

<style lang="less" scoped>
    .title{
        font-size: 1.8em;
        margin-bottom: 12px;
        text-align: center;
    }
    .ctn-buttons{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 24px;
    }
    .button{
        width: auto;
        height: 36px;
        padding: 0 12px;

        &:first-child{
            margin-right: 12px;
        }
    }
</style>