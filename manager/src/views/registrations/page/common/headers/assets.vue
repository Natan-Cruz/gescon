<template>

    <wrapper-input label="Tipo:" class="form_spacing_bottom">
        <select class="select" :value="filters.type" @change="handleInput('type', $event.target.value)">
            <option value="">Todos</option>
            <option value="sale">Venda</option>
            <option value="rent">Aluguel</option>
        </select>
    </wrapper-input>

    <wrapper-input label="Status:" class="form_spacing_bottom">
        <select class="select" :value="filters.status" @change="handleInput('status', $event.target.value)">
            <option value="">Todos</option>
            <option value="available">Disponíveis</option>
            <option value="unavailable">Indisponíveis</option>
        </select>
    </wrapper-input>

    <wrapper-input label="Empreendimento:" class="form_spacing_bottom">
        <input-suggest-list
            url="/registrations/assets-projects"
            :options="{ key: 'id', displayName: 'name' }"
            placeholder="Selecione um empreendimento"
            :value="filters.project_id" @update:modelValue="handleInput('project_id', $event)"/>
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