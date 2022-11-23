<template>
    <wrapper-input label="Status:" class="form_spacing_bottom">
        <select class="select" :value="filters.status" @change="handleInput('status', $event.target.value)">
            <option value="">Todos</option>
            <option value="bought">Comprados</option>
            <option value="delivered">Entregues</option>
        </select>
    </wrapper-input>

    <wrapper-input label="Obra:" class="form_spacing_bottom">
        <input-suggest-list
            url="/constructions"
            :options="{ key: 'id', displayName: 'name'}"
            placeholder="Selecione uma obra" :value="filters.construction_id" @input="handleInput('construction_id', $event)"/>
    </wrapper-input>

    <wrapper-input label="Fornecedor:" class="form_spacing_bottom">
        <input-suggest-list
            url="/registrations/service-provider"
            :options="{ key: 'id', displayName: 'name'}"
            placeholder="Selecione uma obra" :value="filters.entity_id" @input="handleInput('entity_id', $event)"/>
    </wrapper-input>

    <wrapper-input label="Data:">
        <input type="date" class="input" :value="filters.date" @input="handleInput('date', $event.target.value)">
    </wrapper-input>
</template>

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"

export default {
    components: { inputSuggestList },
    props: {
        filters: {
            type: Object,
            required: true
        }
    },
    setup( props, { emit }){
        function handleInput(key, value){
            const f = props.filters;
            f[key] = value
            emit('update:filters', f)
        }

        handleInput("status", "bought")

        return {
            handleInput
        }
    }
}
</script>