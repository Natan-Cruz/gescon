<template>
    <header>
        <div class="flex">
            <menu-hamburger class="menu-hamburger" @event-open-menu="openMenuLeft" />
            <list-constructions />
            <h1>{{ title }}</h1>
        </div>
		<global-uploader />
    </header>
</template>

<script>
import menuHamburger from "../menuLeft/menuHamburger.vue"
import GlobalUploader from "../GlobalUploader/index.vue"
import listConstructions from "../listConstructions/listConstructions.vue"

import { useStore } from "@/store/menuLeft"
import { useStore as useStoreHistory } from "@/store/history"

export default {
    name: "custom-header",
    components:{
        menuHamburger,
        GlobalUploader,
        listConstructions
    },
    props: {
        title: String
    },
    setup(){
        const store = useStore()
        const history = useStoreHistory()
        
        function openMenuLeft(){
            history.push({ name: "menu_left", fn: store.close })
            store.open();
        }
        
        return {
            openMenuLeft
        }
    }
}
</script>

<style lang="less" scoped>
    // Header não é exibido na versão de desktop
    header{
        // display: none
        width: 100%;
        height: 100%;
        position: relative;
        display:flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
        color: #000;
        border-bottom: solid 1px rgb(212, 212, 212);
    }

    .flex{
        width: calc(100% - 50px);
        display: flex;
        align-items: center;
    }

    .menu-hamburger{
        display: none;
    }

    h1{
        width: calc(100% - 48px);
        font-size: 2em;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: inherit;
    }

   

    @media screen and (max-width: 1000px){
        header{
            width: 100%;
            padding: 0 10px;
            background-color: #fff;
            box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2);
            border: none;
            color: #000;
            fill: #000;
        }

        .menu-hamburger{
            visibility: visible;
            display: block;
        }
    }
</style>
