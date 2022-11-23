<template>
    <div class="content-body" style="padding: 20px">

        <loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" @event-retry="fetchUnconformitites"></loading-or-error>
        
        <template v-if="!state.isLoading && !state.errorMsg">
            <ul v-if="state.data.length">
                <item-service v-for="service in state.data" :key="service.id" :item="service" @select-service="handleSelectService" >
                    <item-check-item v-for="item in service.check_items" :key="item.id" :item="item" @select-check-item="handleSelectCheckItem" @remove-check-item="handleRemoveCheckItem"/>
                </item-service>
            </ul>
            <p class="without-item" v-else>Nenhuma inconformidade</p>
        </template>
    </div>
</template>

<script>
import itemService from "./itemService.vue";
import itemCheckItem from "./itemCheckItem.vue";

import { reactive } from 'vue';
import axios from "@/services/api"
import { useRoute, useRouter } from 'vue-router';

export default {
    components: { itemService, itemCheckItem },
    setup(){
        const $route = useRoute()
        const $router = useRouter()
        const state = reactive({ data: [], isLoading: false, errorMsg: "" })

        fetchUnconformitites()

        async function fetchUnconformitites(){
            state.errorMsg = "";
            state.isLoading = true;

            const url = `/services/check-items?type=unconfomitites&construction_id=${ $route.params.constructionID }`
            try {
                const { data } = await axios.get(url)
                state.data = data;
            } catch (error) {
                state.errorMsg = error
            } finally {
                state.isLoading = false
            }
        }

    
        function handleSelectService(service_id){
            $router.push({
                name: 'constuction/service/items', 
                params: { 
                    id: service_id 
                }, 
                query: { 
                    previous: $route.fullPath 
                }
            })
        }

        function handleSelectCheckItem({ service_id, check_item_id }){
            $router.push({
                name: "constuction/service/check_item",
                params: {
                    id: service_id,
                    check_item_id :check_item_id
                },
                query: {
                    previous: $route.fullPath
                }
            })
        }

        function handleRemoveCheckItem(check_item_id){
            state.data = state.data.filter( service => {
                const index = service.check_items.findIndex( item => item.id === check_item_id)
                if(index > -1)
                    service.check_items.splice(index, 1)

                if(service.check_items.length > 0)
                    return service
            })
        }


        return {
            state,
            // methods //
            fetchUnconformitites,
            // select items
            handleSelectService,
            handleSelectCheckItem,
            // remove items
            handleRemoveCheckItem
        }
    }
}
</script>