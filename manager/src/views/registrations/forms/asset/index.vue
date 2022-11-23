<template>
    <form-page linkBack="/main/assets" :config="config">
        <div class="form_row">
            <wrapper-input label="Nome do ativo:">
                <input type="text" class="input" v-model="form.name" :disabled="disabled">
            </wrapper-input>

            <wrapper-input label="Em qual lugar?">
                <input-suggest-tree
                    url="/financial/cost-center"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione um centro de custo"
                    v-model="form.cost_center_id" :disabled="disabled"/>
            </wrapper-input>

            <wrapper-input label="Empreendimento:">
                <input-suggest-list
                    url="/registrations/assets-projects"
                    :options="{ key: 'id', displayName: 'name' }"
                    placeholder="Selecione um empreendimento"
                    v-model="form.project_asset_id" :disabled="disabled" />
            </wrapper-input>
        </div>

        <div class="form_row">
            <wrapper-input label="Valor do ativo:">
                <input-money class="input" type="text" v-model="form.value" :disabled="disabled"/>
            </wrapper-input>

            <wrapper-input label="Área útil:">
                <input-money class="input" v-model="form.useful_area" :options="options" :disabled="disabled"/>
            </wrapper-input>
            
            <wrapper-input label="Área comum:">
                <input-money class="input" v-model="form.common_area" :options="options" :disabled="disabled"/>
            </wrapper-input> 

            <wrapper-input label="Área bruta:">
                <input-money class="input" v-model="form.gross_floor_area" :options="options" :disabled="disabled"/>
            </wrapper-input>
        </div>

        <div>
            <p class="sub-title">Contratos</p>
            <ul class="list-contracts">
                <li v-for="contract in form.contracts" :key="contract.id">
                    <row label="Cliente" :width="widthRow">{{ contract.customer_name }}</row>
                    <row label="Tipo do contrato" :width="widthRow">{{ getContractType(contract.type) }}</row>
                    <row label="Status" :width="widthRow">{{ getContractStatus(contract.status) }}</row>
                    <row label="Criado em" :width="widthRow">{{ formatDate(contract.created_at) }}</row>
                    <row v-if="contract.canceled_at" label="Cancelado em" :width="widthRow">{{ formatDate(contract.canceled_at) }}</row>
                </li>
            </ul>
            <p v-show="!form.contracts || !form.contracts.length" class="without-item">Nenhum contrato, ativo disponível</p>
        </div>
      
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import inputSuggestTree from "@/components/inputSuggest/inputSuggestTree.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import inputMoney from "@/components/inputMoney/inputMoney.vue"
import row from "./row.vue"

import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia" 
import { formatDate } from '@/Utils/index.js'

export default {
    components:{
        formPage,
        inputMoney,
        // 
        inputSuggestTree,
        inputSuggestList,
        row
    },
    setup(){
        const store = useStore();
        store.resetState()
        const { form, editMode } = storeToRefs(store);
        const config = {
            urls: {
                fetch: "/registrations/assets/?",
                create: "/registrations/assets",
                edit: "/registrations/assets",
                delete: ""
            }
        }
        const options = {
            prefix: "",
            sufix: "m²",
            decimals: 4
        }

        function getContractType(type){
            const t = {
                sale: "Venda",
                rent: "Aluguel"
            }
            return t[type]
        }
        function getContractStatus(status){
            const s = {
                draft: "Rascunho",
                active: "Ativo",
                canceled_contract: "Contrato cancelado",
                contract_concluded: "Contrato concluido"
            }
            return s[status] ? s[status] : "Não definido"
        }

        return {
            config,
            disabled: editMode,
            form,
            widthRow: 130,
            // 
            options,
            formatDate,
            // 
            getContractType,
            getContractStatus
        }
    }
}
</script>

<style lang="less" scoped>
    .sub-title{
        font-size: 2em;
        font-weight: bold;
    }

    .list-contracts{
        margin-bottom: 12px;
        li{
            position: relative;
            padding-left: 12px;
        }
    }
</style>