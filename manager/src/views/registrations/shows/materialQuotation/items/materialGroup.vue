<template>
    <div class="expandable-content" :class="{ 'is-expanded': isOpen }" >
        <input type="checkbox" :id="uuid" class="input-select" v-model="isOpen">

        <label :for="uuid" class="label-select">
            
            <template v-if="isOpen">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 13v-2h14v2Z"/></svg>
            </template>
            <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"/></svg>
            </template>

            <span class="expandable-content-title">{{ title }}</span>

        </label>
        
        <div class="content-expand">        
            <slot />
        </div>
    </div>
</template>

<script>
import { ref } from "vue"
import { randomID } from "@/Utils/index.js"

export default {
    name:"expandable-content",
    props: {
        title: String
    },
    setup(){
        const isOpen = ref(true)

        return { isOpen, uuid: randomID() }
    }
}
</script>

<style lang="less" scoped>
   .expandable-content{
        transition: 120ms ease-in;
        border-radius: 5px;
        background-color: #fff;
        position: relative;

        margin-bottom: 24px;

        &:last-child{
            margin-bottom: 0;
        }
    }
    
    .label-select {
        @color: rgb(43, 43, 43);
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        background-color: rgb(255, 211, 173);

        padding: 16px 10px;

        transition: 120ms;
        -webkit-tap-highlight-color: transparent;
        user-select: none;

        svg {
            fill: @color;
            margin-right: 6px;
        }

        span{
            font-size: 1.6em;
            color: @color;
            font-weight: bold;
        }
    }
    
    .input-select {
        display: none;
        &:checked + .label-select{
            margin-bottom: 6px;
        }
        &:checked~.content-expand {
            height: auto;
            border: none;
            overflow:initial !important;
            // padding-bottom: 20px;
        }
    }

    .content-expand {
        width: 100%;
        height: 0;
        overflow: hidden;
        position: relative;
    }
</style>