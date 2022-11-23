<template>
    <Modal :maxWidth="400" @close-modal="$emit('close-modal')">
        <h2 class="title">Transferir ativo</h2>

        <wrapper-input label="De:" class="form_spacing_bottom">
            <span class="customer-name">{{ contract_customer_name }}</span>
        </wrapper-input>

        <wrapper-input label="Para:" class="form_spacing_bottom" :error="state.errors.entity_id">
            <input-suggest-list
                url="/registrations/clients"
                :options="{ key: 'id', displayName: 'name'}"
                placeholder="Selecione um cliente"
                v-model="state.entity_id">
            </input-suggest-list>
        </wrapper-input>

        <form-loading-or-error :isLoading="state.isLoading" :error="state.error" />

        <div class="ctn-buttons">
            <button type="button" class="button button-second text-medium" @click="$emit('close-modal')" :disabled="state.isLoading">Cancelar</button>
            <button type="submit" class="button button-primary text-medium"  @click="handleSubmit" :disabled="state.isLoading">Salvar</button>
        </div>
    </Modal>
</template>

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"

import { reactive } from 'vue'
import { notify } from "@kyvg/vue3-notification";
import axios from "@/services/api"
import Rules from '@/components/formPage/Rules';

export default {
    emits: ["close-modal", "success"],
    components: { inputSuggestList },
    props: {
        contract_id: {
            type: String,
            default: () => ""
        },
        contract_customer_name: {
            type: String,
            default: () => ""
        }
    },
    setup(props, { emit }){
        const state = reactive({ isLoading: false, error: "", errors: [], entity_id: "" })

        const rules = {
            entity_id: { required: true }
        }
        
        async function handleSubmit(){
            state.errros = {}
            state.errors = Rules({ entity_id: state.entity_id }, rules)

            if(Object.entries(state.errors).length)
                return notify({
                    title: "Preencha os campos obrigatórios",
                    type: "warn",
                    duration: 6000
                })

            state.isLoading = true;
            
            try {
                const { data } = await axios.post('/registrations/contracts/actions', { 
                    id: props.contract_id, 
                    action: "transfer_contract", 
                    customer: { id: state.entity_id }
                })
                notify({
                    title: "Transferência realizado com sucesso",
                    type: "success",
                    duration: 5000
                })
                emit("close-modal")
                emit("set-customer-name", data.name )
            } catch (error) {
                state.error = error;
            } finally {
                state.isLoading = false;
            }
        }

        return {
            state,
            // methods
            handleSubmit
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
    .customer-name{
        font-size: 1.7em;
    }
    .ctn-buttons{
        display: flex;
        align-items: center;
        justify-content: flex-end;
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