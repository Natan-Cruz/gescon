<template>
    <li class="item">
        <expandable-content style="margin-bottom: 8px" :title="mQuotation.provider_name" :font="18" :isBold="true">
            <div class="ctn_customer">
                <ul class="customer-infos">
                    <li v-if="mQuotation.provider_email">{{ mQuotation.provider_email }}</li>
                    <li v-if="mQuotation.provider_commercial_phone">{{ mQuotation.provider_commercial_phone }}</li>
                    <li v-if="mQuotation.provider_cellphone">{{ mQuotation.provider_cellphone }}</li>
                </ul>
                <ul class="customer-infos border_dashed">
                    <li>{{ address }}</li>
                </ul>
                <ul style="margin-top: 8px">
                    <row label="Messagem" :width="widthRow">{{ mQuotation.message }}</row>
                    <row label="Tipo do frete" :width="widthRow">{{ mQuotation.type_freight }}</row>
                    <row label="Termos do pagamento" :width="widthRow">{{ mQuotation.payment_term_days }} {{ mQuotation.payment_terms }}</row>
                    <row label="Método do pagamento" :width="widthRow">{{ mQuotation.payment_method }}</row>
                    <row label="Tempo de entrega" :width="widthRow">{{ mQuotation.delivery_time }} dias</row>
                    <row label="Valor mínimo" :width="widthRow">{{ formatCurrency(mQuotation.minimum_value) }}</row>
                    <row label="Custo de frete" :width="widthRow">{{ formatCurrency(mQuotation.freight_cost) }}</row>
                    <row label="Total produtos" :width="widthRow">{{ formatCurrency(itemsTotal) }}</row>
                    <row label="Total pedido" :width="widthRow">{{ formatCurrency(itemsTotal) }}</row>
                    <row label="Status" :width="widthRow">{{ status }}</row>
                </ul>
            </div>
        </expandable-content>

        <expandable-content title="Produtos e materias" :font="16" :isBold="true">
            <ul style="margin-top: 12px">
                <slot />
            </ul>
        </expandable-content>
    </li>
</template>

<script>
import { computed } from 'vue'

import expandableContent from "../expandableContent.vue"
import row from "../row.vue";
import { formatCurrency } from "@/Utils/index.js";

export default {
    components: { expandableContent, row },
    props: { mQuotation: Object },
    setup(props){
        const address = computed(() => {
            const { provider_street, provider_number, provider_neighborhood, provider_city, provider_state } = props.mQuotation;

            const number = provider_number ? "Nº " + provider_number : ""
            const neighborhood = provider_neighborhood ? ", " + provider_neighborhood : ""
            
            return `${provider_street} ${number}${neighborhood} ${provider_city} ${provider_state}`
        })
        const itemsTotal = computed(() => {
            return props.mQuotation.items.reduce((acc,cur) => {
                acc += (cur.unitary_value * cur.quantity)
                return acc
            }, 0)
        })
        const quotationTotal = computed(() => {
            return itemsTotal.value + (props.mQuotation.freight_cost || 0)
        })

        const status = computed(() => {
            return props.mQuotation.status.reduce((acc, cur, i) => {
                if(i > 0)
                    acc += " > " +  getInfo(cur.status)
                else    
                    acc += getInfo(cur.status)
                return acc
            }, "")
        })

        function getInfo(status_code){
            switch(status_code){
                case "created": return "Criado";
                case "email_sent": return "Email enviado";
                case "email_error": return "Erro no Email";
                case "quotation_viwed": return "Visto pelo fornecedor";
                case "c_quotation_edited": return "Editado pela construtora";
                case "p_quotation_edited": return "Editado pelo fornecedor";
                case "approved_quotation": return "Aprovada";
                case "disapproved_quotation": return "Recusada";
            }
        }

        return {
            address,
            widthRow: 180,
            status,
            // computed
            itemsTotal,
            quotationTotal,
            // methods
            formatCurrency
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        border-radius: 5px;
        border: solid 1px rgb(197, 197, 197);
        padding: 8px 12px;
        margin-bottom: 18px;
    }
    .ctn_customer{
        cursor: default;
        margin-bottom: 6px;
    }
    .border_dashed{
        border-bottom: dashed 1px rgb(197, 197, 197);
        padding-bottom: 12px;
    }
    .customer-name{
        font-size: 1.7em;
        color: rgb(73, 73, 73);
        cursor: default;
    }
    .customer-infos{
        li{
            font-size: 1.5em;
            color: gray;
            display: inline-block;
            position: relative;
            padding-left: 8px;
            margin-right: 15px;

            &::before{
                content: "";
                display: block;
                position: absolute;
                left: 0;
                top: 8px;
                border-radius: 5px;
                background-color: gray;
                width: 4px;
                height: 4px;
            }
        }
    }
</style>