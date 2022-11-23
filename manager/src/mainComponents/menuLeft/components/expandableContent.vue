<template>
    <div class="expandable-content" ref="expandable_content" :title="title">
        <input type="checkbox" :id="uuid" class="input-select" v-model="isOpen">

        <label :for="uuid" class="label-select" tabindex="1" @keypress.enter="isOpen = !isOpen">
            <span class="expandable-content-title" :class="{ 'title-is-expanded': isExpanded }">{{ title }}</span>

            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                <path d="M0 0h24v24H0z" fill="none" />
            </svg>
        </label>

        <div class="wrapper-content-expand" ref="wrapper_content_expand">
            <ul class="content-expand" ref="content_expand">   
                <slot />
            </ul>
        </div>
    </div>
</template>

<script>
import { inject, onMounted, ref, watch } from 'vue';

export default {
    name: "expandable-content",
    props: {
        title: {
            type: String,
            required: true
        },
        defaultOpen: {
            type: Boolean,
            required: false,
            default: () => false
        }
    },
    setup(props){
        const isExpanded = inject("isExpanded")
        const uuid = `expandable_content_${ props.title }`
        const isOpen = ref(false)
        const runAnimation = ref(false)
        const wrapper_content_expand = ref(null)
        const expandable_content = ref(null)
        const content_expand = ref(null)

        function getDefaultState(){
            runAnimation.value = false;
            const open = localStorage.getItem(uuid)
            if(open === null){
                isOpen.value = props.defaultOpen;
            }else{
                isOpen.value = !!parseInt(open) 
            }
        }

        onMounted(getDefaultState)

        watch(() => isOpen.value, () => {
            localStorage.setItem(uuid, isOpen.value ? 1 : 0);

            const wrapperContentExpand = wrapper_content_expand.value;
            const expandableContent = expandable_content.value;
            
            if(runAnimation.value)
                expandableContent.style.transition = "260ms ease-out"
            else
                expandableContent.style.transition = "0"
            
            if(isOpen.value)
                wrapperContentExpand.style.height = content_expand.value.clientHeight + "px"
            else
                wrapperContentExpand.style.height = "0px"

            runAnimation.value = true
        })
        
        return {
            isExpanded,
            uuid,
            isOpen,
            runAnimation,
            wrapper_content_expand,
            expandable_content,
            content_expand
        }
    }
}
</script>

<style lang="less" scoped>
    .expandable-content{
        overflow: hidden;
        border-bottom: dashed 1px #bfbfbf;

        &:nth-child(2){
            border-top: dashed 1px #bfbfbf;
        }
    }
   
    .label-select {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
        
        cursor: pointer;
        background: #fff;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        color: #303030;
        padding: 0 20px;
        margin: 10px 0 10px;

        svg {
            transition: inherit;
            transform: rotate(180deg);
            fill: #303030;
            transition: 100ms;
        }

        svg:active{
            transform: scale(.8);
        }

        &:hover > .expandable-content-title{
            text-decoration: underline;
        }
    }

    .expandable-content-title{
        font-size: 1.6em;
        font-weight: bold;
        display: none;
    }
    .title-is-expanded{
        display: block;
    }

    .wrapper-content-expand {
        width: 100%;
        height: 0;
        overflow: hidden;
        position: relative;
        transition: inherit;
    }

    .input-select {
        display: none;
        &:checked+.label-select>svg {
            transform: rotate(0);
        }
        &:checked~.wrapper-content-expand {
            overflow: initial !important;
        }
    }

    @media screen and (max-width:1000px) {
        .expandable-content-title{
            display: block;
        }
    }
</style>