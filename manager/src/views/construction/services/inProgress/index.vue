<template>
    <div style="width:100%; height: 100%" >
        <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchServices" />

        <template v-if="!state.isLoading && !state.errorMsg">
            <ul v-if="state.data.length" style="padding: 10px; min-height: 100%; background-color: #fff">
                <item-activity v-for="service in state.data" :key="service.id" :activity="service" @add-in-productions="handleAddProductions" @select-service="handleSelectService">
                    <template v-slot:last-productions="{ data }">
                        <item-last-production 
                            v-for="(production, i) in data" :key="i" 
                            :production="production" 
                            :production_unity="service.production_unity"
                            :accumulated_production="service.accumalated_production" >
                        </item-last-production>
                    </template>

                    <template v-slot:form="{ data, handleEdit }">
                        <item-production 
                            v-for="(production, i ) in data" :key="i" 
                            :index="i" 
                            :item="production" 
                            :production_unity="service.production_unity" @set="handleEdit" >
                        </item-production>
                    </template>
                </item-activity>
            </ul>
            <p class="without-item" v-else>Nehnum item</p>
        </template>
    </div>
</template>

<script>
import itemActivity from "./item.vue"
import ItemProduction from './itemProduction.vue';
import itemLastProduction from "./itemLastProduction.vue"

import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from "@/services/api"

export default {
    components: { itemActivity, ItemProduction, itemLastProduction },
    setup(){
        const state = reactive({ isLoading: false, error: "", data: [] })
        const $route = useRoute();
        const $router = useRouter()

        fetchServices()

        async function fetchServices(){
            state.isLoading = true;
            state.error = "";
            try {
                const { data } = await axios.get("/services/in-progress?construction_id=" + $route.params.constructionID)
                state.data = data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        const orderByDate = ( a, b ) => new Date(a.date) < new Date(b.date);
        function handleAddProductions(productions){
            state.data = state.data.map( service => {
                const prodcs = productions.filter( production => production.service_id === service.id)
                service.productions = service.productions.concat(prodcs)
                return service
            }).sort(orderByDate)
        }

        function handleSelectService(service_id){
            $router.push({ 
                name: "constuction/service/items", 
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
            // methods
            fetchServices,
            handleAddProductions,
            handleSelectService
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper-buttons{
        display: flex;
        justify-content: flex-end;
    }
</style>