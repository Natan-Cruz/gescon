<template>
    <wrapper-input label="Obra:" class="form_spacing_bottom">
        <input-suggest-list
            url="/constructions"
            :options="{ key: 'id', displayName: 'name'}"
            placeholder="Selecione uma obra" :value="filters.construction_id" @input="handleInput('construction_id', $event)"/>
    </wrapper-input>

    <wrapper-input label="Origem:">
        <select class="select" :value="filters.origin" @change="handleInput('origin', $event.target.value)">
            <option value="">Todos</option>
            <option value="own">Próprio</option>
            <option value="rented">Alugados</option>
        </select>
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

        return {
            handleInput
        }
    }
}
</script>