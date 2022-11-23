<template>
    <div style="height: 100%">
        <div class="header">
            <div class="content-nav-bar" >
                <div class="content-links" ref="ctn_links">
                    <slot name="topbar" v-bind:isActive="isActive"/>
                </div>
                <div class="details" ref="details"></div>
            </div>
        </div>
        <div class="body">
            <router-view v-slot="{ Component, route }"  >
                <transition :name="transitionName || 'fade'">
                    <component :is="Component" :key="route.path" />
                </transition>
            </router-view>
        </div>
    </div>
   
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from "vue-router"

export default {
    name:"nav-bar",
    setup(){
        const $route = useRoute()
        const ctn_links = ref(null);
        const details = ref(null);
        const index = ref($route.meta.index)
        const transitionName = ref("fade");
        
        function isActive(path){
            const pathname = $route.path;
            return pathname.indexOf(path) > 0;
        }

        function translateBar(){
            setTimeout(() => {
                const ctnLinks = ctn_links.value;
                if(ctnLinks && ctnLinks.children)
                    Array.from(ctnLinks.children).forEach( elem => {
                        if(elem.classList.contains("selected")){
                            const { offsetLeft, clientWidth } = elem.firstElementChild;

                            requestAnimationFrame(() => {
                                ctnLinks.scrollTo(elem.offsetLeft - 30, 0)
                                details.value.style.marginLeft = offsetLeft + "px";
                                details.value.style.width = clientWidth + "px";
                            })
                        }
                    })
            }, 120);
        }

        function defineTransitionName(){
            if(index.value < $route.meta.index){
                transitionName.value = "slide-right" 
            }else{
                transitionName.value = "slide-left" 
            }

            index.value = $route.meta.index
        }

        watch($route, () => {
            translateBar();
            defineTransitionName();
        });

        onMounted(translateBar)

        return {
            ctn_links,
            details,
            isActive,
            translateBar,
            transitionName
        }
    }
}
</script>

<style lang="less" scoped>
    .header, .body{
        width: 100%;
        position: relative;
        overflow: hidden;
        border-radius: 10px;
    }
    .header{
        height: 40px;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #f1f1f1;

    }
    .content-nav-bar{
        width: 100%;
        height: 100%;

        border-radius: 5px;
        box-shadow: 0 0 6px rgba(0, 0, 0, .2);
        position: relative;
        overflow: auto hidden;
    }
    .content-links{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-columns: repeat(3, min-content);
        grid-template-rows: 100%;
        column-gap: 10px;
        overflow-y: auto hidden;
        position: relative;
        
        &::-webkit-scrollbar {
           display: none;
        }   
    }
    :deep(.item-nav-bar){
        align-self: center;
        width: auto;
        font-size: 1.7em;
        color: #000;
        text-decoration: none;
        white-space: nowrap;
        margin: 0 10px;

        span{
            font-size: 1em;
            display: block;
        }
    }
    :deep(.selected){
        color: #FF7900;
        font-weight: bold;
    }
    .details{
        width: 50px;
        height: 2px;
        background-color: #f70;

        transition: margin-left 240ms, width 240ms;
        position: absolute;
        bottom: 15px;
    }

    // BODY
    .body{
        height: calc(100% - 40px);
        overflow: hidden auto ;
    }
    :deep(.content-body){
        width: 100%;
        min-height: 100%;
        height: auto;

        background-color: #fff; 
    }
    :deep(.without-item){
        font-size: 1.8em;
        padding: 16px 0;
        margin: 10px 0;
        color: rgb(78, 78, 78);
        text-align: center;
    }
</style>