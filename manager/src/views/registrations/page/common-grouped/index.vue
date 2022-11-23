<template>
    <page-with-filters 
        :showPrintOutButton="false"
        :showButtonFilter="filterComponentName ? true : false"
        :showButtonClearFilter="showButtonClearFilter"
        contentStyle="background-color: #fff;box-shadow: 0 0 5px rgba(0, 0, 0, .2);"
        @submit="handleSubmit" 
        @search="stateFilters.search = $event; handleSubmit()"
        @set-filters-by-url-query="handleSetFiltersByUrlQuery"
        @clear-filters="handleResetFilters">
        <!-- content -->
        <template v-slot:content>
            <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetch" />
            <template v-if="!state.isLoading && !state.error">
                <table-component
                    :cols="cols" 
                    :cells="cells"
                    :sortPreferences="sortPreferences"
                    :rows="stateRows" 
                    @event-select-item="pushRouter(props.showName || props.formName, $event)"
                    @event-sort-column="handleSortColumn">
                </table-component>
            </template>
        </template>


        <!-- filters -->
        <template v-slot:filters>
            <filters-component v-model:filters="stateFilters" />
        </template>

        <!-- button circle -->
        <template v-slot:button-circle>
            <button-circle v-show="formName" @click="pushRouter(props.formName)"/> 
        </template>

    </page-with-filters>
</template>

<script setup>
// global components
import pageWithFilters from "@/components/pageWithFilters/pageWithFilters.vue"

// local components
import tableComponent from "./table";
import buttonCircle from "@/components/buttons/buttonCircle.vue";

import { defineAsyncComponent, reactive, defineProps, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from "@/services/api";
import { dynamicSort, groupBy } from "./utils.js"

const props = defineProps({
    url: {
        type: String,
        required: true
    },
    defaultUrlQuery: {
        type: Object,
        required: false,
        default: () => ({})
    },
    cols: {
        type: Array,
        required: true
    },
    cells: {
        type: Array,
        required: true
    },
    formName: {
        type: String,
        required: true
    },
    showName: {
        type: String,
        required: false
    },
    routeQuery: {
        type: Object,
        required: false
    },
    filterComponentName: String
})
const filtersComponent = computed(() => props.filterComponentName && defineAsyncComponent(() => import(`./headers/${ props.filterComponentName }.vue`)))

const $route = useRoute()
const $router = useRouter()

const initialState = {}
const stateFilters = reactive({ ...initialState })
const state = reactive({ isLoading: false, error: "", data: [] })
const sortPreferences = reactive({ columnName: "", sortOrder: 0 })
const showButtonClearFilter = computed(() => JSON.stringify(stateFilters) !== JSON.stringify(initialState))

watch(() => $route.name, () => setTimeout(fetch, 120))

function handleSetFiltersByUrlQuery(query){
    if(query){
        Object.entries(query).forEach(([ key, value ]) => {
            stateFilters[key] = value;
        })
    }
}

function loadSortPreferences(){
    const sort = localStorage.getItem($route.name + '-sort-table')
    if(sort){
        const { columnName, sortOrder } = JSON.parse(sort)
        sortPreferences.columnName = columnName;
        sortPreferences.sortOrder = sortOrder
    }
}

function handleResetFilters(){
    Object.entries(stateFilters).forEach(([key]) => {
        if(initialState[key])
            stateFilters[key] = initialState[key]
        else
            delete stateFilters[key]
    })
    handleSubmit()
}

function handleSubmit(firstLoading){
    if(firstLoading && props.defaultUrlQuery)
        Object.entries(props.defaultUrlQuery).forEach(([ key, value ]) => stateFilters[key] = value);
        
    $router.replace({ query: stateFilters })
    fetch()
    loadSortPreferences()
}

async function fetch(){
    const urlQuery = new URLSearchParams(stateFilters).toString();
    const splitedUrl = `${ props.url }?${ urlQuery }`.split("?") 
    const url = `${ splitedUrl[0] }?${ splitedUrl.splice(1).join("&") }`

    state.isLoading = true;
    state.error = ""
    state.data = [];
    try {
        const { data } = await axios.get(url);
        if(!data || !Array.isArray(data)) 
            throw new Error("Ocorreu algum problema");
        state.data = data
    } catch (error) {
        state.error = error;
    } finally {
        state.isLoading = false
    }
}

function pushRouter(routeName, id){
    if(!routeName) return;
    
    $router.push({ 
        name: routeName, 
        params: { id }, 
        query: { previous: $route.path, ...props.routeQuery }
    })
}

function handleSortColumn(columnName){
    if(!sortPreferences.columnName && !sortPreferences.sortOrder){

        sortPreferences.columnName = columnName
        sortPreferences.sortOrder = 1
    }
    else
    if(sortPreferences.columnName === columnName) {
        if(sortPreferences.sortOrder === 1)
            sortPreferences.sortOrder = -1
        else
        if(sortPreferences.sortOrder === -1)
            sortPreferences.sortOrder = 0
        else
        if(sortPreferences.sortOrder === 0)
            sortPreferences.sortOrder = 1
    }
    else {
        sortPreferences.columnName = columnName
        sortPreferences.sortOrder = 1
    }

    localStorage.setItem($route.name + '-sort-table', JSON.stringify(sortPreferences))
}

const stateRows = computed(() => {
    let sortedData;
    if(sortPreferences.columnName){
        sortedData = state.data.slice().sort(dynamicSort(sortPreferences.columnName, sortPreferences.sortOrder))
    }
    return groupBy(sortedData || state.data, props.cells, { key: "group_id", title: { key: "group_id", str: "Cotações agrupadas     #" } } )
})
</script>