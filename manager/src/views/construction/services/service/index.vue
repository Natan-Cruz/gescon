<template>
<div style="background-color: #fff">
    <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchService" />

    <template v-if="state.data.id">
        <header-component 
            :name="state.data.name" 
            :path_name="state.data.path_name" 
            :detail_mode="detailMode"
            @event-back="toBack" 
            @event-refresh="fetchService"
            @event-more-detail="handleMoreOption" 
            @event-close="handleClose">
        </header-component>

        <div class="content-scroll">
            <div class="content-body">
                <router-view v-slot="{ Component }">
                    <transition name="scale">
                        <component 
                            :is="Component" 
                            :data="state.data"
                            :path_name="state.path_name"
                            @event-back="handleClose"
                            @event-refresh="fetchService" 
                            @select-item="selectItem" >

                            <!-- error msg -->
                            <div class="container-error" style="margin-top: 12px" v-show="state.form_error">
                                <div class="msg">{{ handleErrorAxios(state.form_error) }}</div>
                            </div>
                        </component>
                    </transition>
                </router-view>
            </div>
        </div>
    </template> 
</div>
</template>

<script>
import headerComponent from "./header.vue"

import { computed } from 'vue';
import { useRoute, useRouter } from "vue-router"
import { useStore } from "./store.js"
import { handleErrorAxios } from "@/Utils/index.js"

export default {
    components: { headerComponent },
    setup(){
        const storeService = useStore();
        
        const $route = useRoute();
        const $router = useRouter();
        const detailMode = computed(() => {
            const [lastPath] = $route.path.split("/").splice(6,1)
            return lastPath === "details" || lastPath === "check-item" || lastPath === "production-rate"
        })

        fetchService()
        function fetchService(){
            storeService.$reset();
            storeService.fetchService($route.params.id)
        }
    
        function toBack(){
            const { previous } = $route.query
            if(previous)
                $router.replace(previous)
            else
                $router.replace({ name: "constuction/services/services" })
        }

        function handleMoreOption(){
            $router.push({ name: "constuction/service/details", query: { path: storeService.data.path }})
        }

        function handleClose(){
            $router.replace({ name: "constuction/service/items", query: $route.query, params: $route.params })
        }

        function selectItem(check_item_id){
            $router.push({ name: "constuction/service/check_item", params: { check_item_id }, query: { cancel: false }})
        }
    
        return {
            state: storeService,
            detailMode,
            // methods
            fetchService,
            toBack,
            handleMoreOption,
            handleClose,
            selectItem,
            handleErrorAxios
        }
    }
}
</script>

<style lang="less" scoped>
    .content-scroll{
        width: 100%;
        height: calc(100vh - 50px);
        overflow: hidden auto;
    }

    :deep(.sub-title){
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 20px;
        margin-top: 36px;
    }


    .content-body{
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
        position: relative;
    }

    :deep(.wrapper-buttons){
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 16px;

        .button{
            width: auto;
            height: 42px;
            padding: 0 20px;
            &:last-child{
                margin-left: 24px;
            }
        }
    }

    .scale-enter-from{
        opacity: 0;
        transition: all 500ms;
        transform: scale(0.9);
    }
    .scale-enter-to{
        transition: all 500ms;
        opacity: 1;
        transform: scale(1);
    }

    .scale-leave-from{
        transition: all 500ms ease;
        opacity: 1;
        transform: scale(1);
        position: absolute;

        // necessario para preencher e nao diminuir itens
        // 40 pixels se refere a soma dos dois "padding"
        width: calc(100% - 40px);
    }
    .scale-leave-to{
        transition: all 500ms ease;
        opacity: 0;
        transform: scale(0.9);
        position: absolute;

        // necessario para preencher e nao diminuir itens
        // 40 pixels se refere a soma dos dois "padding"
        width: calc(100% - 40px);
    }
   
</style>