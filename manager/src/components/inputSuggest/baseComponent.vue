<template>
    <div class="input-suggest" @keydown="handleKeyDown" ref="input_suggest" :id="id">
        <!-- Fake input -->
        <div>
            <div class="fake-input input_error" tabindex="0" :class="{ 'disabled': disabled }" @click="handleClickInFakeInput">
                <span v-if="state.isLoading && state.fistIsLoading" class="placeholder">Carregando dados...</span>

                <template v-else-if="label">
                    <div class="text-label">
                        <span>{{ label }}</span>
                    </div>

                    <span v-show="!disabled" class="btn-remove-last-paths" title="Remover ultimo caminho">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.258" height="14.258" viewBox="0 0 14.258 14.258">
                            <path id="Icon_material-close" data-name="Icon material-close" d="M21.758,8.936,20.322,7.5l-5.693,5.693L8.936,7.5,7.5,8.936l5.693,5.693L7.5,20.322l1.436,1.436,5.693-5.693,5.693,5.693,1.436-1.436-5.693-5.693Z" transform="translate(-7.5 -7.5)"/>
                        </svg>
                    </span>
                </template>

                <span v-else class="placeholder text_error">{{ placeholder }}</span>
            </div>
        </div>

        <transition name="fade">
            <div class="container-popup" v-show="state.isShow">

                <div class="background" @click="handleClose"></div>

                <div class="content-popup" ref="content_suggest">
                    <div v-if="state.error" class="error-component">
                        <p class="text-medium">Ops, ocorreu um erro!</p>
                        <button class="button button-primary text-medium" @click="fetch">Recarregar!</button>
                    </div>

                    <template v-else>

                        <div class="wrapper-input">
                            <div class="ctn">
                                <button class="back-navigation" @click="handleClose">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000">
                                    <path d="M0 0h24v24H0V0z" fill="none"/>
                                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>                            
                                </button>

                                <input type="text" class="input" ref="input" :value="state.search" @keyup="handleKeyUp" placeholder="Pesquise aqui..."> 
                            </div>
                        </div>
                        <div class="content">
                            <ul v-if="state.isLoading">
                                <li v-for="n in 6" :key="n" class="skeleton-text" style="height: 20px; display:block; margin-bottom: 4px" :style="{ width: getRandomWidth() }"></li>
                            </ul>

                            <template v-if="!state.isLoading && !state.error">
                                <slot name="content" 
                                    :items="items" 
                                    :selectedIndex="state.selectedIndex"
                                    :search="state.search" />
                            </template>

                            <span class="without-item" v-if="!items.length && !(state.isLoading || state.error)">Nenhum item</span>
                        </div>
                    </template>
                </div>
            </div>
        </transition>


        <div class="error-component" v-show="!state.isShow && state.error">
            <p class="text-medium">Ops, ocorreu um erro!</p>
            <button class="button button-primary text-medium" @click="fetch">Recarregar!</button>
        </div>
    </div>
</template>

<script>
import { nextTick, reactive, ref, computed } from 'vue'
import axios from "@/services/api"
import { useStore as useStoreHistory } from "@/store/history"
import { formatDisplayName } from './utils'

