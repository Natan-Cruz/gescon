<template>
    <div class="no_highlights" style="position: relative">
        <label class="btn-more-options" @click.stop="show">
            <span>Opções</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="5.609" height="23" viewBox="0 0 5.609 23">
                <g id="Icon_feather-more-vertical" data-name="Icon feather-more-vertical" transform="translate(-15 -4.5)">
                    <path id="Caminho_1" data-name="Caminho 1" d="M19.109,18a1.412,1.412,0,0,1-1.3,1.5A1.412,1.412,0,0,1,16.5,18a1.412,1.412,0,0,1,1.3-1.5A1.412,1.412,0,0,1,19.109,18Z" transform="translate(0 -2)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                    <path id="Caminho_2" data-name="Caminho 2" d="M19.109,7.5A1.412,1.412,0,0,1,17.8,9a1.412,1.412,0,0,1-1.3-1.5A1.412,1.412,0,0,1,17.8,6,1.412,1.412,0,0,1,19.109,7.5Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                    <path id="Caminho_3" data-name="Caminho 3" d="M19.109,28.5A1.412,1.412,0,0,1,17.8,30a1.515,1.515,0,0,1,0-3A1.412,1.412,0,0,1,19.109,28.5Z" transform="translate(0 -4)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                </g>
            </svg>
        </label>
        <transition name="card-attachment-options">
            <div class="container-more-option" v-if="visible">
                <div class="background" @click="hide"></div>
                <div class="card">
                    <slot :hide="hide" ></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { ref } from "vue"
import { useStore as useStoreHistory } from "@/store/history"

export default {
    setup(){
        const visible = ref(false);
        const history = useStoreHistory()

        function show(){
            history.push({ name: "popup", fn: hide })
            visible.value = true;
        }
        function hide(){
            history.remove("popup")
            visible.value = false;
        }

        return {
            visible,
            show,
            hide
        }
    }
}
</script>

<style lang="less" scoped>
    .btn-more-options{
        width: auto;
        height: 100%;
        cursor: pointer;
        padding: 5px;
        transition: 120ms;
        margin-right: 10px;

        display: flex;
        justify-content: right;
        align-items: center;

        border: solid 1px gray;
        border-radius: 5px;

        span{
            font-size: 1.5em;
            margin-left: 4px;
        }
        &:active{
            transform: scale(.8)
        }
        &:hover{
            background-color: #e6e6e6;

        }
        svg{
            width: 20px;
            height: 20px;
            stroke: #000;
            pointer-events: none;
        }
    }


    @media screen and (max-width: 500px){
        .btn-more-options span{
            display: none;
        }
    }

    .background{
        width: 100%;
        height: 100%;

        position: fixed;
        top: 0;
        left: 0;

        background-color: rgba(0,0,0,.2)
    }
   
    .container-more-option{
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2000;
    }

    .card-attachment-options-enter,
    .card-attachment-options-leave-to {
        opacity: 0;
    }

    .card-attachment-options-enter-active,
    .card-attachment-options-leave-active {
        transition: opacity 200ms;
    }
    .card{
        width: auto;
        height: auto;
        box-shadow: 1px 1px 21px 8px rgba(115, 115, 115, .4);
        border-radius: 5px;
        padding: 0 0;
        background-color: #fff;
        z-index: 2000;
        position: absolute;
        top: 18px;
        right: 20px;
        overflow: hidden;
        :deep(a), 
        :deep(p){
            cursor: pointer;
            color: #444444;
            display: block;
            white-space: nowrap;
        }
        :deep(.p_title){
            font-size: 1.7em;
            font-weight: bold;
            background-color: #959595;
            color: #fff;
            padding: 6px 10px;
        }

        :deep(.p_item){
            font-size: 1.6em;
            padding: 10px;
        }
    }
    :deep(.hr-card){
        width:100%;
        border: 1px dashed gray;
    }
    .container-loading{
        width: 60px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>