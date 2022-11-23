<template>
    <div class="wrapper-input-seach" v-if="inputIsOpen">

        <input type="text" class="input-search" :placeholder="palceholder" :value="search" @keyup="handleIinputSearch"  ref="input">

        <button class="button__main button-close-input-search" @click="hide">
            <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
        </button>


        <div class="filter">
            <button @click="handleDirectoryMode" class="btn-mode-directory">{{ labelMode }}</button>

            <checkbox label="Pastas" key_value="folders" v-model="query_filter" />
            <checkbox label="Arquivos" key_value="files" v-model="query_filter" />
            <checkbox label="PDFs" key_value="pdf" v-model="query_filter" />
            <checkbox label="Fotos e imagens" key_value="images" v-model="query_filter" />
            <checkbox label="Videos" key_value="videos" v-model="query_filter" />
            <checkbox label="Audios" key_value="audios" v-model="query_filter" />
            <checkbox label="Hoje" key_value="today" v-model="query_filter" />
            <checkbox label="Ontem" key_value="yesterday" v-model="query_filter" />
            <checkbox label="Último sete dias" key_value="last_7_days" v-model="query_filter" />
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import checkbox from "../../components/checkbox.vue"

import { ref, computed, nextTick, onMounted } from 'vue';
import { useStore as useStoreHistory } from '@/store/history';

export default {
    components: { checkbox },
    emits: ["update:query"],
    props: {
        path_tree: Array,
        path_name: Array,
        is_loading: Boolean,
        filter: String,
        search: String,
        mode: String,
    },
    setup(props, { emit, expose }){
        const input = ref(null)
        const inputIsOpen = ref(false);

        onMounted(() => {
            if(props.search || (props.mode && props.mode !== "all") || props.filter) show();
        })
        const history = useStoreHistory();

        // [MODEL VALUES]
        const query_filter = computed({
            get: () => props.filter,
            set: filter => emit("update:filter", filter )
        })

        const query_mode = computed({
            get: () => props.mode,
            set: mode => emit("update:mode", mode )
        })

        // 
        const palceholder = computed(() => {
            if(props.is_loading) 
                return "Carregando..."

            const folderName = props.path_name.slice(props.path_name.length - 1, props.path_name.length - 0).join()

            const mode = props.mode

            if(!folderName || folderName === "root" || mode === "all")
                return "Pesquisar em tudo"

            if( mode === "in_directory"){
                return `Pesquisar na "${ folderName }"`
            }
            if( mode === "starts_in_directory"){
                return `Pesquisar a partir desta "${ folderName }"`
            } 
            return ""
        })

        function show(){
            // history.push({ name: "input_search_cloud", fn: hide })
            inputIsOpen.value = true;
            document.querySelector(".body").style.paddingTop = 60 + "px"
            nextTick(() => input.value.focus());
        }

        function hide(){
            inputIsOpen.value = false;
            // history.remove("input_search_cloud")
            document.querySelector(".body").style.paddingTop = 0
            emit("update:search", "")
            emit("update:mode", "all")
            emit("update:filter", "")
            emit('event-refresh')
        }


        const labelMode = computed(() => {
            switch(props.mode){
                case "all": return "Pesquisar em tudo";
                case "in_directory": return "Pesquisar na pasta";
                case "starts_in_directory": return "Pesquisar a partir desta pasta";
            }
        })

        function handleDirectoryMode(){
            switch(props.mode){
                case "all": query_mode.value = "in_directory"; break
                case "in_directory": query_mode.value = "starts_in_directory"; break
                case "starts_in_directory": query_mode.value = "all";break
            }
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
                    emit("update:search", evt.target.value)
                }, timeToSearch);
            }
        }

        expose({ show })

        return {
            input,
            inputIsOpen,
            // computed
            labelMode,
            palceholder,
            // methods
            show,
            hide,
            handleDirectoryMode,
            handleIinputSearch,
            // modelValue
            query_filter,
            query_mode
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper-input-seach{
        position:absolute;
        width: 100%;
        height: 100%;
    }
    .input-search{
        width: 100%;
        height: 100%;
        font-size: 1.8em;
        border: none;
        padding: 0 20px;
        outline: none;
    }
    .button-close-input-search{
        position: absolute;
        right: 5px;
        top: 5px;
        &>svg{
            width: 26px;
            height: 26px;
        }
    }

    .filter{
        width: 100%;
        height: auto;

        background-color: #fff;
        position: absolute;
        left: 0;
        top: 60px;
        z-index: 10;

        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 12px;

        padding: 10px 20px 8px 10px;
        border-bottom: solid 1px rgb(180, 180, 180);
        box-shadow: 0 2px 6px rgba(168, 168, 168, 0.6);

        overflow: auto hidden;
    }

    .btn-mode-directory{
        width: max-content;
        height: auto;

        position: relative;
        cursor: pointer;

        padding: 4px 8px;

        border: solid 1px gray;
        font-size: 1.6em;
        white-space: nowrap;

        background-color: rgba(211, 98, 0, 0.75);
        border-color: #f70;
        color: #fff9f4;
        font-weight: bold;
    }
</style>