export default {
    name: "input-suggest",
    emits: ["select-item"],
    props:{
        placeholder: String,
        disabled: Boolean,
        url: String,
        options: Object,
        selected: {
            type: [String, Number, Array]
        },
        url_search: Boolean,
        id: String
    },
    setup(props, { emit, expose }){
        const input = ref(null)
        const history = useStoreHistory();
        const input_suggest = ref(null)
        const content_suggest = ref(null)

        const state = reactive({ 
            fistIsLoading: true, 
            isLoading: false, 
            error: "", 
            search: "", 
            selectedIndex: 0, 
            isShow: false, 
            data: []
        })

        const items = computed(() => {
            if(!state.search || props.url_search) return state.data;

            const items = state.data.filter( item => {

                if(typeof displayName === "string")
                    if(item[props.options.displayName].match(new RegExp(state.search, "gi"))) 
                        return item

                if(typeof displayName === "object")
                    if(formatDisplayName(item, props.options.displayName).match(new RegExp(state.search, "gi"))) 
                        return item
            })

            return items 
        })

        const label = computed(() => {
            const { selected, options } = props;

            if(!selected) return "";

            const displayName = options.displayName

            if(typeof selected === "string"){
                const item = state.data.find(itm => itm[options.key] === selected )

                if(typeof displayName === "string")
                    return item ? item[options.displayName] : ""

                if(typeof displayName === "object")
                    return formatDisplayName(item, displayName)
            }
            
            if(typeof selected === "object" && Array.isArray(selected)){
                const items = state.data.filter( itm => {
                    const has = selected.find( sel => sel === itm[options.key]  )
                    if(has) return has
                })
                if(!items || !items.length) return "";

                let itemsLength = items.length
                if(itemsLength === 1){

                    const item = items[0]

                    if(typeof displayName === "string")
                        return item ? item[displayName] : ""

                    if(typeof displayName === "object")
                        return formatDisplayName(item, displayName)
                }else
                    return `${ itemsLength } Selecionados`
            }

            return ""
        })

        function handleOpen(){
            if(props.disabled) return;
            state.isShow = true;
            history.push({ name: "input_suggest", fn: handleClose })
            fetch();
            nextTick(() => {
                input.value.focus()
                calcPositionContent()
            })
        }

        function handleClose(){
            history.remove("input_suggest");
            state.isShow = false;
            state.search = ""
            state.selectedIndex = 0
        }

        function calcPositionContent(){
            const { top, width, left, height: ipt_height } = input_suggest.value.getBoundingClientRect()
            const { height } = content_suggest.value.getBoundingClientRect()

            if(top + height + 50 > window.innerHeight){
                content_suggest.value.style.top = top - height - 4 + "px"
                content_suggest.value.style.left = left + "px"
                content_suggest.value.style.width = width + "px"
            }else{
                content_suggest.value.style.top = top + ipt_height + 4 + "px"
                content_suggest.value.style.left = left + "px"
                content_suggest.value.style.width = width + "px"
            }
        }

        async function fetch(){
            state.isLoading = true;
            state.error = "";
            let url;

            if(props.url_search){
                const splitedUrl = `${ props.url }?search=${ state.search }`.split("?") 
                url = `${ splitedUrl[0] }?${ splitedUrl.splice(1).join("&") }`
            }else{
                url = props.url
            }
            try {
                const { data } = await axios.get(url)
                state.data = data;
            } catch (error) {
                state.error = error;
            } finally {
                state.isLoading = false;
                state.fistIsLoading = false;
                state.isShow && nextTick(() => calcPositionContent())
            }
        }

        function handleKeyDown(evt){
            const keyCode = evt.keyCode;
            if(keyCode === 27) return handleClose();

            // keycode for enter
            if(keyCode === 13){
                if(state.isShow)
                    emit("select-item", state.data[state.selectedIndex]);
                else
                    handleOpen();
                return true;
            } 
          
            if (evt.key === 'ArrowUp' && state.selectedIndex > 0) {
                state.selectedIndex -= 1
                return true
            }

            if (evt.key === 'ArrowDown' && state.selectedIndex < state.data.length) {
                state.selectedIndex += 1 
                return true
            }
        }

        function getRandomWidth(){
            let min = 15, max = 60;
            return Math.floor(Math.random() * (max - min + 1) + min) + "%"
        }

        function handleClickInFakeInput(evt){
            if(evt.target.closest(".btn-remove-last-paths"))
                return emit("clear-selecteds")
            else
                return handleOpen();
        }

        let idTimeOut;
        const timeToSearch = 250;

        function handleKeyUp(evt){
            state.search = evt.target.value;
            state.isShow && nextTick(() => calcPositionContent());

            if(!props.url_search) return;
            // Espera um tempo definido para realizar a busca no servidor
            if (idTimeOut)
                clearTimeout(idTimeOut)
            
            // Define TimeOut
            idTimeOut = setTimeout(fetch, timeToSearch);
        }


        fetch();

        expose({ handleClose })

        return {  
            state,
            items,
            label,
            input,
            // refs
            input_suggest,
            content_suggest,
            // methods
            fetch,
            handleOpen,
            handleClose,
            handleKeyDown,
            handleClickInFakeInput,
            // methods style
            getRandomWidth,
            handleKeyUp
        }
    }
}
</script>

