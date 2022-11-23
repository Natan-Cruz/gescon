<template>
    <form-page linkBack="/main/credit-cards" :config="config">

        <wrapper-input class="form_spacing_bottom" label="Nome do cartão:" id="name" :error="errors.name">
            <input type="text" class="input" id="name" v-model="form.name" :disabled="disabled" placeholder="Digite o apelido do cartão">
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
            <wrapper-input label="Selecione a bandeira">
                <select class="select" v-model="form.card_flag" :disabled="disabled">
                    <option :value="brand" v-for="(brand, i) in cardFlags" :key="i">{{ brand }}</option>
                </select>
            </wrapper-input>

            <wrapper-input label="Selecione a operadora">
                <select class="select" v-model="form.card_operators" :disabled="disabled">
                    <option :value="operator" v-for="(operator, i) in cardOperators" :key="i">{{ operator }}</option>
                </select>
            </wrapper-input>
        </div>

        <div class="form_row">
            <wrapper-input label="Dia do fechamento:">
                <select class="select" v-model="form.closing_day"  :disabled="disabled">
                    <option v-for="n in 31" :key="n" :value="n">{{ n }}</option>
                </select>
            </wrapper-input>

            <wrapper-input label="Dia do vencimento:" v-model="form.expiration_day">
                <select class="select"  :disabled="disabled">
                    <option v-for="n in 31" :key="n" :value="n">{{ n }}</option>
                </select>
            </wrapper-input>
        </div>

        <div class="form_row">
            <wrapper-input label="Limite de crédito">
                <input-money class="input" v-model="form.credit_limit" :disabled="disabled" /> 
            </wrapper-input>

            <wrapper-input label="Pagamento mínimo">
                <input-money class="input" v-model="form.minimum_payment" :disabled="disabled" />
            </wrapper-input>
        </div>
      
        <div class="form_row">
            <toggle v-model="form.enabled" label="Conta ativa" :disabled="disabled"/>
            <toggle v-model="form.only_debit" label="Somente debito?" :disabled="disabled"/>
        </div>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import toggle from '@/components/toggle/toggle.vue'
import inputMoney from "@/components/inputMoney/inputMoney.vue" 

import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia" 

export default {
    components:{
        formPage,
        inputMoney,
        toggle,
    },
    setup(){
        const store = useStore();
        store.resetState();

        const { form, errors, editMode } = storeToRefs(store);

        const config = {
            urls: {
                fetch: "/financial/bank/credit-cards/?",
                create: "/financial/bank/credit-cards",
                edit: "/financial/bank/credit-cards/?",
                delete: ""
            },
            rules: {
                name: { required: true },
                anotations: { maxLength: 256 }
            }
        }

        const cardFlags = [
            "American Express",
            "Aura",
            "Avista",
            "BrasilCard",
            "Cabal",
            "CardBan",
            "Diners Club",
            "Elo",
            "FortBrasil",
            "Hipercard",
            "MasterCard",
            "Personal Card",
            "Pleno Card",
            "Santander",
            "Sicredi",
            "Sorocred",
            "ValeCard",
            "Visa",
        ]

        const cardOperators = []

        return {
            config,
            disabled: editMode,
            form,
            errors,
            cardFlags,
            cardOperators
        }
    }
}
</script>