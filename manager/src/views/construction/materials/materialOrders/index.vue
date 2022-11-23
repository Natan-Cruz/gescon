<template>
    <div class="content-body">
        <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetch"></loading-or-error>

        <template v-if="!state.isLoading && !state.error">
            <div class="padding">
                <ul class="list" v-if="state.data.length">    
                    <item v-for="( item, i ) in state.data" :key="i" :item="item" @click="selectItem(item.id)"/>
                </ul>
                <p v-else class="without-item">Nenhum item</p>
            </div>
        </template>
        <button-circle @click="$router.push({ name: 'registrations/purchased_materials_form', query: { previous: $route.fullPath }})"/>
    </div>
</template>

<script>
import item from "./item.vue"
import buttonCircle from "@/components/buttons/buttonCircle.vue"

import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axios from "@/services/api"

export default {
    components: { item, buttonCircle },
    setup(_, { emit }){
        emit("show-top-bar", true)

        const $route = useRoute();
        const $router = useRouter();
        const state = reactive({ data: [], isLoading: false, error: "" })

        async function fetch(){
            state.isLoading = true;
            state.error = ""

            const url = `/materials/material-orders?construction_id=${ $route.params.constructionID }&status=bought`
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
                name: 'construction/receive_material_order', 
                params: { 
                    id: itemId
                }, 
                query:{ 
                    previous: $route.fullPath 
                }
            })
        }

        fetch()

        return {
            state,
            fetch,
            selectItem
        }
    }
}
</script>

<style lang="less" scoped>
    .list{
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-template-rows: auto;
        row-gap: 12px;
        column-gap: 12px;
    }

    .padding{
        padding: 20px;
    }

    @media screen and (max-width: 500px) {
        .padding{
            padding: 10px;
        }
    }
</style>