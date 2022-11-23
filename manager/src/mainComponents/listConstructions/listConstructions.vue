<template>
    <div class="container-list-constructions" v-if="hasInConstructionModule">
        <span class="bar bar_is_mobile"></span>

        <div class="display" @click="handleOpen">
            <template v-if="state.isLoading && state.firstLoading">
                <span class="skeleton-text" style="width: 32px; height: 32px; display: block; border-radius: 5px; margin-right: 8px"></span>
                <span class="skeleton-text" style="width: 80px; height: 18px; display: block;"></span>
            </template>
            <template v-else>
                <div class="ctn-image">
                    <img :src="currentConstr.banner_file_url" alt="">
                </div>
                <p class="name">{{ currentConstr.name }}</p>

                <button class="button-arrow" :style="isShow ? 'transform: rotate(180deg)' : 'transform: rotate(0)'">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 15.375 6 9.375 7.4 7.975 12 12.575 16.6 7.975 18 9.375Z"/></svg>
                </button>
            </template>
        </div>

        <div v-if="isShow" class="container-popup">
            <div class="background" @click="handleClose"></div>
            <div class="content-popup">
                <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchConstructions"/>

                <template v-if="!(state.isLoading || state.error)">
                    <ul class="list">
                        <item-constr 
                            v-for="constr in state.data" :key="constr.id" 
                            :construction="constr" 
                            :isSelected="$route.params.constructionID === constr.id"
                            @select-construction="handleSelectConstruction" />
                    </ul>
                </template>
            </div>
        </div>

        <span class="bar"></span>
    </div>
</template>

<script>
import itemConstr from "./itemConstr.vue"

import axios from "@/services/api"
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore as useStoreHistory } from "@/store/history"

export default {
    components: { itemConstr },
    setup(){
        const isShow = ref(false)
        const state = reactive({ data: [], isLoading: true, error: "", firstLoading: true })
        const $router = useRouter();
        const $route = useRoute();
        const history = useStoreHistory()

        const currentConstr = computed(() => {
            if(state.data.length){
                return state.data.find( itm => itm.id === $route.params.constructionID )
            }else{
                return {}
            } 
        })
        const hasInConstructionModule = computed( () => $route.params.constructionID ? true : false )

        function handleOpen(){
            isShow.value = true;
            history.push({ name: "list_construction", fn: handleClose })
            fetchConstructions()
        }

        function handleClose(){
            isShow.value = false;
            history.remove("list_construction")
        }

        async function fetchConstructions(){
            state.isLoading = true;
            state.error = ""

            try {
                const { data } = await axios.get("/constructions")
                state.data = data
            } catch (error) {
                state.error = error                
            } finally {
                state.isLoading = false;
                state.firstLoading = false
            }
        }

        fetchConstructions()

        function handleSelectConstruction(constructionId){
            handleClose()
            $router.push({ 
                name: $route.name,
                params: {
                    constructionID: constructionId
                }
            })
        }

        return {
            isShow,
            state,
            currentConstr,
            hasInConstructionModule,
            // 
            handleOpen,
            handleClose,
            handleSelectConstruction,
            fetchConstructions
        }
    }
}
</script>

<style lang="less" scoped>
    .display{
        display: flex;
        align-items: center;
        flex-direction: row;

        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
    .ctn-image{
        width: 32px;
        height: 32px;

        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        border: solid 1px #dfdfdf;
        background-color: rgb(219, 219, 219);
        img{
            width: 100%;
        }
    }
    .name{
        font-size: 1.6em;
        margin: 0 2px 0 10px;
        font-weight: bold;
        white-space: nowrap;
    }
    .button-arrow{
        width: 24px;
        height: 24px;

        border: none;
        background-color: transparent;
        transition: 180ms ease;
    }
</style>

<style lang="less" scoped>
    .container-list-constructions{
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .container-popup{
        width: 100vw;
        height: 100vh;

        display: flex;
        align-items: center;
        justify-content: center;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;

    }
    .background{
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 1000;
        pointer-events: all;
    }
    .content-popup{
        height: auto;
        max-height: 400px;
        min-height: 130px;

        background-color: #fff;
        border-radius: 5px;
        padding: 10px;
        z-index: 10000;

        // redefinir cor previamente definido em header
        color: #000;
        position: relative;
    }
     .bar{
        width: 2px;
        height: 30px;
        background-color: rgb(184, 184, 184);
        display: block;
        margin: 0 8px;
    }
    .bar_is_mobile{
        display: none;
    }
    @media screen and (min-width: 1001px) {
        .container-list-constructions{
            position: relative;
        }
        .content-popup{
            width: 240px;
            position: absolute;
            top: 40px;
            left: 0;
        }
    }
    @media screen and (max-width: 1000px) {
        .content-popup{
            width: 80%;
            max-width: 360px;
        }  
        .bar{
            background-color: #fff;
        }
        .bar_is_mobile{
            display: block;
        }
    }
</style>