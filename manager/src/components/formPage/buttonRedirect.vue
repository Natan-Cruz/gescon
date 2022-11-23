<template>
    <div>
        <button class="form-button-redirect" @click="handleRedirect">
            <slot />
        </button>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from './store'
export default {
    props: {
        routeName: String,
        label: String
    },
    setup(props){
        const store = useStore()
        const $route = useRoute()
        const $router = useRouter();

        function handleRedirect(){
            if(!props.routeName) return;
            store.pushState($route.name)
            $router.push({ 
                name: props.routeName, 
                query: { 
                    previous: $route.fullPath, 
                    forceBack: true 
                }
            })
        }

        return {
            handleRedirect
        }
    }
}
</script>

<style lang="less" scoped>
    .form-button-redirect{
        border: none;
        background-color: #fff;
        background-color: transparent;

        color: #f70;
        font-weight: bold;
        font-size: 1.7em;
        width: auto;
        height: auto;
        cursor: pointer;

        margin-top: 6px;

        &:hover{
            text-decoration: underline;
        }
    }
</style>