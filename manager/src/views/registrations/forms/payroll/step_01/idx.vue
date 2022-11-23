<template>
    <div>
        <p class="title_2">Configurações iniciais</p>

        <div class="form_row">
            <wrapper-input label="Data de início:">
                <input type="date" class="input" v-model="form.start_date">
            </wrapper-input>
            <wrapper-input label="Data de fim:">
                <input type="date" class="input" v-model="form.end_date">
            </wrapper-input>
        </div>

        <div class="form_row">
            <wrapper-input label="Centro de custos:">
                <input-suggest-tree
                    url="/financial/cost-center"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione um centro de custo"
                    v-model="form.cost_center_id"/>
            </wrapper-input>
            <wrapper-input label="Plano de contas:">
                <input-suggest-list
                    url="/financial/chart-accounts"
                    :options="{ key: 'id', displayName: 'long_description'}"
                    :attach_leaf_node="3"
                    placeholder="Selecione um plano de conta"
                    v-model="form.chart_account_id"/>
            </wrapper-input>

             <wrapper-input label="Conta bancária:">
                <input-suggest-list
                    url="/financial/bank/accounts?type=bank_accounts"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione uma conta bancaria de destino"
                    v-model="form.account_id"/>
            </wrapper-input>
        </div>

        <p class="title_2">Funcionários</p>

        <ul class="list-employees">
            <li class="border_bottom">
                <input type="checkbox" id="all" :checked="selectAllIsChecked" @change="handleSelectOrDeselectAll">
                <label for="all">Selecionar todos</label>
            </li>
            <li v-for="employee in employees" :key="employee.id">
                <input type="checkbox" :id="employee.id" :checked="isChecked(employee.id)" @change="handleSelectOrDeselectOne($event, employee.id)">
                <label :for="employee.id">{{ employee.fullname }} <span v-if="employee.role" class="sub-text" style="color: gray"> - {{ employee.role }}</span></label>
            </li>
        </ul>
    </div>
</template>

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import inputSuggestTree from "@/components/inputSuggest/inputSuggestTree.vue"

import { useStore } from "../store.js"
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export default {
    components: { inputSuggestList, inputSuggestTree },
    setup(){
        const store = useStore();

        const { employees, employeesSelecteds } = storeToRefs(store)

        const selectAllIsChecked = computed(() => {
            return employees.value.length === employeesSelecteds.value.length && (employees.value.length > 0 && employeesSelecteds.value.length > 0)
        })

        function isChecked(employee_id){
            return employeesSelecteds.value.findIndex( empl_id => empl_id === employee_id) > -1
        }

        function handleSelectOrDeselectAll(evt){
            const checked = evt.target.checked

            if(checked){
                employees.value.forEach( employee => {
                    employeesSelecteds.value.push(employee.id)
                })
            }else{
                employeesSelecteds.value.length = 0
            }
        }

        function handleSelectOrDeselectOne(evt, employee_id){
            const checked = evt.target.checked

            if(checked){
                employeesSelecteds.value.push(employee_id)
            }else{
                const index = employeesSelecteds.value.findIndex( empl_id => empl_id === employee_id)   
                employeesSelecteds.value.splice(index, 1)
            }
        }

        return {
            employees,
            form: store.form,
            selectAllIsChecked,
            // methods
            isChecked,
            handleSelectOrDeselectAll,
            handleSelectOrDeselectOne
        }
    }
}
</script>

<style lang="less" scoped>
    .list-employees{
        li{
            margin-bottom: 10px;
        }

        li input{
            width: 17px;
            height: 17px;
        }
        li label{
            font-size: 1.7em;
            margin-left: 12px;

            cursor: pointer;
            
            &:hover{
                text-decoration: underline;
            }
        }
    }
    .border_bottom{
        border-bottom: dashed 1px gray;
        padding-bottom: 8px;
    }
</style>