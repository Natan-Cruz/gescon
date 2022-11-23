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

            <template v-if="!state.isLoading && !state.error">
                <table-component v-if="state.data.length" class="table" :data="state.data" @select-item="handleSelectService"/>
                <p v-else class="without-item">Nenhum item</p>
            </template>

        </template>

        <!-- filters -->
        <template v-slot:filters>
            <filters v-model:filters="stateFilters" />
        </template>

        <!-- button circle -->
        <template v-slot:button-circle>
            <button-circle @click="handleSelectService()"/> 
        </template>

    </page-with-filters>
</template>

<script>
// global components
import pageWithFilters from "@/components/pageWithFilters/pageWithFilters.vue"
import buttonCircle from "@/components/buttons/buttonCircle.vue"

// local components
import tableComponent from "./components/tableComponent.vue"
import filters from "./components/filterComponent.vue"

import { reactive } from 'vue'
import { useRouter, useRoute } from "vue-router";
import axios from "@/services/api"

export default {
    components: {
        pageWithFilters,
        buttonCircle,
        tableComponent,
        filters
    },
    setup(){
        const $router = useRouter();
        const $route = useRoute();
        const state = reactive({ isLoading: false, error: "", data: [] })
        const stateFilters = reactive({})

        async function fetch(){
            state.isLoading = true;
            state.error = "";
            state.data = [];
            const urlQuery = new URLSearchParams(stateFilters).toString();
            try {
                const { data } = await axios.get(`/services/s?${ urlQuery }`)
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
      
        function handleSelectService(service_id){
            $router.push({ 
                name: "registrations/form_service_sheet", 
                params: { 
                    id: service_id 
                }, 
                query: { 
                    previous: $route.fullPath 
                } 
            })
        }

        return {
            state,
            stateFilters,
            // methods
            handleSubmit,
            fetch,
            handleSelectService,
            handleSetFiltersByUrlQuery
        }
    }
}
</script>