<template>
    <form-page linkBack="/main/material-orders" :config="config">

        <wrapper-input label="Descrição:" class="form_spacing_bottom">
            <textarea-autosize 
                v-model="form.description"
                :minHeight="50"
                placeholder="Anote algo aqui..." 
                :disabled="disabled" >
            </textarea-autosize>
        </wrapper-input>


        <div class="form_row">
            <wrapper-input label="Fornecedor do pedido:" :error="errors.entity_id">
                <input-suggest-list
                    url="/registrations/material-provider?minimal=true"
                    :options="{ key: 'id', displayName: 'name' }"
                    placeholder="Selecione fornecedor"
                    v-model="form.entity_id" :disabled="disabled">
                </input-suggest-list>
            </wrapper-input>

            <wrapper-input label="Para qual obra?" :error="errors.construction_id">
                <input-suggest-list
                    url="/constructions"
                    :options="{ key: 'id', displayName: 'name', default: true }"
                    placeholder="Selecione uma obra" v-model="form.construction_id" :disabled="disabled" />
            </wrapper-input>
        </div>

        <hr class="hr-form">

        <div class="form_row">
            <wrapper-input label="Tipo de frete:">
                <select class="select" v-model="form.type_freight">
                    <option value=""></option>
                    <option value="FOB">FOB - Free on board</option>
                    <option value="CIF">CIF - Cost, Insurance and Freight</option>
                </select>
            </wrapper-input>

            <wrapper-input label="Condições de pagamento">
                <select class="select" v-model="form.payment_terms">
                    <option value=""></option>
                    <option value="DDL">DDL</option>
                    <option value="DDF">DDF</option>
                    <option value="DFM">DFM</option>
                    <option value="DFQ">DFQ</option>
                    <option value="DFS">DFS</option>
                </select>
            </wrapper-input>

            <wrapper-input label="Cobrança de embalagem:">
                <select class="select" v-model="form.packaging_charge">
                    <option :value="0"></option>
                    <option :value="1">Sim</option>
                    <option :value="0">Nao</option>
                </select>
            </wrapper-input>

            <wrapper-input label="Valor da frete:" id="cost_of_freight">
                <input-money class="input" id="cost_of_freight" v-model="form.cost_of_freight" :disabled="disabled"/>
            </wrapper-input>
        </div>

        <hr class="hr-form">

        <div class="form_row">
            <wrapper-input label="Data da compra:" :error="errors.purchase_date">
                <input type="date" class="input" v-model="form.purchase_date" :disabled="disabled" >
            </wrapper-input>

            <wrapper-input label="Previsão de entrega:" :error="errors.delivery_date">
                <input type="date" class="input" v-model="form.delivery_date" :disabled="disabled" >
            </wrapper-input>

            <wrapper-input label="Entregue em:">
                <input type="date" class="input" v-model="form.delivered_in" :disabled="disabled" >
            </wrapper-input>
        </div>

        <hr class="hr-form form_spacing_bottom"/>
    
        <wrapper-attachments class="form_spacing_bottom" 
            v-model="form.attachments" 
            :id="$route.params.id" 
            :disabled="disabled"/>

        <hr class="hr-form form_spacing_bottom"/>

        <div>
            <p class="sub-title">Itens do pedido</p>

            <ul>
                <item-order 
                    v-for="(data, i) of itemsAndErrors" :key="data.item._id" 
                    :item="data.item" 
                    :errors="data.errors"
                    :index="i"
                    :disabled="disabled"
                    @edit="handleEditItem" 
                    @remove="handleRemoveItem">
                </item-order>
            </ul>

            <button v-show="!disabled" class="button-add" @click="handleAddItem">Adicionar item</button>
        </div>

    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import { useStore } from "@/components/formPage/store.js"

import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import wrapperAttachments from "@/components/wrapperAttachments/index.vue"
import itemOrder from "./item.vue"
import inputMoney from "@/components/inputMoney/inputMoney.vue"

import { storeToRefs } from "pinia";
import { computed } from 'vue';
import { nanoid } from "nanoid"

export default {
    components: { formPage, inputSuggestList, wrapperAttachments, itemOrder, inputMoney },
    setup(){
        const store = useStore();
        store.resetState()

        const { form, errors, editMode } = storeToRefs(store);

        const config = computed(() => ({
            urls: {
                fetch: "/materials/material-orders/?",
                create: "/materials/material-orders",
                edit: "/materials/material-orders",
                delete: "/materials/material-orders"
            },
            reqHeaders: {
                fileFullPath: "",
                newPathLtree: "",
                rootPathLtree: `${ form.value.construction_id }._PURMAT_`,
                reference_table: "construction_scheme.material_order_attachments",
                reference_key: "order_id",
            },
            rules: {
                construction_id: { required: true },
                items: {
                    isArray: true,
                    rules: {
                        material_id: { required: true }
                    },
                }
            }
        }))

        const itemsAndErrors = computed(() => {
            if(form.value.items)
                return form.value.items.map((item, i) => {
                    const err = errors.value.items && errors.value.items[i]
                    return { item: item, errors: err }
                })
            else
                return []
        })


        function handleAddItem(){
            const item = {
                _id: nanoid(),
                material_id: "",
                unity: "",
                quantity: 0,
                unitary_value: 0,
                amount: 0,
                action: "ADD"
            }
            if(form.value.items){
                form.value.items.push(item)
            }else{
                form.value.items = [ item ]
            }
        }

       function handleEditItem({ item }){
            let index;
            if(item.id){
                index = form.value.items.findIndex( elem => elem.id === item.id)
                item.action = "UPDATE"
            }
            if(item._id){
                index = form.value.items.findIndex( elem => elem._id === item._id)
            }
            form.value.items.splice(index, 1, item)
        }
        function handleRemoveItem({ item }){
            if(item.id){
                const index = form.value.items.findIndex( elem => elem.id === item.id)
                item.action = "REMOVE"
                form.value.items.splice(index, 1, item)
            }
            if(item._id){
                const index = form.value.items.findIndex( elem => elem._id === item._id)
                form.value.items.splice(index, 1)
            }
        }

        return {
            config,
            disabled: editMode,
            form,
            errors,
            itemsAndErrors,
            // methods
            handleAddItem,
            handleEditItem,
            handleRemoveItem
        }
    }
}
</script>

<style lang="less" scoped>
    .sub-title{
        font-size: 1.8em;
        margin: 12px 0 24px 0;
        color: rgb(53, 53, 53);
        font-weight: bold;
    }
    .button-add{
        width: auto;
        height: auto;
        border-radius: 5px;
        border: solid 1px gray;
        cursor: pointer;
        font-size: 1.5em;
        padding: 4px;
        transition: transform 250ms;
        &:active{
            transform: scale(.8);
        }
    }
</style>