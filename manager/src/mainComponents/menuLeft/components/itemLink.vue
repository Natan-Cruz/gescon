<template>
    <li class="li-page no_highlights" 
        :title="title"
        :class="{ 'selected': isActive, 'is-expanded': isExpanded }" 
        tabindex="1"
        ref="item">

        <div class="row" @click="$emit('c-click', path)" @keypress.enter="$emit('c-click', path)">
            <div class="icon">
                <slot name="img"/>
            </div>
            <p class="link-page">{{ title }}</p>
        </div>

        <slot name="btn" />
    </li>
</template>

<script>
import { computed, inject, onMounted, ref, watch } from "vue"
import { useRoute } from 'vue-router'

export default {
    props: {
        title: String,
        path: String,
        formPage: String,
        indexPath: {
            type: Number,
            required: false,
            default: 0
        }
    },
    setup(props){
        const $route = useRoute();

        const item = ref(null)
        const isActive = computed(() => {
            const routePaths = $route.path.split('/'); 
            const paths = props.path.split('/'); 

            if(props.indexPath){
                const [routePath] = routePaths.slice((routePaths.length - props.indexPath) - 1, (routePaths.length - props.indexPath) - 0)
                const [path] = paths.slice((paths.length - props.indexPath) - 1, (paths.length - props.indexPath) - 0)

                return routePath === path;
            }else{
                return routePaths.pop() === paths.pop();
            }
        })
        watch(() => isActive.value, isActive => {
            if(isActive){
                scrollTo()
            }
        })
        onMounted(() => {
            if(isActive.value){
                scrollTo()
            }
        })

        function scrollTo(){
            setTimeout(() => {
                const { y } = item.value.getBoundingClientRect();
                const groupPages = document.querySelector(".group-pages")
                const { height } =  groupPages.getBoundingClientRect()
                if(y >= height)
                    groupPages.scrollTo({
                        top: y / 2,
                        behavior: "smooth"
                    })
            }, 250);
        }

        const isExpanded = inject("isExpanded")

        return {
            item,
            isActive,
            isExpanded
        }
    }
}
</script>

<style lang="less" scoped>
    .li-page {
        width: 100%;
        height: 44px;

        padding-left: 20px;
        position: relative;
        
        &:active:not(.selected) {
            background: rgba(0,0,0,.08);
            transition: 50ms ease;
        }
        &:hover:not(.selected):not(.button-shortcut) {
            background: #f1f1f1;
        }
    }

    .selected{
        background-color: #e6e6e6;
        p{
            color: #000;
            font-weight: bold;
            color: #f70;
        }
    }

    .row{
        width: calc(100% - 40px);
        height: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .link-page {
        text-decoration: none;
        font-size: 1.5em;
        color: #000;
        margin-left: 20px;
        display: inline-block;
        position: relative;
        display: none;

        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .icon{
        opacity: .85;
        :deep(img){
            width: 24px;
        }
    }

    :deep(.button-shortcut){
        width: 26px;
        height: 26px;
        background-color: #0093b3;
        border: none;
        color: #fff;
        font-size: 2.7em;
        line-height: 1em;
        // display: none;
        visibility: hidden;

        position: absolute;
        right: 10px;
        top: 10px;

        cursor: pointer;
        transition: 200ms ease;
        &:active{
            transform: scale(.8);
        }
    }
    @media screen and (max-width:1000px) {
        .link-page { 
            display: block;
        }
        :deep(.button-shortcut){
            // display: block;
            visibility: visible;

        }
    }
    .is-expanded{
        .link-page { 
            display: block;
        }
        :deep(.button-shortcut){
            // display: block;
            visibility: visible;

        }
    }
</style>