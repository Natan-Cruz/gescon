<template>
    <form-page linkBack="/main/bank-transfers" :config="config">

        <div class="form_row">
            <wrapper-input label="Da conta:" :error="errors.from_bank_id">
                <input-suggest-list
                    url="/financial/bank/accounts"
                    :options="{ key: 'id', displayName: 'name' }"
                    placeholder="Seleciona uma origem"
                    v-model="form.from_bank_id" 
                    :disabled="disabled" />
            </wrapper-input>

            <wrapper-input label="Para conta:" :error="errors.to_bank_id">
                <input-suggest-list
                    url="/financial/bank/accounts"
                    :options="{ key: 'id', displayName: 'name' }"
                    placeholder="Seleciona um destino"
                    v-model="form.to_bank_id" 
                    :disabled="disabled" />
            </wrapper-input>
        </div>
        <div class="form_row">
            <wrapper-input label="Montante:" id="amount" :error="errors.amount">
                <input-money class="input" id="amount" v-model="form.amount" :disabled="disabled" />
            </wrapper-input>

            <wrapper-input label="Data:" id="date" :error="errors.date">
                <input type="date" class="input" id="date" v-model="form.date" :disabled="disabled">
            </wrapper-input>

            <wrapper-input label="Método de pagamento:" id="payment_method">
                <input type="text" class="input" id="payment_method" v-model="form.payment_method" :disabled="disabled">
            </wrapper-input>
        </div>
        <!-- <div class="form_row">
            <wrapper-input label="Refêrencia:" id="reference">
                <input type="text" class="input" id="reference" disabled="false" v-model="form.document_reference">
            </wrapper-input>
        </div> -->
        <div class="form_row">
            <wrapper-input label="Alguma anotação?" id="bank_address">
                <textarea-autosize
                    v-model="form.description"
                    :maxHeight="260"
                    :maxLength="128"
                    :disabled="disabled" >
                </textarea-autosize>
            </wrapper-input>
        </div>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import inputMoney from "@/components/inputMoney/inputMoney.vue"

import dayjs from 'dayjs';
import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from 'pinia'

export default {
    components:{
        formPage,
        inputSuggestList,
        inputMoney
    },
    setup(){
        const store = useStore();
        store.resetState()
        const { form, errors, editMode } = storeToRefs(store);

        const config = {
            urls: {
                fetch: "/financial/bank/transfers/?",
                create: "/financial/bank/transfers",
                edit: "/financial/bank/transfers/?",
                delete: ""
            },
            rules: {
                from_bank_id: { required: true },
                to_bank_id: { required: true },
                amount: { required: true },
                date: { required: true }
            }
        }

        function storeDefault(){
            store.$patch( state => {
                state.form.date = dayjs().format("YYYY-MM-DD")
            })
        }
        storeDefault()
        store.setDefault(storeDefault)

        return {
            config,
            disabled: editMode,
            form,
            errors
        }
    }
}
</script>