<style lang="less" scoped>
    .fake-input{
        width: 100%;
        min-width: 180px;
        height: 40px;

        &:focus{
            outline: 1px solid #000;
        }

        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 6px;

        border-radius: 3px;
        border: solid 1px rgba(210, 210, 210);

        position: relative;
        
        .text-label {
            max-width: calc(100% - 20px);
            display:table;
            table-layout:fixed; /* added, so that width specifications will be honored */
            width:100%; /* needed so that these tables honor width of parent element */
            span{
                font-size: 1.6em;
                display:table-cell;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .placeholder{
            color: gray;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            pointer-events: none;
            font-size: 1.6em;
        }
    }

    .disabled{
        border-color: #fff;
        border-bottom: 1px solid rgba(165, 165, 165, .5);
        background-color: #fff;
        color: #484848;
    }
</style>

<style lang="less" scoped>
     ::-webkit-scrollbar {
        width: 6px;
        height: 10px;
    }
    ::-webkit-scrollbar-button {
        width: 0px;
        height: 0px;
    }
    ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border: 0px none #ffffff;
        border-radius: 50px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border: 0px none #ffffff;
    }
    ::-webkit-scrollbar-corner {
        background: transparent;
    }
    .fade-enter-from{
        opacity: 0;
    } 
    .fade-enter-to{
        opacity: 1;
        transition: opacity 50ms;
    }
    .fade-leave-from {
        opacity: 1;
    }
    .fade-leave-to {
        opacity: 0;
        transition: opacity 50ms;
    }

</style>

<style lang="less" scoped>
    @color-border: rgba(165, 165, 165, .5);
    .input-suggest{
        outline: none;
    }
    .container-popup{
        position: relative;
        z-index: 1000;
        border-radius: 5px;

        display: flex;
        align-items: center;
        justify-content: center;
    }
    .background{
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(48, 48, 48, 0.384);
        z-index: -1;
    }
    .content-popup{
        width: 100%;
        height: auto;
        position: fixed;

        left: 0;

        padding: 10px;
        background-color: #fff;
        border-radius: 3px;
    }
    .content{
        max-height: calc(40vh - 60px);
        overflow: hidden auto;
    }
    .wrapper-input{
        margin-bottom: 4px;
    }

    .back-navigation{
        display: none;
    }
    .ctn{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
  
    .error-component{
        margin-top: 2px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .button{
            width: 100px;
            height: 30px;
            background-color: rgb(255, 66, 66);
        }
    }

    @media screen and (max-width: 500px) {
        @width-back-button-navigation: 46px; 
        .background{
            display: none;
        }
        .content-popup{
            height: 100vh;

            width: 100% !important;
            top: 0 !important;
            left: 0 !important;
            position: fixed;
            padding: 10px;
        }
        .content{
            max-height: 100%;
        }
        .content-popup{
            width: 100%;
            height: 100%;
            max-height: 100%;
        }
        .input:not(.fake-input){
            width: calc(100% - @width-back-button-navigation);
        }

        .back-navigation{
            width: @width-back-button-navigation;
            height: 100%;
            background-color: #fff;
            margin-right: 6px;
            border: none;

            display: block;
            transition: 120ms ;
            &:active{
                transform: scale(.8)
            }
        }
    }
</style>