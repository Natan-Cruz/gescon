<template>
    <form-page :config="config">

        <p class="quotation-number">Número da cotação: #{{ form.number }}</p>

        <wrapper-input :label="labelMessage" class="form_spacing_bottom" :error="errors.c_message">
            <textarea-autosize 
                v-model="form.c_message"
                :maxLength="5"
                placeholder="Anote algo aqui..."
                :disabled="disabled" 
                @set-error="errors.c_message = $event">
            </textarea-autosize>
        </wrapper-input>

        <div class="form_row">
            <wrapper-input label="Fornecedor(es)?" :error="errors.providers">
                <input-suggest-list
                    url="/registrations/all?minimal=true"
                    :options="{ key: 'id', displayName: 'name', multi_select: true }"
                    placeholder="Selecione os fornecedores" v-model="form.providers" :disabled="disabled" />
            </wrapper-input>

            <wrapper-input label="Responsável pela cotação" :error="errors.responsible_user_id">
                <input-suggest-list
                    url="/users/admin"
                    :options="{ key: 'id', displayName: [ '? ? - ?', 'first_name', 'last_name', 'title' ]}"
                    :url_search="false"
                    placeholder="Selecione o responsável" v-model="form.responsible_user_id" :disabled="disabled" />
            </wrapper-input>
        </div>

        <hr class="hr-form">

        <div class="form_row">
            <wrapper-input label="Expiração da cotação" :error="errors.expiration_date">
                <input type="date" class="input" v-model="form.expiration_date" :disabled="disabled">
            </wrapper-input>

            <wrapper-input label="Endereço de entrega" :error="errors.delivery_address">
                <input type="text" class="input" v-model="form.delivery_address" :disabled="disabled">
            </wrapper-input>

            <wrapper-input label="Tipo de frete:">
                <select class="select" v-model="form.c_type_freight" :disabled="disabled">
                    <option value=""></option>
                    <option value="FOB">FOB - Free on board</option>
                    <option value="CIF">CIF - Cost, Insurance and Freight</option>
                </select>
            </wrapper-input>

            <wrapper-input label="Tipo de pagamento" :disabled="disabled">
                <select-payment-methods v-model="form.c_payment_method" :disabled="disabled"/>
            </wrapper-input>
        </div>

        <hr class="hr-form">

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

            <button v-show="!disabled" class="button-add" @click="handleAddItem">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"/></svg>
                Adicionar item
            </button>
        </div>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia";
import selectPaymentMethods from "@/components/selectPaymentMethods.vue"

import itemOrder from "./item.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import { computed } from 'vue';
import { nanoid } from "nanoid";
import { useRoute } from "vue-router"

export default {
    components: { formPage, inputSuggestList, itemOrder, selectPaymentMethods },
    setup(){
        const store = useStore();
        store.resetState();
        const $route = useRoute()

        const labelMessage = computed(() => {
            const { edit_all } = $route.query
            return edit_all ? "Alguma mensagem a(os) fornecedor(es)?" : "Mensagem ao fornecedor"
        })

        const { form, errors, editMode } = storeToRefs(store);

        const config = computed(() => {
            const query = $route.query.edit_all ? "?edit_all=0" : "?edit_all=1"
            return {
                urls: {
                    fetch: "/materials/material-quotations/?" + query,
                    create: "/materials/material-quotations",
                    edit: "/materials/material-quotations",
                    delete: ""
                },
                rules: {
                    expiration_date: { required: true },
                    delivery_address: { required: true },
                    items: {
                        isArray: true,
                        rules: {
                            material_name: { required: true },
                            unity: { required: true },
                            quantity: { required: true }
                        }
                    }
                }
            }
        })

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
                material_name: "",
                unity: "",
                quantity: 0,
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
            labelMessage,
            // methods
            handleAddItem,
            handleEditItem,
            handleRemoveItem
        }
    }
}
</script>

<style lang="less" scoped>
    .quotation-number{
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 24px;
    }

    .sub-title{
        font-size: 1.8em;
        margin: 12px 0 18px 0;
        color: rgb(53, 53, 53);
        font-weight: bold;
    }
    .button-add{
       @color: #f70;

        width: auto;
        height: auto;
        justify-self: left;
        z-index: 1000;

        padding: 6px;

        border: dashed 1px @color;
        color: @color;
        fill: @color;
        background-color: #fff;
        
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.6em;
        transition: 200ms;

        display: flex;
        align-items: center;

        &:active{
            transform: scale(.8);
        }

        svg{
            margin-right: 8px;
        }
    }
</style>