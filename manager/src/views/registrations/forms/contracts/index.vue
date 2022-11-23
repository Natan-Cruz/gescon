<template>
    <form-page linkBack="/main/contracts" :config="config">

        <div class="form_row">
            <wrapper-input label="Tipo:" :error="errors.type">
                <select class="select input_error" v-model="form.type" :disabled="disabled">
                    <option value="" selected default disabled>Selecione o tipo</option>
                    <option value="rent">Aluguel</option>
                    <option value="sale">Venda</option>
                </select>
            </wrapper-input>

            <wrapper-input label="Cliente:" :error="errors.entity_id">
                <input-suggest-list
                    url="/registrations/clients?minimal=true"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione um cliente"
                    v-model="form.entity_id" :disabled="disabled">
                </input-suggest-list>
            </wrapper-input>

            <wrapper-input label="Ativo:" :error="errors.asset_id">
                <input-suggest-list
                    :url="urlAsset"
                    :options="{ key: 'id', displayName: 'name' }"
                    placeholder="Seleciona um ativo"
                    v-model="form.asset_id" :disabled="disabled" >
                </input-suggest-list>
            </wrapper-input>
        </div>

        <p class="title">Defina as transações:</p>
        <ul>
            <li class="item" v-for="(data, index) of transactionsAndErrors" :key="data.trx._id" >
                <transaction-component 
                    :showButtonRemove="true"
                    :errors="data.errors"
                    :showConfig="{ entity: true, cost_center: true }"
                    :disabled="disabled"
                    v-model:transaction="data.trx"
                    @update:transaction="editTransaction({ index: index, transaction : $event })"
                    @remove-transaction="removeTransaction({ index: index, transaction: $event })" >
                </transaction-component>
            </li>
        </ul>
        <button class="button-add-transaction" @click="add" :disabled="disabled" >Adicionar transação</button>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import transactionComponent from "@/components/transactionComponent/transactionComponent.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"

import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs';
import { nanoid } from "nanoid"
import { computed } from 'vue';
import { useRoute } from "vue-router"

export default {
    components: {
        formPage,
        transactionComponent,
        inputSuggestList
    },
    setup(){
        const store =  useStore();
        const $route = useRoute();
        store.resetState();

        const { form, errors, editMode, hasData } = storeToRefs(store);

        const urlAsset = computed(() => {
            if($route.params.id)
                return "/registrations/assets?minimal=true"
            else
                return "/registrations/assets?status=available&minimal=true"
        })

        const config = {
            urls: {
                fetch: "/registrations/contracts/?",
                create: "/registrations/contracts",
                edit: "/registrations/contracts",
                delete: ""
            },
            rules: {
                type: { required: true },
                entity_id: { required: true },
                asset_id: { required: true },
                transactions: {
                    isArray: true,
                    rules: {
                        name: { required: true },
                        chart_account_id: { required: true },
                        account_id: { required: true },
                        amount: { required: true },
                        quantity_installments: { required: true },
                        type: { required: true },
                    },
                    required_if: [
                        {
                            condition: { wasPaid: true },
                            rules: {
                                due_date: { required: true },
                                paid_at: { required: true },
                                payment_method: { required: true }
                            }
                        },
                        {
                            condition: { hasRecurrence: true },
                            rules: {
                                start_date: { required: true },
                                frequency: { required: true },
                                due_date: { required: true }
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
            }
        }

        function storeDefault(){
            store.$patch( state => { 
                state.form.type = "";
                state.form.transactions = [];
            });
        }
        storeDefault()
        store.setDefault(storeDefault)

        function add(){
            let trx = {
                _id: nanoid(),
                name: "",
                type: "inflow",
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
                // correction per time,
                type_monetary_correction: "value",
                frequency_monetary_correction: "monthly",
                monetary_correction: 0
            }

            store.$patch( state => {
                if(state.form.transactions)
                    state.form.transactions.push(trx)
                else
                    state.form.transactions = [trx]
            })
        }

        function editTransaction({ index, transaction }){
            const belongsToCompany = transaction.id ? true : false

            if(belongsToCompany){
                const ctt = transaction.value.find((elem, i) => i === index);
                if(!ctt) return
                ctt.action = "UPDATE"
                store.$patch( state => state.form.transactions.splice(index, index + 1, ctt))
            }else{
                store.$patch( state => state.form.transactions.splice(index, index + 1, transaction))
            }
        }

        function removeTransaction({ index, transaction }){
            const belongsToCompany = transaction.id ? true : false

            if(belongsToCompany){
                const ctt = transaction.value.find((elem, i) => i === index);
                if(!ctt) return
                ctt.action = "REMOVE"
                store.$patch( state => state.form.transactions.splice(index, index + 1, ctt))
            }else{
                store.$patch( state => state.form.transactions.splice(index, index + 1))
            }
        }

        const transactionsAndErrors = computed(() => {
            return form.value.transactions.map((trx, i) => {
                const err = errors.value.transactions && errors.value.transactions[i]
                return {
                    trx,
                    errors: err
                }
            })
        })

        return {
            config,
            form,
            errors,
            editMode,
            hasData,
            urlAsset,
            // 
            disabled: editMode,
            transactionsAndErrors,
            // 
            add,
            editTransaction,
            removeTransaction,
        }
    }
}
</script>

<style lang="less" scoped>
    .title{
        font-size: 1.8em;
        font-weight: bold;
        margin-bottom: 16px;
    }

    .item{
        width: 100%;
        height: auto;
        position: relative;

        margin-bottom: 24px;
    }

    .button-add-transaction{
        width: auto;
        height: auto;

        padding: 10px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        font-size: 1.7em;
    }
</style>