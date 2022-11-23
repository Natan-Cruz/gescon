<template>
    <wrapper-input label="Intevalo" class="form_spacing_bottom">
        <ul class="list-filter-by-date">
            <li v-for="l of state.list" :key="l.key" @click="handleInput('typeIntervalDates', l.key)" :class="{ 'selected': filters.typeIntervalDates === l.key }">{{ l.value }}</li>
        </ul>
    </wrapper-input>

    <wrapper-input label="Intervalo de datas" class="form_spacing_bottom">
        <date-range :start_date="filters.start_date" :end_date="filters.end_date" @event-set="handleSetDates"/>
    </wrapper-input>

    <wrapper-input label="Tipo:" class="form_spacing_bottom">
        <select class="select" :value="filters.type" @change="handleInput('type', $event.target.value)">
            <option value="" default>Todos os lancamentos</option>
            <option value="inflow">Créditos</option>
            <option value="outflow">Débitos</option>
        </select>
    </wrapper-input>

    <wrapper-input label="Estado:" class="form_spacing_bottom">
        <select class="select" :value="filters.payment_state" @change="handleInput('payment_state', $event.target.value)">
            <option value="" default>Todas as situações</option>
            <option value="1">Realizado</option>
            <option value="0">Previsto</option>
        </select>
    </wrapper-input>

    <!-- <wrapper-input label="Centro de custos:" class="form_spacing_bottom">
        <input-suggest-tree
            url="/financial/cost-center"
            :options="{ key: 'id', displayName: 'name'}"
            placeholder="Selecione um centro de custo"
            :value="filters.cost_center" @input="handleInput('cost_center', $event)"/>
    </wrapper-input>

    <wrapper-input label="Plano de contas:">
        <input-suggest-list
            url="/financial/chart-accounts"
            :options="{ key: 'id', displayName: 'long_description'}"
            placeholder="Selecione um plano de conta"
            :value="filters.chart_account" @input="handleInput('chart_account', $event)"/>
    </wrapper-input> -->
</template>

<script>
import dateRange from "@/components/dateRange.vue"
import { reactive, onMounted } from 'vue'
import dayjs from "dayjs"

export default {
    name: "top-bar",
    components: { dateRange },
    props: { filters: Object },
    setup(props, { emit }){
        const state = reactive({
            list: [
                { key: "daily", value: "Diario"},
                { key: "weekly", value: "Semanal"},
                { key: "monthly", value: "Mensal"}
            ],
            current: { key: "monthly", value: "Mensal" },
        })

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
        onMounted(() => {
            handleSetDates({
                start: dayjs().startOf("month").format("YYYY-MM-DD"),
                end: dayjs().endOf("month").format("YYYY-MM-DD")
            })
        })
        return {
            state,
            // computed
            handleInput,
            handleSetDates
        }
    },
    
   
}
</script>

<style lang="less" scoped>
    .list-filter-by-date{
        height: 40px;
        display: flex;
        align-items: center;
        border: solid 1px #EBECED;
        padding: 0 10px;

        li {
            font-size: 1.7em;
            margin-right: 16px;
            cursor: pointer;
            color: #ff9232;

            &:hover{
                text-decoration: underline;
            }

            &:last-child{
                margin-right: 0;
            }
        }
    }
    .selected{
        font-weight: bold;
        text-decoration: underline;
    }

    .input-date{
        font-size: 1em;
    }


    // button
    .btn-go-search{
        width: 80px;
        height: 32px;
    }

    .select{
        min-width: 100%;
        flex-grow: 1;
        height: 40px;
        font-size: 1.7em;
        border: solid 1px gray;
        border-radius: 5px;
        padding: 4px 12px;
        background-color: #fff;
        option{
            font-size: 1em;
        }

        &:first-child{
            margin-right: 12px;
        }
    }

    @media screen and (max-width:525px){
        .top-bar{
            flex-direction: column;
        }
    }
</style>
