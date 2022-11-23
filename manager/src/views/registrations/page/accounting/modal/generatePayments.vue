<template>
    <Modal :maxWidth="900" @close-modal="$emit('close-modal')">
        <h2 class="title">Gerar e enviar boletos</h2>

        <loading-or-error :isLoading="state.isLoading" :error="state.error" />

        <div class="content-modal" ref="content_modal">
            <ul>
                <item-installment 
                    v-for="account of installmentsAndErrors" :key="account.id" 
                    :account="account"
                    @edit="handleEdit">
                </item-installment>
            </ul>
        </div>

        <div class="ctn-buttons">
            <button type="button" class="button button-second text-medium" @click="$emit('close-modal')" :disabled="state.isLoading">Cancelar</button>
            <button type="submit" class="button button-primary text-medium"  @click="handleGeneratePayments" :disabled="state.isLoading">Gerar e enviar</button>
        </div>
    </Modal>
</template>

<script>
/* eslint-disable */
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { notify } from "@kyvg/vue3-notification";
import axios from "@/services/api"
import { checkIsTransaction } from "../utils.js"
import itemInstallment from "../items/itemInstallment.vue"
import Rules from '@/components/formPage/Rules';

export default {
    emits: ["close-modal", "success"],
    components: { itemInstallment },
    props: { 
        accounts: Array
    },
    setup(props, { emit }){
        const customers = ref([])
        const installments = ref([]);
        const state = reactive({ isLoading: false, error: "", errors: [] })

        const rules = {
            installments: {
                isArray: true,
                rules: {
                    email: { required: true, maxLength: 255 },
                    cep: { required: true },
                    street: { required: true },
                    state: { required: true },
                    city: { required: true },
                    neighborhood: { required: true }
                }
            }
        }

        onMounted(() => {
            const { accounts } = props;
            if(!accounts || !accounts.length) return;
            getInformationsAboutAccounts()
        })

        async function getInformationsAboutAccounts(){
            const url = "/accounting/installments-customers"
            const body = props.accounts.map( trx => ({ id: trx.id, isTransaction: checkIsTransaction(trx)}) );
            state.isLoading = true;
            state.error = ""
            try {
                const { data } = await axios.post(url, body)
                customers.value = data
                installments.value = data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        async function handleGeneratePayments(){
            state.errros = {}
            state.errors = Rules({ installments: customers.value }, rules)

            if(Object.entries(state.errors).length)
                return notify({
                    title: "Preencha os campos obrigatórios",
                    type: "warn",
                    duration: 6000
                })

            const url = "/accounting/generate-payments";
            const body = [];

            installmentsAndErrors.value.forEach( trx => {
                const { transaction, customer } = trx;
                const cstmer = customers.value.find( cstmer => cstmer.t_id === transaction.id )
                let t = {};
                if(cstmer){
                    t.id = transaction.id;
                    t.amount = transaction.amount || transaction.forecast_amount;
                    t.due_date = transaction.due_date;
                    t.isTransaction = checkIsTransaction(transaction);
                    if(customer.cep !== cstmer.cep) t.cep = customer.cep
                    if(customer.street !== cstmer.street) t.street = customer.street
                    if(customer.number !== cstmer.number) t.number = customer.number
                    if(customer.state !== cstmer.state) t.state = customer.state
                    if(customer.city !== cstmer.city) t.city = customer.city
                    if(customer.neighborhood !== cstmer.neighborhood) customer.neighborhood = customer.neighborhood
                }
                body.push(t)
            })

            state.isLoading = true;
            try {
                const { data } = await axios({
                    url,
                    method: "POST",
                    data: body
                })
                notify({
                    title: "Boletos gerado e enviados com successo",
                    type: "success",
                    duration: 5000
                })
                emit("close-modal")
                emit("success", data )
            } catch (error) {
                notify({
                    title: "Erro, por favor tente novamente!",
                    type: "error",
                    duration: 5000
                })
            } finally {
                state.isLoading = false;
            }
        }

        function handleEdit(customer){
            const index = installments.value.findIndex( itm => itm.t_id === customer.t_id )
            installments.value.splice(index, 1, customer)
        }

        const installmentsAndErrors = computed(() => {
            if(!installments.value.length || !props.accounts.length) return [];

            return installments.value.map( (customer, i) => {
                const transaction = props.accounts.find( trx => trx.id === customer.t_id )
                const errors = state.errors.installments && state.errors.installments[i]

                return {
                    transaction: transaction || {},
                    customer: customer,
                    errors: errors || {}
                }
            })
        })

        return {
            installmentsAndErrors,
            state,
            // methods
            handleEdit,
            handleGeneratePayments
        }
    }
}
</script>

<style lang="less" scoped>
    .title{
        font-size: 1.8em;
        margin-bottom: 20px;
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