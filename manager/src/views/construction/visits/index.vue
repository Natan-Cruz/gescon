<template>
    <div class="sub-content">
        <loading-or-error 
            :isLoading="state.isLoading" 
            :error="state.error" 
            @event-retry="fetchVisits">
        </loading-or-error>

        <ul>    
            <item-visit 
                v-for="visit in state.data" :key="visit.id" 
                :visit="visit" 
                @click="selectItem(visit.id)">
            </item-visit>
        </ul>

        <button-circle @click="selectItem()"/>
    </div>
</template>

<script>
import buttonCircle from "@/components/buttons/buttonCircle.vue"
import itemVisit from "./item-visit.vue"

import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axios from "@/services/api"

export default {
    components: { buttonCircle, itemVisit },
    setup(){
        const $route = useRoute();
        const $router = useRouter();
        const state = reactive({ data: [], isLoading: false, error: "" })

        const { constructionID } = $route.params

        async function fetchVisits(){
            state.isLoading = true;
            state.error = ""
            const url = "/registrations/visits?construction_id=" + constructionID
            try {
                const { data } = await axios.get(url) 
                state.data = data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }
       
        function selectItem(itemId){
            $router.push({ 
                name: 'registrations/form_visit', 
                params: { 
                    id: itemId
                }, 
                query: { 
                    previous: $route.fullPath,
                    construction_id:  constructionID
                }
            })
        }

        fetchVisits()

        return {
            state,
            fetchVisits,
            selectItem
        }
    }
}
</script>

<style lang="less" scoped>
    .sub-content{
        width: 100%;
        height: 100%;

        background-color: #fff;
        position: relative;
        border-radius: 5px;
        padding: 10px;

        overflow: hidden auto;
    }
</style>