<template>
    <page-with-filters
        :showInputSearch="false"
        :showPrintOutButton="false"
        :showButtonClearFilter="showButtonClearFilter"
        @submit="handleSubmit" 
        @set-filters-by-url-query="handleSetFiltersByUrlQuery"
        @clear-filters="handleResetFilters">

        <template v-slot:content>
            <loading-or-error 
                :isLoading="state.isLoading" 
                :error="state.error" 
                @event-retry="fetch">
            </loading-or-error>
            <wrapper-charts 
                v-if="!state.isLoading && !state.error" 
                :construction_id="$route.params.constructionID" 
                :data="state.data">
            </wrapper-charts>
        </template>
      
        <template v-slot:filters>
            <filters v-model:filters="stateFilters" />
        </template>
    </page-with-filters>
</template>

<script>
import pageWithFilters from "@/components/pageWithFilters/pageWithFilters.vue"
import filters from "./components/filterComponent.vue"
import wrapperCharts from "./wrapperCharts.vue"

import { computed, reactive, watch } from 'vue'
import axios from "@/services/api"
import { useRoute, useRouter } from "vue-router";

export default {
    components: {
        pageWithFilters,
        filters,
        wrapperCharts
    },
    setup(){
        const $router = useRouter();
        const $route = useRoute();

        const initialState = {}
        const stateFilters = reactive({ ...initialState })
        const state = reactive({ isLoading: false, error: "", data: {}, urlQuery: "" })

        watch(stateFilters, () => window.innerWidth > 1300 && handleSubmit())
        const showButtonClearFilter = computed(() => {
            return JSON.stringify(stateFilters) !== JSON.stringify(initialState)
        })

        async function fetch(){
            state.isLoading = true;
            state.error = "";
            const urlQuery = new URLSearchParams(stateFilters).toString(),
                constructionID = $route.params.constructionID;
            const url = `/progress-tracker/?construction_id=${ constructionID }&${ urlQuery }`
            try {
                const { data } = await axios.get(url)
                state.data = data;
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }
      
        function handleSetFiltersByUrlQuery(query){
            if(query){
                Object.entries(query).forEach(([ key, value ]) => {
                    stateFilters[key] = value;
                })
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

        function handleSubmit(){
            $router.replace({ query: stateFilters })
            fetch()
        }

        return {
            state,
            stateFilters,
            showButtonClearFilter,
            // 
            handleSubmit,
            fetch,
            handleSetFiltersByUrlQuery,
            handleResetFilters
        }
    }
}
</script>