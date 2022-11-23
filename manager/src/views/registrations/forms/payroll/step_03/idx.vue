<template>
    <div>
        <p class="title_2">Confimar valores</p>

        <div class="container-alert" v-show="!employees.length">
            <p>Nenhum funcionário selecionado</p>
        </div>

        <div class="wrapper" v-for="employee in employees" :key="employee.id">
            <div class="header">
                <span class="sub-title bold">{{ employee.fullname }}</span>
                <span class="sub-title" style="margin-left: 12px;">{{ employee.role }}</span>
            </div>

            <wrapper-financial-informations :gains="getDiscounts(employee.id, 'gain_production')" :discounts="getDiscounts(employee.id, 'discount')" :payment_methods="employee.payment_methods"/>
        </div>

        <div class=" header" v-if="employees.length">
            <p class="title_2">Total</p>
            <p class="total">{{ payrollAmount }}</p>
        </div>
    </div>
</template>

<script>
import { useStore } from "../store.js"
import { computed, toRef } from 'vue';

import wrapperFinancialInformations from "../informationsFinancial.vue"
import { formatCurrency } from '@/Utils/index.js';

export default {
    components: { wrapperFinancialInformations },
    setup(){
        const store = useStore();
        const disabled = false

        const transactions = toRef(store.form, "transactions")

        function getDiscounts(employee_id, type){
            return transactions.value.filter( trx => trx.employee_id === employee_id && trx.type === type && trx.action !== "REMOVE")
        }
        const employees = computed(() => {
            return store.employees.filter( employee => {
                const idx = store.employeesSelecteds.findIndex( empl_id => empl_id === employee.id)
                if(idx > -1) return employee
            })
        })

        const payrollAmount = computed(() => {
            if(!transactions.value) return ""

            const amount = transactions.value.reduce((acc,cur) => {
                if(cur.type === "gain_production")
                    acc += parseFloat(cur.value)
                else
                    acc -= parseFloat(cur.value)

                return acc
            }, 0)

            return formatCurrency(amount)
        })

        return {
            employees,
            disabled,
            // methods
            getDiscounts,
            payrollAmount
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper{
        margin-bottom: 36px;
    }
    .header{
        background-color: rgb(219, 219, 219);
        padding: 10px;
        margin: 12px 0;
    }
    .sub-title{
        font-size: 1.8em;
        color: rgb(26, 26, 26);
    }
    .total{
        font-size: 2em;
    }
</style>