<template>
    <page-with-filters
        :showPrintOutButton="false"
        contentStyle="background-color: #fff;box-shadow: 0 0 5px rgba(0, 0, 0, .2);"
        @submit="handleSubmit" 
        @search="stateFilters.search = $event; handleSubmit()"
        @set-filters-by-url-query="handleSetFiltersByUrlQuery">
        <!-- content -->
        
        <template v-slot:content>
            <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetch" />

            <!-- <template v-if="!state.isLoading && !state.error">
                <table-component v-if="state.data.length" class="table" :data="state.data" @select-item="handleSelectService"/>
                <p v-else class="without-item">Nenhum item</p>
            </template> -->

        </template>

        <!-- filters -->
        <template v-slot:filters>
            <filters v-model:filters="stateFilters" />
        </template>

    </page-with-filters>
</template>

<script>
// global components
import pageWithFilters from "@/components/pageWithFilters/pageWithFilters.vue"

// local components
import filters from "./components/filtersComponent.vue"

import { reactive, watch } from 'vue'
import { useRouter } from "vue-router";
import axios from "@/services/api"

export default {
    components: {
        pageWithFilters,
        filters
    },
    setup(){
        const $router = useRouter();
        // const $route = useRoute();
        const state = reactive({ isLoading: false, error: "", data: [] })
        const stateFilters = reactive({})

        watch(stateFilters, () => window.innerWidth > 1300 && handleSubmit())

        async function fetch(){
            state.isLoading = true;
            state.error = "";
            state.data = [];
            const urlQuery = new URLSearchParams(stateFilters).toString();
            try {
                const { data } = await axios.get(`/payments/logs?${ urlQuery }`)
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
   
        function handleSubmit(){
            $router.replace({ query: stateFilters })
            fetch()
        }
      
        return {
            state,
            stateFilters,
            // methods
            handleSubmit,
            fetch,
            handleSetFiltersByUrlQuery
        }
    }
}
</script>