<template>
    <div>

        <div class="form_row" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: 8px">
            <wrapper-input label="Início:">
                <input type="date" class="input" ref="input_start_date" :value="filters.start_date" @blur="handleChangeStartDate">
            </wrapper-input>
            <wrapper-input v-show="!sigleDate" label="Fim:">
                <input type="date" class="input" ref="input_end_date" :value="filters.end_date" @blur="handleChangeEndDate">
            </wrapper-input>
        </div>

        <div class="diplay_flex form_spacing_bottom">
            <checkbox label="Mesma data?"  v-model="sigleDate" :scale="15" :font="15"/>
            <button class="button button-tertiary text-medium" @click="handleSetDates({ start: '', end_date: '' })">Limpar datas</button>
        </div>

        
        <wrapper-input label="Usuário">
            <input-suggest-list
                url="/users/admin"
                :options="{ key: 'id', displayName: [ '? ? - ?', 'first_name', 'last_name', 'title' ]}"
                :url_search="false"
                placeholder="Selecione o usuário" :value="filters.user" @input="handleInput('user', $event)" />
        </wrapper-input>
    </div>
</template>

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"

import { onMounted, ref, watch } from 'vue'

export default {
    components: { inputSuggestList },
    props: {
        filters: {
            type: Object,
            required: true,
            default: () => ({})
        },
    },
    setup( props, { emit }){
        const sigleDate = ref(true);
        const input_start_date = ref(null)
        const input_end_date = ref(null)
        
        onMounted(fnWachDates)
        watch([ () => props.filters.start_date, () => props.filters.end_date ], fnWachDates)

        function fnWachDates(){
            const { start_date, end_date } = props.filters;
            sigleDate.value = start_date === end_date
        }

        function handleInput(key, value){
            const f = props.filters;
            f[key] = value
            emit('update:filters', f)
        }

        function handleSetDates({ start, end }){
            const f = props.filters;
            f["start_date"] = start
            f["end_date"] = end
            emit('update:filters', f)
        }

        
        function handleChangeStartDate(evt){
            const date = evt.target.value;

            if(sigleDate.value){
                return handleSetDates({ start: date, end: date })
            }

            if(input_end_date.value.value)
                return handleSetDates({ start: date, end: input_end_date.value.value })
        }

        function handleChangeEndDate(evt){
            const date = evt.target.value;

            return handleSetDates({ start: input_start_date.value.value, end: date })
        }

        return {
            // refs
            sigleDate,
            input_start_date,
            input_end_date,
            // methods
            handleInput,
            handleSetDates,
            handleChangeStartDate,
            handleChangeEndDate
        }
    }
}
</script>

<style scoped>
    .diplay_flex{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
    }
    .button{
        height: auto;
    }
</style>
