<template>
    <form-page :config="config">
        <transaction-component
            :showButtonRemove="false"
            :errors="errors"
            :disabled="disabled"
            v-model:transaction="form" >
        </transaction-component>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import { useStore } from "@/components/formPage/store.js"
import transactionComponent from "@/components/transactionComponent/transactionComponent.vue"

import { useRoute } from "vue-router"
import { storeToRefs } from 'pinia'

export default {
    components: { formPage, transactionComponent },
    setup(){
        const store = useStore();
        store.resetState()
        const $route = useRoute();
        const { editMode, errors, form } = storeToRefs(store)

        const config = {
            urls: {
                fetch: "/financial/bank/transactions/?",
                create: "/financial/bank/transactions",
                edit: "/financial/bank/transactions",
                delete: ""
            },
            rules: {
                name: { required: true },
                description: { maxLength: 256 },
                type: { required: true },
                cost_center_id: { required: true },
                chart_account_id: { required: true },
                account_id: { required: true },
                required_if: [
                    {
                        condition: { wasPaid: true },
                        rules: {
                            due_date: { required: true },
                            paid_at: { required: true }
                        }
                    },
                    {
                        condition: { chargeInterest: true },
                        rules: {
                            type_monetary_correction: { required: true },
                            frequency_monetary_correction: { required: true },
                            monetary_correction: { required: true }
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
                            readjustment_content: { required: true }
                        }
                    }
                ]
            }
        }

        function storeDefault(){
            const { type, wasPaid } = $route.query;
            store.$patch( state => {
                state.form.type = type || "inflow" 
                // state.form.hasRecurrence = true;
                state.form.frequency = 'monthly';
                state.form.type_late_fee = 'value';
                state.form.type_monetary_correction = 'value';
                state.form.frequency_monetary_correction = 'monthly';
                state.form.wasPaid = wasPaid ? true : false
            })
        }
        storeDefault()
        store.setDefault(storeDefault)

        return { 
            config,
            disabled: editMode,
            errors,
            form
        }
    }
}
</script>