<template>
    <div class="content-nav-bar" >
        <div class="content-links" ref="ctn_links">
            <router-link to="/main/constructions/active" class="items item-nav-bar" :class="{ 'selected': isActive('active') }">
                <span>Ativas</span>
            </router-link>
            <router-link to="/main/constructions/archived" class="items item-nav-bar"  :class="{ 'selected': isActive('archived') }" >
                <span>Arquivadas</span>
            </router-link>
        </div>
        <div class="details" ref="details"></div>
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
        const details = ref(null)

        function isActive(path){
            const pathname = $route.path;
            if(pathname.indexOf(path) > 0)
                return true;
            else
                return false
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
                                details.value.style.marginLeft = (offsetLeft - 10) + "px";
                                details.value.style.width = (clientWidth + 20) + "px";
                            })
                        }
                    })
            }, 200);
        }

        watch($route, () => translateBar())
        onMounted(() => translateBar())

        return {
            ctn_links,
            details,
            isActive,
            translateBar
        }
    }
}
</script>

<style lang="less" scoped>
    .content-nav-bar{
        width: 100%;
        height: 100%;
        background-color: #f1f1f1;
        position: relative;
        border-bottom: 1px solid rgba(0,0,0,.12);

        padding-bottom: 10px;
    }

    .content-links{
        width: 100%;
        height: auto;
        display: grid;
        grid-template-columns: repeat(2, min-content);
        grid-template-rows: 100%;
        column-gap: 10px;
        overflow: hidden auto;
        position: relative;
        
        &::-webkit-scrollbar {
           display: none;
        }   
    }
    .item-nav-bar{
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
    .selected{
        color: #FF7900;
        font-weight: bold;
    }

    .details{
        height: 2px;
        background-color: #f70;

        transition: margin-left 240ms, width 240ms;
        position: absolute;
        bottom: 0;
    }
</style>