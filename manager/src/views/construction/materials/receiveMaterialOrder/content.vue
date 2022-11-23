<template>
    <div>
        <div class="list-info form_spacing_bottom">
            <row label="Numero do pedido" :value="`# ${ data.number }`" />
            <row label="Fornecedor" :value="data.entity_name">
                <router-link :to="{ name: 'registrations/form_entity', params: { id: data.entity_id }, query: { previous: $route.fullPath }}" class="button button-tertiary text-medium link">Consultar fornecedor</router-link>
            </row>
            <row label="Valor do frete" :value="formatCurrency(data.cost_of_freight)" />
            <row label="Comprado em" :value="formatDate(data.purchase_date)" />
            <row label="Previsão de entrega" :value="formatDate(data.delivery_date)" />
            <row label="Entrega em" :value="formatDate(data.delivered_in)" />
            <row label="Anotação" :value="data.description" />
        </div>
        <div v-if="data.delivered_in" class="form_spacing_bottom container-alert">
            <span>Material foi entregue!!</span>
        </div>
        
        <wrapper-attachments class="form_spacing_bottom" 
            :attachments="attachments" @update="$emit('update-attachments')" 
            :id="$route.params.id"/>

        <div class="wrapper-buttons" v-show="data.delivered_in && showButtonSaveAttachments">
            <button class="button button-primary text-medium" @click="$emit('submit')">Salvar anexos</button>
        </div>

        <hr class="hr-form form_spacing_bottom"/>

        <div>
            <p class="sub-title">Produtos e materiais</p>
            <ul>   
                <li v-for="(item, i) in data.items" :key="item.id">
                    <row label="Nome do material" :value="item.material_name" />
                    <row label="Unidade" :value="item.unity" />
                    <row label="Quantidade" :value="item.quantity" />
                    <row label="Valor unitário" :value="formatCurrency(item.unitary_value)" />
                    <row label="Total" :value="formatCurrency(item.amount)" />
                    <wrapper-input label="Anotação">
                        <textarea-autosize
                            placeholder="Anote aqui..."
                            :value="item.anotation || item.new_anotation"
                            @update:modelValue="$emit('updated-item-anotation', { index: i, anotation: $event })"
                            :minHeight="40"
                            :maxHeight="250"
                            :maxLength="255"
                            :disabled="data.delivered_in">
                        </textarea-autosize>
                    </wrapper-input>
                </li> 
            </ul>
        </div>

        <div class="wrapper-buttons" v-show="!data.delivered_in">
            <button class="button button-primary text-medium" @click="$emit('submit')">Receber entrega</button>
        </div>
    </div>
</template>

<script>
import row from "./row.vue"
import wrapperAttachments from "@/components/wrapperAttachments/index.vue"

import { computed } from 'vue';
import { isFile, formatDate, formatCurrency } from "@/Utils/index.js";

export default {
    components: { row, wrapperAttachments },
    emits: ["update-attachments", "updated-item-anotation"],
    props: {
        data: Object,
        attachments: Array
    },
    setup(props){
        const showButtonSaveAttachments = computed(() => {
            return props.attachments.findIndex( item => isFile(item)) > -1 || props.attachments.findIndex( item => item.action ) > -1
        })
        return {
            formatDate,
            formatCurrency,
            showButtonSaveAttachments,
        }
    }
}
</script>

<style lang="less" scoped>
    .link{
        justify-content: flex-start;
        height: auto;
        margin-top: 4px;
    }
    .container-alert{
        width: 100%;
        height: auto;
        background-color: #fde52f;
        padding: 10px;
        font-size: 1.7em;
        span{
            font-size: 1em;
            color: #5f5404;
        }

    }
    .sub-title{
        font-size: 1.8em;
        font-weight: bold;
        margin: 16px 0;
    }
    .wrapper-buttons{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 16px;
    }
    .button-primary{
        width: auto;
        height: auto;
        padding: 10px 12px;
    }
</style>