<template>
    <select id="frequency" class="select" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" :disabled="disabled">
        <option value="daily">Diário</option>
        <option value="weekly">Semanal</option>
        <option value="monthly">Mensal</option>
        <option value="every_two_months">Bimestral</option>
        <option value="every_three_months">Trimestral</option>
        <option value="every_four_months">Quadrimestral</option>
        <option value="every_six_months">Semestral</option>
        <option value="yearly">Anual</option>
    </select>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: false,
            default: () => false
        }
    }
}
</script>