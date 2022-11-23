<template>
    <form-page linkBack="/main/bank-accounts" :config="config">

        <wrapper-input class="form_spacing_bottom" label="Nome da conta:" id="name" :error="errors.name">
            <input type="text" class="input" id="name" v-model="form.name" :disabled="disabled" placeholder="Digite o apelido da conta">
        </wrapper-input>

        <wrapper-input class="form_spacing_bottom" label="Alguma anotação?" :error="errors.anotations">
            <textarea-autosize
                placeholder="Anote aqui..."
                v-model="form.anotations"
                :maxHeight="250"
                :maxLength="256"
                :disabled="disabled"
                @set-error="errors.anotations = $event" >
            </textarea-autosize>
        </wrapper-input>

        <div class="form_row">
            <wrapper-input label="Selecione um banco" :error="errors.bank_name">
                <input-suggest-list
                    url="https://brasilapi.com.br/api/banks/v1"
                    :options="{ key: 'fullName', displayName: 'fullName' }"
                    placeholder="Selecione um banco"
                    :url_search="false"
                    v-model="form.bank_name" 
                    :disabled="disabled" >
                </input-suggest-list>
            </wrapper-input>

            <wrapper-input label="Agência:" id="agency" :error="errors.agency">
                <input type="text" class="input" id="agency" v-model="form.agency" :disabled="disabled" placeholder="Digite o agência da conta">
            </wrapper-input>

            <wrapper-input label="Operação:" id="operating" :error="errors.operating">
                <input type="text" class="input" id="operating" v-model="form.operating" :disabled="disabled" placeholder="Digite a operação da conta">
            </wrapper-input>

            <wrapper-input label="Número da conta:" id="number" :error="errors.number">
                <input type="text" class="input" id="number" v-model="form.number" :disabled="disabled" placeholder="Digite o número da conta">
            </wrapper-input>
        </div>
      
        <div class="form_row">
            <wrapper-input label="Moeda:" id="currency_code">
                <select class="select" id="currency_code" v-model="form.currency_code" disabled>
                    <option value="BRL">Real Brasileiro</option>
                </select>
            </wrapper-input>

            <wrapper-input label="Saldo inicial:" id="opening_balance">
                <input-money class="input" id="opening_balance" v-model="form.opening_balance" :disabled="disabled" />
            </wrapper-input>

            <wrapper-input label="Data do saldo inicial:" id="opening_balance">
                <input type="date" class="input" id="opening_balance" v-model="form.date_opening_balance" :disabled="disabled" >
            </wrapper-input>
        </div>
      
        <div>
            <toggle v-model="form.enabled" label="Conta ativa" :disabled="disabled"/>
        </div>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import toggle from '@/components/toggle/toggle.vue'
import inputMoney from "@/components/inputMoney/inputMoney.vue" 
import inputSuggestList from "@/components/inputSuggest/inputSuggestList"

import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia" 

export default {
    components:{
        formPage,
        inputMoney,
        toggle,
        inputSuggestList
    },
    setup(){
        const store = useStore();
        store.resetState();
        const { form, errors, editMode } = storeToRefs(store);

        const config = {
            urls: {
                fetch: "/financial/bank/accounts/?",
                create: "/financial/bank/accounts",
                edit: "/financial/bank/accounts/?",
                delete: ""
            },
            rules: {
                name: { required: true },
                anotations: { maxLength: 256 },
                bank_name: { required: true },
                agency: { required: true },
                operating: { required: true },
                number: { required: true }
            }
        }

        function storeDefault(){
            store.$patch( state => {
                state.form.currency_code = "BRL"
                state.form.enabled = true
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