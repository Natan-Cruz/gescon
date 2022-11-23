<template>
    <main>
        <div class="container-form">
            <div style="text-align: center;">
                <h1 class="title">Gescon</h1>
                <h2 class="sub-title">{{ titleView }}</h2>
            </div>

            <router-view v-slot="{ Component, route }" >
                <transition :name="route.meta.transition || 'fade'">
                    <component :is="Component" :key="route.path">
                        <wrapper-errors v-if="errorMsg" :errorMsg="errorMsg"/>
                    </component>
                </transition>
            </router-view>

            <form-loading-or-error :isLoading="isLoading" />
        </div>
    </main>
</template>

<script>
import wrapperErrors from "./components/wrapperErrors.vue"

import { storeToRefs } from 'pinia'
import { useStore } from './store/store'
import { computed } from 'vue'
import { useRoute } from "vue-router"

export default {
    components: {
        wrapperErrors
    },
    setup(){
        const store = useStore();
        store.$reset();
        const $route = useRoute()

        const titleView = computed(() => {
            const { meta } = $route
            return meta.titleView 
        })

        const { isLoading, errorMsg, user } = storeToRefs(store)

        return {
            store,
            titleView,
            isLoading,
            errorMsg,
            user
        }
    }
}
</script>

<style lang="less" scoped>
    // route transactions 
    .slide-right-auth-enter-from{
        opacity: 0;
        transition: opacity 500ms;
    }
    .slide-right-auth-enter-to{
        opacity: 1;
        transition: opacity 500ms;
    }
    .slide-right-auth-leave-from{
        opacity: 1;
        position: absolute;
    }
    .slide-right-auth-leave-to{
        opacity: 0;
        transform: translateX(-200px);
        transition: opacity 300ms, transform 500ms;
        position: absolute;
    }
    // slide-left
    .slide-left-auth-enter-from{
        opacity: 0;
        transition: all 500ms;
        transform: translateX(-100px);
    }
    .slide-left-auth-enter-to{
        opacity: 1;
        transition: all 500ms;
    }

    .slide-left-auth-leave-from{
        opacity: 1;
        position: absolute;
    }
    .slide-left-auth-leave-to{
        opacity: 0;
        transform: translateX(200px);
        transition: opacity 300ms, transform 500ms;
        position: absolute;
    }

    .fade-enter-from{
        opacity: 0;
        transition: all 500ms;
    }
    .fade-enter-to{
        opacity: 1;
        transition: all 500ms;
    }

    .fade-leave-from{
        opacity: 1;
        position: absolute;
    }
    .fade-leave-to{
        opacity: 0;
        transition: all 300ms;
        position: absolute;
    }
</style>
<style lang="less" scoped>
    main{
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        position: relative;
    }
    .container-form {
        width: 100vw;
        max-width: 460px;
        height: auto;
        border-radius: 5px;
        padding: 26px;
        background: #fff;
        position: relative;
        border: 1px solid #dadce0;
        overflow: hidden;
    }

    .title {
        font-size: 3em;
        margin-bottom: 12px;
        color: #f70;
    }
    .sub-title {
        font-size: 2em;
        margin-bottom: 22px;
        color: rgb(102, 102, 102)
    }
    :deep(.text-link){
        color: #f70;
        margin-top: 24px;
        display: inline-block;

        cursor: pointer;
    }

    @media screen and (max-width: 460px) {
        main{
            align-items: start;
        }
        .container-form{
            border: none;
            padding-top: 14px;
        }
        .title {
            margin-bottom: 8px;
            font-size: 2.8em;
        }
        .sub-title {
            margin-bottom: 16px;
            font-size: 1.8em;
        }

        .bottom-content{
            padding: 0 26px;
        }
    }
</style>