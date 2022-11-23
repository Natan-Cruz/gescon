<template>
    <div>
        <p class="title_2">Definir valores</p>

        <div class="container-alert" v-show="!employees.length">
            <p>Nenhum funcionário selecionado</p>
        </div>

        <div class="wrapper" v-for="employee in employees" :key="employee.id">
            <div class="header">
                <span class="sub-title bold">{{ employee.fullname }}</span>
                <span class="sub-title" style="margin-left: 12px;">{{ employee.role }}</span>
            </div>

            <wrapper-component label="Ganhos" button_label="Adicionar ganho" :disabled="disabled" @add-item="handleAddItemGainProduction(employee.id)">
                <item-gain-production
                    v-for="(gain_production, i) in getDiscounts(employee.id, 'gain_production')" :key="i" 
                    :gain_production="gain_production"
                    :index="i"
                    :disabled="disabled"
                    @edit="handleEditItemGainProduction" 
                    @remove="handleRemoveItemGainProduction">
                </item-gain-production>
            </wrapper-component>

            <wrapper-component label="Descontos" button_label="Adicionar desconto" :disabled="disabled" @add-item="handleAddItemDiscount(employee.id)">
                <item-discount 
                    v-for="(discount, i) in getDiscounts(employee.id, 'discount')" :key="i" 
                    :discount="discount"
                    :index="i"
                    :disabled="disabled"
                    @edit="handleEditItemDiscount"
                    @remove="handleRemoveItemDiscount">
                </item-discount>
            </wrapper-component>

            <wrapper-financial-informations :gains="getDiscounts(employee.id, 'gain_production')" :discounts="getDiscounts(employee.id, 'discount')" :payment_methods="employee.payment_methods"/>
        </div>
    </div>
</template>

<script>
import { useStore } from "../store.js"
import dayjs from "dayjs"
import { computed, onMounted, toRef } from 'vue';
import { nanoid } from "nanoid"

import wrapperComponent from "./wrapperComponent.vue"
import itemGainProduction from "./items/itemGainProduction.vue"
import itemDiscount from "./items/itemDiscount.vue"
import wrapperFinancialInformations from "../informationsFinancial.vue"
import { useRoute } from 'vue-router';

export default {
    components: { wrapperComponent, itemGainProduction, itemDiscount, wrapperFinancialInformations },
    setup(){
        const store = useStore();
        const disabled = false;
        const $route = useRoute()

        const transactions = toRef(store.form, "transactions")

        function getDiscounts(employee_id, type){
            return transactions.value.filter( trx => trx.employee_id === employee_id && trx.type === type && trx.action !== "REMOVE")
        }

        onMounted(() => {
            if(!$route.params.id){
                transactions.value = []

                store.employees.forEach( employee => {
                    const gainsProduction = employee.gains_production.map( production => {
                        return {
                            _id: nanoid(),
                            type: "gain_production",
                            employee_id: production.employee_id,
                            short_description: production.short_description,
                            long_description: production.long_description,
                            value: parseFloat(production.price),
                            quantity: 1,
                            complement: production.unity,
                            payday: production.payday ? dayjs().set("day", production.payday).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
                        }
                    })
                    const discounts = employee.discounts.map( discount => {
                        return {
                            _id: nanoid(),
                            type: "discount",
                            employee_id: discount.employee_id,
                            short_description: discount.name,
                            value: parseFloat(discount.value),
                            payday: discount.payday ? dayjs().set("day", discount.payday).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
                        }
                    })
                    transactions.value = transactions.value.concat(gainsProduction).concat(discounts)
                })
            }
        })

        function handleAddItemGainProduction(employee_id){
            transactions.value.push({
                _id: nanoid(),
                employee_id,
                short_description: "",
                long_description: "",
                value: 0,
                payday: dayjs().format("YYYY-MM-DD"),
                action: "ADD",
                type: "gain_production",
            })
        }
        function handleEditItemGainProduction({ gain_production }){
            let index;
            if(gain_production.id){
                index = transactions.value.findIndex( elem => elem.id === gain_production.id)
                gain_production.action = "UPDATE"
            }
            if(gain_production._id){
                index = transactions.value.findIndex( elem => elem._id === gain_production._id)
            }
            transactions.value.splice(index, 1, gain_production)
        }
        function handleRemoveItemGainProduction({ gain_production }){
            if(gain_production.id){
                const index = transactions.value.findIndex( elem => elem.id === gain_production.id)
                gain_production.action = "REMOVE"
                transactions.value.splice(index, 1, gain_production)
            }
            if(gain_production._id){
                const index = transactions.value.findIndex( elem => elem._id === gain_production._id)
                transactions.value.splice(index, 1)
            }
        }

        function handleAddItemDiscount(employee_id){
            transactions.value.push({
                _id: nanoid(),
                employee_id,
                name: "",
                value: 0,
                payday: dayjs().format("YYYY-MM-DD"),
                action: "ADD",
                type: "discount",
            })
        }
        function handleEditItemDiscount({  discount }){
            let index;
            if(discount.id){
                index = transactions.value.findIndex( elem => elem.id === discount.id)
                discount.action = "UPDATE"
            }
            if(discount._id){
                index = transactions.value.findIndex( elem => elem._id === discount._id)
            }
            transactions.value.splice(index, 1, discount)
        }
        function handleRemoveItemDiscount({ discount }){
            if(discount.id){
                const index = transactions.value.findIndex( elem => elem.id === discount.id)
                discount.action = "REMOVE"
                transactions.value.splice(index, 1, discount)
            }
            if(discount._id){
                const index = transactions.value.findIndex( elem => elem._id === discount._id)
                transactions.value.splice(index, 1)
            }
        }

        function SUM_FUNC(acc, cur){
            acc += cur.value
            return acc
        }

        const employees = computed(() => {
            return store.employees.filter( employee => {
                const idx = store.employeesSelecteds.findIndex( empl_id => empl_id === employee.id)
                if(idx > -1) return employee
            })
        })

        return {
            employees,
            disabled,
            // methods
            handleAddItemGainProduction,
            handleEditItemGainProduction,
            handleRemoveItemGainProduction,
            // 
            getDiscounts,
            handleAddItemDiscount,
            handleEditItemDiscount,
            handleRemoveItemDiscount,
            // 
            SUM_FUNC
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
</style>