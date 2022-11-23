<template>
    <div class="header">
        <topbar />
    </div>
    <div class="body">
        <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchConstructions"/>

        <router-view v-slot="{ Component, route }">
            <transition :name="transitionName || 'fade'">
                <component :is="Component" :key="route.path" :constructions="state.constructions" @refresh-constructions="fetchConstructions"/>
            </transition>
        </router-view>
    </div>
</template>

<script>

import { reactive, ref, watch } from 'vue';
import axios from '@/services/api';
import Topbar from './components/topbar.vue';
import { useRoute } from 'vue-router';

export default {
    name:"constructions",
    components:{ Topbar },
    setup(){
        const state = reactive({ isLoading: false, error: "", constructions: [] })

        const $route = useRoute();
        const index = ref($route.meta.index)
        const transitionName = ref("fade");

        watch($route, route => {
            if(index.value < route.meta.index){
                transitionName.value = "slide-right" 
            }else{
                transitionName.value = "slide-left" 
            }

            index.value = route.meta.index
        })

        async function fetchConstructions(){
            state.isLoading = true;
            state.error = "";
            try {
                const { data } = await axios("/constructions")
                state.constructions = data
            } catch (error) {
                state.error = error
            }finally{
                state.isLoading = false
            }
        }

        fetchConstructions()

        return {
            state,
            transitionName,
            fetchConstructions
        }
    }
}
</script>

<style lang="less" scoped>
    .sub_content{
        min-height: 100%;
    }
    .body{
        height: calc(100% - 31px);
        overflow: hidden auto;
        padding-top: 10px;
        position: relative;
    }
    :deep(.list-constructions){
        width: 100%;
        height: 100%;
        position: relative;

        display:grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-template-rows: auto;
        gap: 20px;

        overflow-x: hidden;
        overflow-y: auto;

        padding-bottom: 30px;
    }
    :deep(.without-item){
        font-size: 1.8em;
        padding: 16px 0;
        margin: 10px 0;
        color: rgb(78, 78, 78);
        text-align: center;
    }
</style>
