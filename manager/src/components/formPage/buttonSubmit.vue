<template>
    <div class="ctn-button-multiple-choices" >
        <template v-if="isShow">
            <div class="background" @click="close"></div>
            <ul class="multiple-choice-content">
                <li @click="setSelected">Salvar</li>
                <li @click="setSelected">Salvar e continuar</li>
                <li @click="setSelected">Salvar e voltar</li>
                <li @click="setSelected">Editar em todos</li>
            </ul>
        </template>
        <div class="ctn-buttons" :class="{ 'is-open': isShow }">
            <button class="button-main" @click="$emit('submit')" :disabled="disabled" >{{ selected }}</button>
            <button class="button-choices" @click="open" :disabled="disabled" >
                <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#FFFFFF" :style="isShow && 'transform: rotate(180deg)'">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M7 10l5 5 5-5H7z"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore as useStoreHistory } from "@/store/history";

export default {
    emits: [ "submit", "select-function" ],
    props: {
        disabled: Boolean,
        selected: String
    },
    setup(_, { emit }){
        const isShow = ref(false);
        const history = useStoreHistory()

        function open(){
            history.push({ name: "button_submit", fn: close })
            isShow.value = true;
        }

        function close(){
            history.remove("button_submit")
            isShow.value = false
        }

        function setSelected(evt){
            const textContent = evt.target.textContent
            emit("select-function", textContent);
            close()
        }

        return {
            isShow,
            open,
            close,
            setSelected
        }
    }
}
</script>

<style lang="less" scoped>
    .ctn-button-multiple-choices{
        position: relative;
        width: max-content;
        height: 38px;
    }

    .ctn-buttons{
        width: max-content;
        height: 100%;

        display: flex;
        align-items: center;
        border-radius: 5px;
        overflow: hidden;
    }

    .is-open{
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-top: solid 1px #fff;
    }

    .button-main{
        width: auto;
        min-width: 130px;
        height: 100%;
        padding: 0 8px;

        border: none;
        background-color: #f70;
        color: #fff;

        font-size: 1.7em;
        font-weight: bold;

        border-right: solid 1px #fff;

        white-space: nowrap;

        transition: 120ms ease;
        &:active{
            transform: scale(.8);
        }
    }

    .button-choices{
        width: 40px;
        height: 40px;

        border: none;
        background-color: #f70;

        transition: 120ms ease;
        &:active{
            transform: scale(.8);
        }

        & > svg{
            fill: #fff;
            transition: 120ms ease;
        }
    }
    .background{
        width: 100%;
        height: 100%;

        position: fixed;
        top: 0;
        left: 0;

        background-color: rgba(0, 0, 0, .2);

        z-index: 1;
    }

    .multiple-choice-content{
        width: 100%;
        height: auto;

        position: absolute;
        top: -145px;
        left: 0;

        background-color: #f70;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        padding: 0 6px;

        z-index: 2;

        li {
            font-size: 1.7em;
            color: #fff;
            padding: 8px;
            font-weight: bold;
            cursor: pointer;

            border-bottom: dashed 1px #fff;

            &:last-child{
                border-bottom: none;
            }
        }
    }
</style>