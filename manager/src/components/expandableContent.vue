<template>
    <div class="expandable-content" :class="{ 'is-expanded': isOpen }" >
        <div class="background-disabled" v-show="disabled" ></div>

        <input type="checkbox" :id="uuid" class="input-select" v-model="isOpen">

        <label :for="uuid" class="label-select">
            
            <span class="expandable-content-title" :style="{ fontSize: `${ font }px` }" >{{ title }}</span>

            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                <path d="M0 0h24v24H0z" fill="none" />
            </svg>
        </label>
        
        <div class="content-expand">        
            <slot />
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue"
import { randomID } from "@/Utils/index.js"

export default {
    name:"expandable-content",
    props: {
        title: {
            type: String
        },
        defaultOpen: {
            type: Boolean,
            required: false,
            default: () => false
        },
        disabled: {
            type: Boolean,
            required: false,
            default: () => false
        },
        font: {
            type: Number,
            required: false,
            default: 20
        }
    },
    setup(props){
        const isOpen = ref(false)

        onMounted(() => isOpen.value = props.defaultOpen)

        return { isOpen, uuid: randomID() }
    }
}
</script>

<style lang="less" scoped>
   .expandable-content{
        transition: 120ms ease-in;
        border-radius: 5px;
        padding: 16px;
        background-color: #fff;
        position: relative;
    }

    .background-disabled{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        cursor: pointer;
        background-color: rgba(221, 221, 221, 0.4);
    }
    
    .label-select {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background-color: #fff;

        transition: 120ms;
        -webkit-tap-highlight-color: transparent;
        user-select: none;

        svg {
            transition: 250ms;
            transform: rotate(180deg);
        }
    }

    .expandable-content-title{
        font-weight: bold;
        color: rgb(49, 49, 49);
    }
 

    .input-select {
        display: none;
        &:checked + .label-select{
            margin-bottom: 22px;
        }
        &:checked+.label-select>svg {
            transform: rotate(0);
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