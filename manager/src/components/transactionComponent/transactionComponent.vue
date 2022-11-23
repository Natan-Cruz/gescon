<template>
    <div>
        <wrapper-component title="Dados da transação" :show_button_remove="disabled && showButtonRemove" @event-remove="$emit('remove-transaction', transaction)">
            <information
                :trx="transaction" 
                :disabled="disabled"
                :errors="errors"
                :showConfig="showConfig"
                @event-edit="$emit('update:transaction', $event)">
            </information>
        </wrapper-component>

        <!-- multa depois do vencimento da conta -->
        <wrapper-component v-if="transaction.chargeInterest" title="Juros" little_expanation="Ao não pagar fatura">
            <interest 
                :trx="transaction" 
                :disabled="disabled"
                :errors="errors"
                @event-edit="$emit('update:transaction', $event)">
            </interest>
        </wrapper-component>

        <template v-if="transaction.hasRecurrence">
            <wrapper-component title="Recorrência">
                <recurrence
                    :trx="transaction" 
                    :errors="errors"
                    :disabled="disabled"
                    @event-edit="$emit('update:transaction', $event)" >
                </recurrence>
            </wrapper-component>

            <wrapper-component v-if="transaction.hasReadjustment" title="Reajuste">
                <readjustment
                    :trx="transaction"
                    :errors="errors"
                    :disabled="disabled"
                    @event-edit="$emit('update:transaction', $event)">
                </readjustment>
            </wrapper-component>

            <planned-recurrence
                :trx="transaction" 
                @event-edit="$emit('update:transaction', $event)">
            </planned-recurrence>
        </template>
    </div>
</template>

<script>
import wrapperComponent from "./items/wrapperComponent.vue"
// 
import information from "./components/information.vue"
import recurrence from "./components/recurrence.vue"
import interest from "./components/interest.vue"
import readjustment from "./components/readjustments.vue"
import plannedRecurrence from "./components/plannedRecurrence.vue"

export default {
    emits: ["update:transaction", "remove-transaction"],
    components: { wrapperComponent, information, recurrence, interest, readjustment, plannedRecurrence },
    props: {
        transaction: Object,
        errors: Object,
        disabled: {
            type: Boolean,
            required: false,
            default: () => false
        },
        showButtonRemove: {
            type: Boolean,
            required: false,
            default: () => false
        },
        showConfig: {
            type: Object,
            required: false,
            default: () => ({})
        }
    }
}
</script>

<style lang="less" scoped>
    hr{
        border: none;
        border-bottom: dashed 2px rgb(116, 116, 116);
        background-color: transparent;
    }
</style>