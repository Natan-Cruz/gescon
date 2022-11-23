<template>
    <li class="item no_highlights" :class="{ 'bold': isSelected, 'is-selected': arrowsSelect }">
        <input type="checkbox" style="margin-right: 12px; pointer-event-"  :checked="isSelected" @change="$emit('select-item')">

        <p class="label-item" v-html="label" @click="$emit('select-item')"></p>

        <button class="button-component" @click="$emit('edit-item')" v-show="showEditButton">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
            </svg>
        </button>
    </li>   
</template>

<script>
import { computed } from 'vue';

export default {
    emits: ["select-item", "edit-item"],
    props:{
        item: Object,
        isSelected: Boolean,
        arrowsSelect: Boolean,
        text: String,
        query:{
            type: String,
            required: false,
            default: () => ""
        },
        showEditButton: Boolean
    },
    setup(props){
        function putStrong(word, wordSearched) {
            if(!word) return word
            word = word.toLowerCase();
            wordSearched = wordSearched.toLowerCase()
            return word.replace(wordSearched, `<span class="bold" style="font-size:1em">${ wordSearched }</span>`);
        }

        const label = computed(() =>{
            return putStrong(props.text, props.query)
        })

        return {
            label
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;
        position: relative;
        padding: 6px 0;

        display: flex;
        flex-direction: row;
        align-items: center ;
    }
    .is-selected{
        text-decoration: underline;
    }
    .label-item{
        color: #000 !important;
        font-size: 1.7em;
        cursor: pointer;

        &:active {
            background-color: #ccc;
            transform: scale(.95);
        }
    }

    .button-component{
        position: absolute;
        top: 4px;
        right: 0;

        border-radius: 5px;
        background-color: transparent;
        border: none;
        width: 30px;
        height: 30px;
        cursor: pointer;
        &:active {
            background-color: #ccc;
        }
        &:hover{
            background-color: rgb(230, 230, 230);
        }
        svg {
            transition: 100ms;
            pointer-events: none;
            fill: rgb(66, 66, 66);
        }
        &:active svg {
            transform: scale(.7);
        }
    }
    // @media screen and (max-width: 500px) {
        
    // }
</style>