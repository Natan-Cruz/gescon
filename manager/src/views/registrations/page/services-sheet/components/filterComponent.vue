<template>
    <div>
        <wrapper-input label="Fornecedor" class="form_spacing_bottom">
            <input-suggest-list
                url="/registrations/service-provider"
                :options="{ key: 'id', displayName: 'name'}"
                placeholder="Selecione um fornecedor" :value="filters.entity_id" @input="handleInput('entity_id', $event)"/>
        </wrapper-input>

        <wrapper-input label="Serviços" class="form_spacing_bottom">
            <input-suggest-list
                url="/services/s-grouped"
                :options="{ key: 'group_id', displayName: 'group_name'}"
                placeholder="Selecione um serviço" :value="filters.service_group_id" @input="handleInput('service_group_id', $event)"/>
        </wrapper-input>

        <wrapper-input label="Local" class="form_spacing_bottom">
            <input-suggest-tree
                url="/financial/cost-center"
                :options="{ key: 'path', displayName: 'name'}"
                placeholder="Selecione um local" :value="filters.tree_structure_id" @input="handleInput('tree_structure_id', $event)"/>
        </wrapper-input>

       <wrapper-input label="Status das verificações" class="form_spacing_bottom">
            <checkbox label="Conformes" key_value="conformity" :value="filters.status_check_item" @input="handleInput('status_check_item', $event)" >
                <svg width="26" height="24" xmlns="http://www.w3.org/2000/svg" style="transform: scale(.8)">
                    <g stroke="null">
                        <path fill="#287928" d="m8.283 9.732.308 12.654.618.411 11.316.206 4.064-8.693V9.989l-9.516.154 1.749-7.15-1.39-1.029-1.13.926" opacity="NaN"/>
                        <path fill="#287928" d="M9.466 23.78h10.602a2.34 2.34 0 0 0 2.167-1.438l3.558-8.304c.106-.271.164-.554.164-.86v-2.356a2.363 2.363 0 0 0-2.355-2.356h-7.433l1.119-5.383.035-.377c0-.483-.2-.93-.518-1.249L15.556.221 7.793 7.983a2.341 2.341 0 0 0-.683 1.661v11.78a2.363 2.363 0 0 0 2.356 2.356zm0-14.136 5.112-5.112L13 10.822h10.602v2.356l-3.534 8.246H9.466V9.644zm-9.423 0h4.711V23.78H.043V9.644z"/>
                        <path fill="none" d="M8.679 8.929h.103"/>
                    </g>
                </svg>
            </checkbox>
            <checkbox label="Conformes / Reinspeção" key_value="reinspected" :value="filters.status_check_item" @input="handleInput('status_check_item', $event)" >
                <svg width="26" height="24" xmlns="http://www.w3.org/2000/svg" style="transform: scale(.8)">
                    <g stroke="null">
                        <path fill="#FFA500" d="m8.283 9.732.308 12.654.618.411 11.316.206 4.064-8.693V9.989l-9.516.154 1.749-7.15-1.39-1.029-1.13.926" opacity="NaN"/>
                        <path fill="#FFA500" d="M9.466 23.78h10.602a2.34 2.34 0 0 0 2.167-1.438l3.558-8.304c.106-.271.164-.554.164-.86v-2.356a2.363 2.363 0 0 0-2.355-2.356h-7.433l1.119-5.383.035-.377c0-.483-.2-.93-.518-1.249L15.556.221 7.793 7.983a2.341 2.341 0 0 0-.683 1.661v11.78a2.363 2.363 0 0 0 2.356 2.356zm0-14.136 5.112-5.112L13 10.822h10.602v2.356l-3.534 8.246H9.466V9.644zm-9.423 0h4.711V23.78H.043V9.644z"/>
                        <path fill="none" d="M8.679 8.929h.103"/>
                    </g>
                </svg>
            </checkbox>
            <checkbox label="Não conforme" key_value="unconformities" :value="filters.status_check_item" @input="handleInput('status_check_item', $event)" >
                <svg width="26" height="24" xmlns="http://www.w3.org/2000/svg" style="transform: scale(.8) rotate(180deg);">
                    <g stroke="null">
                        <path fill="#F51720" d="m8.283 9.732.308 12.654.618.411 11.316.206 4.064-8.693V9.989l-9.516.154 1.749-7.15-1.39-1.029-1.13.926" opacity="NaN"/>
                        <path fill="#F51720" d="M9.466 23.78h10.602a2.34 2.34 0 0 0 2.167-1.438l3.558-8.304c.106-.271.164-.554.164-.86v-2.356a2.363 2.363 0 0 0-2.355-2.356h-7.433l1.119-5.383.035-.377c0-.483-.2-.93-.518-1.249L15.556.221 7.793 7.983a2.341 2.341 0 0 0-.683 1.661v11.78a2.363 2.363 0 0 0 2.356 2.356zm0-14.136 5.112-5.112L13 10.822h10.602v2.356l-3.534 8.246H9.466V9.644zm-9.423 0h4.711V23.78H.043V9.644z"/>
                        <path fill="none" d="M8.679 8.929h.103"/>
                    </g>
                </svg>
            </checkbox>
            <checkbox label="Com foto" key_value="has_attachments" :value="filters.status_check_item" @input="handleInput('status_check_item', $event)" >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="gray"><path d="M6 17H18L14.25 12L11.25 16L9 13ZM5 21Q4.175 21 3.587 20.413Q3 19.825 3 19V5Q3 4.175 3.587 3.587Q4.175 3 5 3H19Q19.825 3 20.413 3.587Q21 4.175 21 5V19Q21 19.825 20.413 20.413Q19.825 21 19 21ZM5 19H19Q19 19 19 19Q19 19 19 19V5Q19 5 19 5Q19 5 19 5H5Q5 5 5 5Q5 5 5 5V19Q5 19 5 19Q5 19 5 19ZM5 5Q5 5 5 5Q5 5 5 5V19Q5 19 5 19Q5 19 5 19Q5 19 5 19Q5 19 5 19V5Q5 5 5 5Q5 5 5 5Z"/></svg>
            </checkbox>
            <checkbox label="Reinspeção vencidas" key_value="overdue_reinspection" :value="filters.status_check_item" @input="handleInput('status_check_item', $event)" >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#F51720"><path d="M15.3 16.7 16.7 15.3 13 11.6V7H11V12.4ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>
            </checkbox>
        </wrapper-input>

        <wrapper-input :label="`Data planejada que começa ${ betweenDatesPlannedStart ? 'entre' : 'em' }:`" >
            <div v-if="betweenDatesPlannedStart" class="form_row" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: 8px">
                <input type="date" class="input" v-model="plannedStart[0]">
                <input type="date" class="input" v-model="plannedStart[1]">
            </div>
            <div v-else style="margin-bottom: 8px">
                <input type="date" class="input" v-model="plannedStart[0]">
            </div>
            <toggle v-model="betweenDatesPlannedStart" label="Entre datas?"></toggle>
        </wrapper-input>
        <hr>
        <wrapper-input :label="`Data planejada que termina ${ betweenDatesPlannedEnd ? 'entre' : 'em' }:`" >
            <div v-if="betweenDatesPlannedEnd" class="form_row" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: 8px">
                <input type="date" class="input" v-model="plannedEnd[0]">
                <input type="date" class="input" v-model="plannedEnd[1]">
            </div>
            <div v-else style="margin-bottom: 8px">
                <input type="date" class="input" v-model="plannedEnd[0]">
            </div>
            <toggle v-model="betweenDatesPlannedEnd" label="Entre datas?"></toggle>
        </wrapper-input>
        <hr>
        <wrapper-input :label="`Data realizada que começa ${ betweenDatesRealStart ? 'entre' : 'em' }:`" >
            <div v-if="betweenDatesRealStart" class="form_row"  style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: 8px">
                <input type="date" class="input" v-model="realStart[0]">
                <input type="date" class="input" v-model="realStart[1]">
            </div>
            <div v-else style="margin-bottom: 8px">
                <input type="date" class="input" v-model="realStart[0]">
            </div>
            <toggle v-model="betweenDatesRealStart" label="Entre datas?"></toggle>
        </wrapper-input>
        <hr>
        <wrapper-input :label="`Data realizada que termina ${ betweenDatesRealEnd ? 'entre' : 'em' }:`" >
            <div v-if="betweenDatesRealEnd" class="form_row" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: 8px">
                <input type="date" class="input" v-model="realEnd[0]">
                <input type="date" class="input" v-model="realEnd[1]">
            </div>
            <div v-else style="margin-bottom: 8px">
                <input type="date" class="input" v-model="realEnd[0]">
            </div>
            <toggle v-model="betweenDatesRealEnd" label="Entre datas?"></toggle>
        </wrapper-input>
    </div>
