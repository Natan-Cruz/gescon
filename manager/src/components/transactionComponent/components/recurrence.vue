<template>
    <checkbox label="Atualização Monetária?" v-model="hasReadjustment"  :disabled="disabled" style="white-space: nowrap; margin-bottom: 24px"/>

    <div class="form_row">
        <wrapper-input label="Começa em:" id="name" :error="errors.start_date">
            <input type="date" class="input input_error" v-model="start_date" :disabled="hasData || disabled">
        </wrapper-input>

        <!-- email -->
        <wrapper-input label="Intervalo de repetição:" :error="errors.frequency">
            <select-frequency class="input_error" v-model="frequency" :disabled="disabled" />
        </wrapper-input>

        <wrapper-input v-if="showDueAndBillingDates" label="Dia da vencimento:" :error="errors.due_date">

            <weekdays v-if="frequencyIsWeekly" :weekday="due_date" @update="due_date = $event" :disabled="disabled" />

            <select v-else class="select input_error" :value="due_date" @input="due_date = $event.target.value" :disabled="disabled">
                <option v-for="(suggestion, i) in suggestions" :key="i" :value="suggestion.day">{{ suggestion.label }}</option>
            </select>
        </wrapper-input>
    </div>
</template>

<script>
import weekdays from "../items/weekdays"
import selectFrequency from "../items/selectFrequency.vue"

import { computed } from "vue"

export default {
    emits: ["event-edit"],
    components: { weekdays, selectFrequency },
    props: {
        trx: Object,
        disabled: Boolean,
        hasData: Boolean,
        errors: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    setup(props, { emit }){
        const start_date = computed({
            get: () => props.trx.start_date,
            set: start_date => emit("event-edit", { ...props.trx, start_date })
        })
        const end_date = computed({
            get: () => props.trx.end_date,
            set: end_date => emit("event-edit", { ...props.trx, end_date })
        })
        const frequency = computed({
            get: () => props.trx.frequency,
            set: frequency => emit("event-edit", { ...props.trx, frequency })
        })
        const due_date = computed({
            get: () => props.trx.due_date,
            set: due_date => emit("event-edit", { ...props.trx, due_date })
        })
        const billing_date = computed({
            get: () => props.trx.billing_date,
            set: billing_date => emit("event-edit", { ...props.trx, billing_date })
        })
        const hasReadjustment = computed({
            get: () => props.trx.hasReadjustment,
            set: hasReadjustment => emit("event-edit", { ...props.trx, hasReadjustment })
        })
        
        const showDueAndBillingDates = computed(() => props.trx.frequency !== 'daily');
        const frequencyIsWeekly = computed(() => props.trx.frequency === 'weekly')

        const suggestions = []
        for(let i = 1; i <= 31; i++){
            const suggestion = {
                day: i,
                label: i < 31 ? new String(i) : `${ i } - Último dia do mês`
            }
            suggestions.push(suggestion)
        }

        return {
            // computed
            frequencyIsWeekly,
            showDueAndBillingDates,
            // 
            start_date,
            end_date,
            frequency,
            due_date,
            billing_date,
            hasReadjustment,
            suggestions
        }
    }
}
</script>