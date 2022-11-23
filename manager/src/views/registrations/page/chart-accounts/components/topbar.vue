<template>
    <div class="container-nav-bar">
        <div class="content-nav-bar" >
            <div class="content-links" ref="ctn_links">
                <router-link to="/main/chart-accounts/revenues" class="items item-nav-bar" :class="{ 'selected': isActive('revenues') }">
                    <span>Receitas</span>
                </router-link>
                <router-link to="/main/chart-accounts/expenses" class="items item-nav-bar"  :class="{ 'selected': isActive('expenses') }" >
                    <span>Despesas</span>
                </router-link>
            </div>
            <div class="details" ref="details"></div>
        </div>

        <!-- search button -->
        <button class="button__main button-search" @click="openInputSearch">
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
        <!-- input search -->
        <div class="wrapper-input-seach" v-if="inputIsOpen">
            <input type="text" class="input-search" @keyup="handleIinputSearch"  ref="input" placeholder="Pesquise aqui">
            <button class="button__main button-close-input-search" @click="closeInputSearch">
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
            </button>
        </div>

    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from "vue-router"
import { useStore as useStoreHistory } from '@/store/history';

export default {
    name:"nav-bar",
    setup(_, { emit }){
        const $route = useRoute()
        const ctn_links = ref(null);
        const details = ref(null);
        const inputIsOpen = ref(false);
        const input = ref(null);
        const history = useStoreHistory()


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

        function openInputSearch(){
            history.push({ name: "input_search_cloud", fn: closeInputSearch })
            inputIsOpen.value = true;
            setTimeout(() => {
                input.value.focus()
            }, 110);
        }

        function closeInputSearch(){
            // ser possuir algum valor no input, 
            // emite a pesquisa vazia para poder resetar o estado
            if(input.value && input.value.value)
                emit('search', "");

            inputIsOpen.value = false;
            history.remove("input_search_cloud")
        }

        let idTimeOut;
        const timeToSearch = 250;
        function handleIinputSearch(evt){
            if(evt.keyCode === 27)
                closeInputSearch();
            else{
                // Espera um tempo definido para realizar a busca no servidor
                if (idTimeOut)
                    clearTimeout(idTimeOut)
                
                // Define TimeOut
                idTimeOut = setTimeout(() => {
                    emit('search', evt.target.value)
                }, timeToSearch);
            }
        }

        return {
            inputIsOpen,
            input,
            ctn_links,
            details,
            // methods
            isActive,
            translateBar,
            openInputSearch,
            closeInputSearch,
            handleIinputSearch
        }
    }
}
</script>

<style lang="less" scoped>
    .container-nav-bar{
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-bottom: 12px;
    }

    .content-nav-bar{
        width: 100%;
        height: 100%;
        background-color: #f1f1f1;
        position: relative;
        padding: 6px 0;
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

    .button__main{
        width: 26px;
        height: 26px;
    }

    .button-search{
        background-color: #f1f1f1;
    }

    .wrapper-input-seach{
        position:absolute;
        width: 100%;
        height: 40px;
    }
    .input-search{
        width: 100%;
        height: 100%;
        font-size: 1.7em;
        border: none;
        padding: 0 20px;
        outline: none;
        border-radius: 5px;
    }
    .button-close-input-search{
        position: absolute;
        right: 5px;
        top: 7px;
        &>svg{
            width: 26px;
            height: 26px;
        }
    }
</style>