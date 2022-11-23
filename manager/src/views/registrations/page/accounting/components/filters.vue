<template>
    <div>

        <div class="form_row" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: 8px">
            <wrapper-input label="Início:">
                <input type="date" class="input" ref="input_start_date" :value="filters.start_date" @input="handleStartDate($event.target.value)">
            </wrapper-input>
            <wrapper-input v-show="!sigleDate" label="Fim:">
                <input type="date" class="input" ref="input_end_date" :value="filters.end_date" @input="handleInput('end_date', $event.target.value)">
            </wrapper-input>
        </div>

        <div class="diplay_flex form_spacing_bottom">
            <checkbox label="Mesma data?" :value="sigleDate" @input="handleSingleDate($event.target.checked)" :scale="15" :font="15"/>
            <button class="button button-tertiary text-medium" @click="clearDates">Limpar datas</button>
        </div>

        <checkbox v-if="label" class="form_spacing_bottom" :label="label" :value="filters.defaulters" @update:modelValue="handleDefaulters" />

        <wrapper-input :label="chartAccount.label" class="form_spacing_bottom" id="chart-account">
            <input-suggest-list
                :url="chartAccount.url" id="chart-account"
                :options="{ key: 'id', displayName: 'long_description'}"
                placeholder="Selecione um plano de conta"
                :value="filters.chart_account" @update:modelValue="handleInput('chart_account', $event)"/>
        </wrapper-input>

         <wrapper-input label="Centro de custos:" class="form_spacing_bottom">
            <input-suggest-tree
                url="/financial/cost-center" placeholder="Selecione um centro de custo"
                :options="{ key: 'path', displayName: 'name' }"
                :value="filters.cost_center_path" @update:modelValue="handleInput('cost_center_path', $event)"/>

            <ul v-show="filters.cost_center_path" class="cost-center-options" @click="handleSelectOpts">
                <li data-value="below" :class="{ 'selected': costCenterOptsSelect('below') }">Ascendentes</li>
                <li data-value="egual" :class="{ 'selected': costCenterOptsSelect('egual') }">Igual</li>
                <li data-value="above" :class="{ 'selected': costCenterOptsSelect('above') }">Descendentes</li>
            </ul>
        </wrapper-input>

        <wrapper-input label="Ativo (apts, salas, etc):" class="form_spacing_bottom" id="asset">
            <input-suggest-list
                url="/registrations/assets?minimal=true" id="asset" placeholder="Selecione um ativo"
                :options="{ key: 'cost_center_id', displayName: 'name' }"
                :value="filters.cost_center_id" @update:modelValue="handleInput('cost_center_id', $event)"/>
        </wrapper-input>

        <wrapper-input label="Cliente ou fornecedor:" class="form_spacing_bottom" id="entity">
            <input-suggest-list
                url="/registrations/all?minimal=true" id="entity" placeholder="Selecione um fornecedor ou cliente"
                :options="{ key: 'id', displayName: 'name' }"
                :value="filters.entity" @update:modelValue="handleInput('entity', $event)"/>
        </wrapper-input>
    </div>
</template>

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import inputSuggestTree from "@/components/inputSuggest/inputSuggestTree.vue"
import { computed, onMounted, ref } from 'vue'

export default {
    components: { inputSuggestList, inputSuggestTree },
    props: {
        filters: {
            type: Object,
            required: true,
            default: () => ({})
        },
        account_type: String
    },
    setup( props, { emit }){
        const sigleDate = ref(true);

        const label = computed(() => {
            let lb;
            switch(props.account_type){
                case "bills_to_pay": lb = "Vencidas"; break;
                case "bills_to_receive": lb = "Inadimplentes"; break
            }
            return lb
        });
        
        const chartAccount = computed(() => {
            let label, url;
            switch(props.account_type){
                case "bills_to_pay": 
                case "paid_bills":
                    label = "Despesa:"; url = "/financial/chart-accounts?type=expense"; break
                case "bills_to_receive":
                case "accounts_received": 
                    label = "Receita:"; url = "/financial/chart-accounts?type=revenues"; break
            }
            return { label, url }
        })

        const mFilters = computed({
            get: () => props.filters,
            set: property => { 
                const f = props.filters;
                Object.entries(property).forEach(([ key, value ]) => {
                    f[key] = value
                })
                emit('update:filters', f)
            }
        })

        onMounted(() => {
            const { start_date, end_date } = props.filters;
            sigleDate.value = start_date === end_date
        })


        function handleStartDate(start_date){
            if(sigleDate.value)
                mFilters.value = { start_date: start_date, end_date: start_date }
            else
                mFilters.value = { start_date: start_date }

        }

        function handleInput(key, value){
            const obj = {}
            obj[key] = value
            mFilters.value = obj
        }

        function handleSingleDate(checked){
            if(checked){
                mFilters.value = { end_date: props.filters.start_date }
            }

            sigleDate.value = checked;
        }

        function clearDates(){
            mFilters.value = { start_date: "", end_date: "" }
        }


        function handleDefaulters(param){
            mFilters.value = { start_date: "", end_date: "", defaulters: param }
        }


        function handleSelectOpts(evt){
            const value = evt.target.dataset.value
            let opts = mFilters.value.cost_center_opts ? mFilters.value.cost_center_opts.split(";") : ["0","1","0"]
            switch(value){
                case "below":
                    opts[0] = opts[0] === "1" ? 0 : 1;
                    opts[2] = 0
                    break;
                case "egual":
                    opts[1] = opts[1] === "1" ? 0 : 1;
                    break;
                case "above":
                    opts[0] = 0
                    opts[2] = opts[2] === "1" ? 0 : 1;
                    break;
            }
            mFilters.value = { cost_center_opts: opts.join(";") }
        }

        function costCenterOptsSelect(value){
            let opts = mFilters.value.cost_center_opts ? mFilters.value.cost_center_opts.split(";") : ["0","1","0"]
            switch(value){
                case "below": return opts[0] === "1"
                case "egual": return opts[1] === "1"
                case "above": return opts[2] === "1"
            }
        }
        
        return {
            //labels
            label,
            chartAccount,
            // refs
            sigleDate,
            // methods
            handleInput,
            handleDefaulters,
            handleSingleDate,
            clearDates,
            handleStartDate,
            // cost center opts
            handleSelectOpts,
            costCenterOptsSelect
        }
    }
}
</script>

<style lang="less" scoped>
    .diplay_flex{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
    }
    .button{
        height: auto;
    }
    .cost-center-options{
        display: flex;
        margin-top: 4px;
        li{
            font-size: 1.5em;
            border-radius: 5px;
            border: solid 1px #f70;
            color: #000;
            padding: 2px 6px;
            cursor: pointer;

            margin-right: 12px;
        }

        .selected{
            background-color: #f70;
        }
    }
</style>