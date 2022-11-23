<template>
    <form-page linkBack="/main/equipments" :config="config">
    
        <wrapper-input id="fullname" label="Nome completo:" class="form_spacing_bottom" :error="errors.fullname">
            <input type="text" class="input" id="fullname" v-model="form.fullname" placeholder="Nome completo..." :disabled="disabled">
        </wrapper-input>

        <div class="form_row form_spacing_bottom">
            <wrapper-input id="role" label="Função do funcionário:" :error="errors.role">
                <input type="text" class="input" id="role" v-model="form.role" placeholder="Função do funcionário" :disabled="disabled">
            </wrapper-input>

            <wrapper-input id="type" label="Tipo de contrato:" :error="errors.type_employment_contract">
                <select class="select" v-model="form.type_employment_contract" :disabled="disabled">
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="Outro">Outro</option>
                </select>
            </wrapper-input>
        </div>
        
        <wrapper-component label="Métodos de pagamentos" button_label="Adicionar método de pagamento" :disabled="disabled" @add-item="handleAddItemPaymentMethod">
            <item-payment-method 
                v-for="(payment_method, i) in paymentMethods" :key="i" 
                :payment_method="payment_method"
                :index="i"
                :disabled="disabled"
                @edit="handleEditItemPaymentMethod" 
                @remove="handleRemoveItemPaymentMethod">
            </item-payment-method>
        </wrapper-component>

        <wrapper-component label="Ganhos" button_label="Adicionar ganho por produção" :disabled="disabled" @add-item="handleAddItemGainProduction">
            <item-gain-production
                v-for="(gain_production, i) in gainsProduction" :key="i" 
                :gain_production="gain_production"
                :index="i"
                :disabled="disabled"
                @edit="handleEditItemGainProduction" 
                @remove="handleRemoveItemGainProduction">
            </item-gain-production>
        </wrapper-component>

        <wrapper-component label="Descontos" button_label="Adicionar desconto" :disabled="disabled" @add-item="handleAddItemDiscount">
            <item-discount 
                v-for="(discount, i) in discounts" :key="i" 
                :discount="discount"
                :index="i"
                :disabled="disabled"
                @edit="handleEditItemDiscount"
                @remove="handleRemoveItemDiscount">
            </item-discount>
        </wrapper-component>

    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import wrapperComponent from "./wrapperComponent.vue"

import itemGainProduction from "./items/itemGainProduction.vue"
import itemPaymentMethod from "./items/itemPaymentMethod.vue"
import itemDiscount from "./items/itemDiscount.vue"

import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia";
import { computed } from 'vue'

export default {
    components: { formPage, wrapperComponent, itemGainProduction, itemPaymentMethod, itemDiscount },
    setup(){
        const store = useStore();
        store.resetState()
     
        const { form, errors, editMode } = storeToRefs(store);

        const config = {
            urls: {
                fetch: "/registrations/employees/?",
                create: "/registrations/employees",
                edit: "/registrations/employees",
                delete: "/registrations/employees"
            },
            rules: {
                fullname: { required: true },
                role: { required: true },
                type_employment_contract: { required: true }
            }
        }

        function handleAddItemGainProduction(){
            let item = {
                short_description: "",
                long_description: "",
                unity: "",
                price: "",
                action: "ADD"
            }
            store.$patch( state => {
                if(state.form.gains_production)
                    state.form.gains_production.push(item)
                else
                    state.form.gains_production = [item]
            })
        }
        function handleEditItemGainProduction({ index, gain_production }){
            if(gain_production.id){
                gain_production.action = "UPDATE"
            }

            store.$patch( state => state.form.gains_production.splice(index, 1, gain_production))
        }
        function handleRemoveItemGainProduction({ index, gain_production }){
            if(gain_production.id){
                gain_production.action = "REMOVE"
                store.$patch( state => state.form.gains_production.splice(index, 1, gain_production))
            }else{
                store.$patch( state => state.form.gains_production.splice(index, 1))
            }
        }

        // 
        function handleAddItemPaymentMethod(){
            let item = {
                payment_method: "",
                description: "",
                action: "ADD"
            }

            store.$patch( state => {
                if(state.form.payment_methods)
                    state.form.payment_methods.push(item)
                else
                    state.form.payment_methods = [item]
            })
        }
        function handleEditItemPaymentMethod({ index, payment_method }){
            if(payment_method.id){
                payment_method.action = "UPDATE"
            }
            store.$patch( state => state.form.payment_methods.splice(index, 1, payment_method))
        }
        function handleRemoveItemPaymentMethod({ index, payment_method }){
            if(payment_method.id){
                payment_method.action = "REMOVE"
                store.$patch( state => state.form.payment_methods.splice(index, 1, payment_method))
            }else{
                store.$patch( state => state.form.payment_methods.splice(index, 1))
            }
        }
        //
        function handleAddItemDiscount(){
            let item = {
                name: "",
                value: 0,
                payday: "",
                action: "ADD"
            }
            store.$patch( state => {
                if(state.form.discounts)
                    state.form.discounts.push(item)
                else
                    state.form.discounts = [item]
            })
        }
        function handleEditItemDiscount({ index, discount }){
            if(discount.id){
                discount.action = "UPDATE"
            }
            store.$patch( state => state.form.discounts.splice(index, 1, discount))
        }
        function handleRemoveItemDiscount({ index, discount }){
            if(discount.id){
                discount.action = "REMOVE"
                store.$patch( state => state.form.discounts.splice(index, 1, discount))
            }else{
                store.$patch( state => state.form.discounts.splice(index, 1))
            }
        }
      
        const filter = elem => elem.action !== "REMOVE"
        
        return {
            config,
            disabled: editMode,
            // form
            form,
            errors,
            gainsProduction: computed(() => form.value.gains_production && form.value.gains_production.filter(filter)),
            paymentMethods: computed(() => form.value.payment_methods && form.value.payment_methods.filter(filter)),
            discounts: computed(() => form.value.discounts && form.value.discounts.filter(filter)),
            // 
            handleAddItemGainProduction,
            handleEditItemGainProduction,
            handleRemoveItemGainProduction,
            // 
            handleAddItemPaymentMethod,
            handleEditItemPaymentMethod,
            handleRemoveItemPaymentMethod,
            // 
            handleAddItemDiscount,
            handleEditItemDiscount,
            handleRemoveItemDiscount
        }
    }
}
</script>