</template>

<script>
import inputSuggestTree from "@/components/inputSuggest/inputSuggestTree.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import toggle from "@/components/toggle/toggle.vue"
import checkbox from "./checkbox.vue"
import { ref, watch } from 'vue'

export default {
    components: { inputSuggestTree, inputSuggestList, toggle, checkbox },
    props: {
        filters: {
            type: Object,
            required: true
        }
    },
    setup( props, { emit }){
        const betweenDatesPlannedStart = ref(false);
        const betweenDatesPlannedEnd = ref(false);
        const betweenDatesRealStart = ref(false);
        const betweenDatesRealEnd = ref(false);

        function handleInput(key, value){
            const f = props.filters;
            f[key] = value
            emit('update:filters', f)
        }

        const plannedStart = ref([])
        const plannedEnd = ref([])
        const realStart = ref([])
        const realEnd = ref([])

        watch(plannedStart.value, plannedStart => handleInput("planned_start", plannedStart))
        watch(plannedEnd.value, plannedEnd => handleInput("planned_end", plannedEnd))
        watch(realStart.value, realStart => handleInput("real_start", realStart))
        watch(realEnd.value, realEnd => handleInput("planned_end", realEnd))

        return {
            handleInput,
            // 
            plannedStart,
            plannedEnd,
            realStart,
            realEnd,
            // 
            betweenDatesPlannedStart,
            betweenDatesPlannedEnd,
            betweenDatesRealStart,
            betweenDatesRealEnd,
        }
    }
}
</script>

<style lang="less" scoped>
    hr{
        border: none;
        border-bottom: dashed 1px gray;
        margin: 12px 0;
    }
</style>