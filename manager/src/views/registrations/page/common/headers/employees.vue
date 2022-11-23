<template>
    <wrapper-input label="Tipo:" class="form_spacing_bottom">
        <select class="select" :value="filters.type" @change="handleInput('type', $event.target.value)">
            <option value="">Todos</option>
            <option value="construction_company">Construtora</option>
            <option value="outsourced_company">Terceirizados</option>
        </select>
    </wrapper-input>

    <checkbox label="Deletados?" :value="filters.deleted" @update:modelValue="handleInput('deleted', $event)" />
</template>

<script>
export default {
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