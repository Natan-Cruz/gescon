<template>
    <div>
        <header-file-viewer :fileName="state.file.file_name" :fileId="state.file.id" @event-back="handleBack" />

        <div class="body">
            <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchInformationsAboutFile" @event-back="handleBack" />

            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" :file="state.file"/>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script>
import headerFileViewer from "./headerComponent.vue";

import axios from "@/services/api"
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    components: { headerFileViewer },
    setup(){
        const state = reactive({ isLoading: false, error: "", file: {} })
        const $route = useRoute();
        const $router = useRouter()

        async function fetchInformationsAboutFile(){
            state.isLoading = true;
            state.error = "";

            const url = `/files/${ $route.params.id }/informations`
            try {
                const { data } = await axios.get(url)
                state.file = data
            } catch (error) {
                state.error = error      
            }finally{
                state.isLoading = false
            }
        }
        fetchInformationsAboutFile()

        function handleBack(){
            const { previous } = $route.query;
            if(previous)
                $router.replace(previous)
            else if(window.history.state.back)
                $router.forward()
            else
                $router.push("/main/constructions/active")
        }

        return {
            state,
            // methods
            fetchInformationsAboutFile,
            handleBack
        }
    },
}
</script>

<style lang="less" scoped>
    .body{
        width: 100%;
        height: calc(100vh - 48px);
        position: relative;
        padding: 20px;
        overflow: auto;
        background-color: #fff; 
    }
</style>