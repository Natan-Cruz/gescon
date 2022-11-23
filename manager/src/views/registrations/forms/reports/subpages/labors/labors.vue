<template>
    <div class="wrapper wrapper-employees">

         <ul class="list-employees">
            <li class="border_bottom">
                <input type="checkbox" id="all" :checked="selectAllIsChecked" @change="handleSelectOrDeselectAll">
                <label style="font-size: 1.8em" for="all">Selecionar todos</label>
            </li>
            <li v-for="employee in employees" :key="employee.id">
                <input type="checkbox" :id="employee.id" :checked="isChecked(employee.id)" @change="handleSelectOrDeselectOne($event, employee.id)">
                <label :for="employee.id">
                    <span class="employee_name">{{ employee.fullname }}</span>
                    <span v-if="employee.role" class="gray"> - {{ employee.role }}</span>
                    <span class="gray"> - {{ employee.company_name }}</span>
                </label>
            </li>
        </ul>

        <!-- BTN SAVE ALTERATIONS -->
        <div class="wrapper-buttons" v-if="showButtons">
            <button class="button button-second text-medium" @click="cancel"  :disabled="state.isLoading">Cancelar</button>
            <button class="button button-primary text-medium" @click="saveEmployees"  :disabled="state.isLoading">Salvar</button>
        </div>
    </div>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import axios from "@/services/api"
import { notify } from '@kyvg/vue3-notification';

export default {
    props:{ 
        report: Object,  
        construction_id: String,
        report_id: String,
    },
    setup(props){
        const employees = ref([]);
        const employeesSelecteds = ref([]);
        const state = reactive({ isLoading: false, error: "" });
        const selectAllIsChecked = computed(() => {
            return employees.value.length === employeesSelecteds.value.length && (employees.value.length > 0 && employeesSelecteds.value.length > 0)
        })
        const showButtons = computed(() =>  props.report.employees && props.report.employees.length !== employeesSelecteds.value.length)

        fetchEmployees()
        async function fetchEmployees(){
            try {
                const { data } = await axios.get("/registrations/employees")
                employees.value = data;
                const employeesIds = props.report.employees.map(({ employee_id }) => employee_id)
                employeesSelecteds.value = employeesIds
            } catch (error) {
                console.error(error)                
            }
        }

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

        async function saveEmployees(){
            const url = `/constructions/${ props.construction_id }/reports/${ props.report.id }`,
                body = { employees: employeesSelecteds.value }

            state.isLoading = true;
            state.error = "";

            try {
                await axios.put(url, body)
                notify({
                    title: "Empregados salvos com sucesso!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                console.error(error)
                state.error = error
            }finally{
                state.isLoading = false
            }
        }

        return {
            state,
            employees,
            selectAllIsChecked,
            employeesSelecteds,
            showButtons,
            // methods
            isChecked,
            handleSelectOrDeselectAll,
            handleSelectOrDeselectOne,
            saveEmployees
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
    .employee_name{
        font-size: 1.7em;
    }
    .gray{
        font-size: 1.5em;
        color: gray;
    }
</style>