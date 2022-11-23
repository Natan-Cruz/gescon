<template>
    <div class="header" :style="showInputSearch ? 'flex-direction: row' : 'flex-direction: row-reverse' ">
        <!-- input search -->
        <div class="wrapper-input-seach" v-if="showInputSearch">
            <button class="button-search">
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
            </button>

            <input 
                type="text" 
                class="input-search" 
                placeholder="Pesquisar" 
                ref="input"
                :value="search" 
                @keyup="handleKeyUp"/>

            <button class="button-close-input-search" @click="closeInputSearch" v-show="search">
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
            </button>
        </div>

         <div style="display: flex">

            <popup-options v-if="showPrintOutButton"  class="popup-options" v-slot="{ hide }">
                <slot :hide="hide"/>
            </popup-options>

            <div class="wrapper-button-filter" v-if="showButtonFilter">
                <button class="button-filter" @click="$emit('event-toggle-filters')">
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#f70"><g><path d="M0,0h24 M24,24H0" fill="none"/><path d="M7,6h10l-5.01,6.3L7,6z M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6 c0,0,3.72-4.8,5.74-7.39C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z"/><path d="M0,0h24v24H0V0z" fill="none"/></g></svg>
                    <span class="text-medium">Filtros</span>
                </button>
                <button v-if="showButtonClearFilter" class="button-remove" @click="$emit('event-reset-filters')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#f70"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import popupOptions from './popup-options.vue';

import { useStore as useStoreHistory } from "@/store/history"
import { ref } from 'vue';

export default {
    emits: [
        "event-search", 
        "event-reset-filters", 
        "event-print-out", 
        "event-generate-payments",
        "event-toggle-filters"
    ],
    components: { popupOptions },
    props: {
        search: String,
        showButtonClearFilter: Boolean,
        showButtonFilter: Boolean,
        showPrintOutButton: Boolean,
        showInputSearch: Boolean
    },
    setup(_, { emit }){
        const history = useStoreHistory()
        const isShow = ref(false)

        function closeInputSearch(){
            emit("event-search", "")
        }

        let idTimeOut;
        const timeToSearch = 250;

        function handleKeyUp(evt){
            if(evt.keyCode === 27)
                closeInputSearch();
            else{
                // Espera um tempo definido para realizar a busca no servidor
                if (idTimeOut)
                    clearTimeout(idTimeOut)
                
                // Define TimeOut
                idTimeOut = setTimeout(() => {
                    emit("event-search", evt.target.value)
                }, timeToSearch);
            }
        }

        function openModal(){
            history.push({ name: "modal_filter_header ", fn: closeModal })
            isShow.value = true
        }

        function closeModal(){
            history.remove("modal_filter_header")
            isShow.value = false
        }

        return {
            isShow,
            closeInputSearch,
            handleKeyUp,
            openModal,
            closeModal,
        }
    }
}
</script>

<style lang="less" scoped>
	.header{
        height: auto;
        margin-bottom: 16px;

        // box-shadow: 0 0 5px rgba(0, 0, 0, .2);
        // border-radius: 5px;
        // padding: 10px 0;

        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: space-between;

        column-gap: 12px;
	}
  
    .wrapper-input-seach{
        width: 100%;
        max-width: 360px;
        height: 40px;
        position: relative;
        border-radius: 5px;
        overflow: hidden;

        border: solid 1px #d5d5d5;
        align-self: center;
    }

    .button-search{
         // Herda medidas de header-grid
        position: absolute;
        left: 5px;
        top: 7px;
		width: 26px;
		height: 26px;
        border: none;
        background-color: #fff;
        &>svg{
            width: 22px;
            height: 22px;
            fill: rgb(122, 122, 122);
        }
    }

    .input-search{
        width: 100%;
        height: 100%;
        font-size: 1.7em;
        border: none;
        padding-left: 12px;
        padding-right: 40px;
        border-radius: 5px;
        background-color: #fff;

        padding-left: 37px;
        padding-right: 32px;

        outline: none;

        &:focus{
            box-shadow: inset 0 0 2px rgba(0, 0, 0, .2);
        }
    }
    .button-close-input-search{
        // Herda medidas de 'wrapper-input-seach'
        position: absolute;
        right: 5px;
        top: 9px;
		width: 22px;
		height: 22px;
        border: none;
        background-color: #fff;

        transition: 120ms ease-out;
        &>svg{
            width: 22px;
            height: 22px;
            fill: rgb(122, 122, 122);
        }
    }

    .title-modal{
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 16px;
    }
    .wrapper-button-filter{
        height: 38px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        color: #f70;
        background-color: #f9d0ad;
        border-radius: 5px;
        overflow: hidden;

        .button-filter{
            width: 100px;
            height: 100%;
            border: none;
            padding: 0 10px;
            font-weight: bold;

            color: #f70;
            background-color: #f9d0ad;

            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;

            transition: 120ms ease;

            &:active{
                transform: scale(.8);
            }
        }

        .button-remove{
            width: 44px;
            height: 24px;

            border: none;  

            background-color: inherit;
            color: #fff;
            transition: 120ms ease;

            &:active{
                transform: scale(.8);
            }
        }
    }

    .wrapper-buttons{
        display: flex;
        justify-content: right;
        align-items: center;

        margin-top: 24px;

        .button{
            width: 100px;
            height: 40px;
        }
    }
</style>