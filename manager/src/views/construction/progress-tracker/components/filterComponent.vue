<template>
    <div>
       <wrapper-input label="Local" class="form_spacing_bottom">
            <input-suggest-tree
                url="/financial/cost-center"
                :options="{ key: 'path', displayName: 'name'}"
                placeholder="Selecione um local" :value="filters.tree_structure_id" @input="handleInput('tree_structure_id', $event)"/>
        </wrapper-input>

        <wrapper-input label="Fornecedor" class="form_spacing_bottom">
            <input-suggest-list
                url="/registrations/service-provider"
                :options="{ key: 'id', displayName: 'name'}"
                placeholder="Selecione um fornecedor" :value="filters.entity_id" @input="handleInput('entity_id', $event)"/>
        </wrapper-input>

        <wrapper-input label="Serviço" class="form_spacing_bottom">
            <input-suggest-list
                url="/services/s-grouped"
                :options="{ key: 'group_id', displayName: 'group_name'}"
                placeholder="Selecione um serviço" :value="filters.service_group_id" @input="handleInput('service_group_id', $event)"/>
        </wrapper-input>

        <wrapper-input :label="`${ betweenDates ? 'Entre datas' : 'Data' }:`" >
            <div v-if="betweenDates" class="form_row" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: 8px">
                <input type="date" class="input" v-model="startDate">
                <input type="date" class="input" v-model="endDate">
            </div>
            <div v-else style="margin-bottom: 8px">
                <input type="date" class="input" v-model="startDate">
            </div>
            <toggle v-model="betweenDates" label="Entre datas?"></toggle>
        </wrapper-input>
    </div>
</template>

<script>
import inputSuggestTree from "@/components/inputSuggest/inputSuggestTree.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import toggle from "@/components/toggle/toggle.vue"
import { ref, watch } from 'vue'

export default {
    components: { inputSuggestTree, inputSuggestList, toggle },
    props: {
        filters: {
            type: Object,
            required: true,
            default: () => ({})
        }
    },
    setup( props, { emit }){
        const betweenDates = ref(false)

        function handleInput(key, value){
            const f = props.filters;
            f[key] = value
            emit('update:filters', f)
        }

        const startDate = ref([])
        const endDate = ref([])

        watch(startDate.value, plannedStart => handleInput("planned_start", plannedStart))
        watch(endDate.value, plannedEnd => handleInput("planned_end", plannedEnd))

        return {
            betweenDates,
            startDate,
            endDate,
            handleInput,
        }
    }
}
</script>