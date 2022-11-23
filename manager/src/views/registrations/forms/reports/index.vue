<template>
    <form-page-without-script 
        :linkBack="linkBack"
        :isLoading="state.isLoading" 
        :error="state.error"
        @retry-fetch="fetchReport">
        
        <step-form @select-item="handleSelectItem"/>

        <div class="view">
            <router-view v-slot="{ Component, route }"  >
                <transition :name="transitionName || 'fade'">
                    <component :is="Component" :key="route.path" :report="state.data" :wasClosed="wasClosed" :construction_id="construction_id"/>
                </transition>
            </router-view>
        </div>
    </form-page-without-script>
</template>

<script>
/* eslint-disable */
import formPageWithoutScript from "@/components/formPage/formPageWithoutScript.vue"

import stepForm from "./stepForm.vue"
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, computed, reactive } from 'vue'
import axios from "@/services/api"


export default {
    components: { formPageWithoutScript, stepForm },
    setup(){
        const $router = useRouter()
        const $route = useRoute()
        const state = reactive({ data: {}, isLoading: false, error: "" })
        const index = ref($route.meta.index)
        const transitionName = ref("fade");
        const { constructionID, id } = $route.params 

        const linkBack = computed(() => `/constructions/${ constructionID }/workforce`)

        watch($route, route => {
            if(index.value < route.meta.index  )
                transitionName.value = "slide-right" 
            else
                transitionName.value = "slide-left" 

            index.value = route.meta.index
        })
        
        function handleSelectItem(source){
            $router.push({ name: `construction/diary/${ source }`, params: $route.params, query: $route.query })
        }

        async function fetchReport(){
            state.isLoading = true;
            state.error = ""
            const url = `/constructions/${ constructionID }/reports/${ id }`
            try {
                const { data } = await axios.get(url) 
                console.log(data)
                state.data = data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }
        const wasClosed = computed(() => state.data.status === "closed")

        fetchReport()
        return {
            linkBack,
            wasClosed,
            state,
            transitionName,
            construction_id: constructionID, 
            // methods
            handleSelectItem,
            fetchReport
        }
    }
}
</script>

<style lang="less" scoped>
    .view{
        height: calc(100% - 95px);
        padding: 20px 0;
    }
    .wrapper{
        width: 100%;
    }
    :deep(.title_2){
        font-size: 1.8em;
        line-height: 1em;
        font-weight: bold;
        color: rgb(70, 70, 70);
        margin-bottom: 12px;
    }
    :deep(.wrapper-buttons){
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-top: 24px;

        .button{
            width: auto;
            min-width: 120px;
            padding: 0 6px;
            height: 40px;
        }
    }
    :deep(.background-disabled){
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(201, 201, 201, 0.25);
        z-index: 1;
        border-radius: 5px;
    }
</style>