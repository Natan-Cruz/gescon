<template>
    <div class="card" :style="state.showMore ? 'max-height: initial' : '180px'">
        <div class="header">
            <div class="title">
                <span :class="{ 'skeleton-text': state.isLoading }">{{ title }}</span>
            </div>

            <button-refresh class="button-refresh" v-if="url" @click="fetch" />
        </div>
        <div class="content">
            <loading-or-error :error="state.error" :position_relative="true" @event-retry="fetch" />
            
            <template v-if="!state.error">
                <slot :data="data" :isLoading="state.isLoading" :isShowingMore="state.showMore" />
            </template>

            <div class="ctn-show-more" v-if="showMore && !state.isLoading && (Array.isArray(state.data) ? state.data.length > 3 : true) && !state.error">
                <button class="button button-tertiary text-medium button-weather" @click="state.showMore = !state.showMore; $emit('refresh-masonry')">Mostrar {{ state.showMore ? "menos" : "mais" }}</button>
            </div>
            <template v-if="!hasData && !state.isLoading && !state.error">
                <p class="without-item">Nenhum item</p>
            </template>
        </div>
    </div>
</template>

<script>
import buttonRefresh from "@/components/buttons/buttonRefresh.vue";

import axios from "@/services/api"
import { computed, onMounted, reactive, watch } from 'vue';

export default {
    emits: ["refresh-masonry"],
    components: { buttonRefresh },
    props: {
        url: String,
        title: String,
        showMore: {
            type: Boolean,
            required: false,
            default: () => true
        }
    },
    setup(props, { emit }){
        const state = reactive({ isLoading: true, error: "", showMore: false, data: undefined })

        async function fetch(){
            if(!props.url) 
                return state.isLoading = false;

            emit("refresh-masonry")

            state.isLoading = true;
            state.error = "";
            state.data = undefined;

            try {
                const { data } = await axios.get(props.url)
                state.data = data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false;
                emit("refresh-masonry")
            }
        }

        const hasData = computed(() => {
            if(!props.url) return true
            
            if(typeof state.data === "object"){
                if(Array.isArray(state.data))
                    return state.data.length
                else
                    return Object.entries(state.data).length
            }
            return false
        })

        const data = computed(() => {
            if(state.showMore)
                return state.data
            
            if(Array.isArray(state.data))
                return state.data.slice(0, 3)
            else
                return state.data
        })

        onMounted(fetch)
        watch(() => props.url, () => { 
            emit("refresh-masonry")
            fetch() 
        })
        
        return {
            state,
            hasData,
            data,
            fetch
        }

    }
}
</script>

<style lang="less" scoped>
    .card{
        box-shadow: 1px 1px 6px rgba(168, 168, 168, 0.3);
        border-radius: 5px;
        background-color: #fff;
        padding: 10px;
        overflow: hidden auto;
        border: solid 1px rgb(212, 212, 212);
    }

    .header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0 10px 0;
        margin-bottom: 5px;
    }

    .title{
        font-size: 1.8em;
        line-height: 1em;

        color: rgb(56, 56, 56);
        font-weight: bold;
        span {
            font-size: 1em;
        }
    }

    .button-refresh{
        width: 26px;
        height: 26px;
    }

    .content{
        .container-msg-error{
            position: relative;
            padding: 14px 0;
        }
        :deep(.text-error){
            margin-bottom: 10px;
        }
        :deep(.button){
            height: 36px
        }
    }

    .without-item{
        padding: 16px 0;
        text-align: center;
    }

    .ctn-show-more{
        height: calc(100% - 41px - 110px);
        margin-top: 15px;
    }
    .button-weather{
        border-top: dashed 1px gray;
        border-radius: 0;
    }
</style>