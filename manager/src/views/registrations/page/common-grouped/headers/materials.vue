<template>
    <wrapper-input label="Fornecedor:" class="form_spacing_bottom">
        <input-suggest-list
            url="/registrations/service-provider"
            :options="{ key: 'id', displayName: 'name'}"
            placeholder="Selecione um fornecedor" :value="filters.provider_id" @input="handleInput('provider_id', $event)"/>
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