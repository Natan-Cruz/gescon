<template>
    <td class="expandable-content" :class="{ 'is-expanded': isOpen }" >
        <input type="checkbox" :id="uuid" class="input-select input-select-row" v-model="isOpen" @change="handleChange">

        <label :for="uuid" class="label-select">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                <path d="M0 0h24v24H0z" fill="none" />
            </svg>
            <span class="expandable-content-title">{{ title }}</span>
        </label>
        
        <div class="content-expand">        
          <slot />
        </div>
    </td>
</template>

<script>
import { ref } from 'vue';
import { randomID } from '../../../Utils';

export default {
    props: {
        title: String
    },
    setup(){
        const uuid = randomID();
        const isOpen = ref(false)

       function handleChange(evt){
           const checked = evt.target.checked
            if(checked)
                document.querySelectorAll(".input-select-row").forEach( node => {
                    if(node.id !== uuid)
                        node.checked = false
                })
        }

        return {
            uuid,
            isOpen,
            handleChange
        }
    }
}
</script>

<style lang="less" scoped>
    @border-color: rgb(194, 194, 194);
    @background-color: rgba(160, 160, 160, .4) ;

   .expandable-content{
        width: 100%;
        transition: 120ms ease-in;
        border-radius: 5px;
        // overflow: hidden;
    }
    
    .label-select {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        background-color: #fff;

        transition: 120ms;
        -webkit-tap-highlight-color: transparent;
        user-select: none;

        padding: 24px;

        svg {
            transition: 250ms;
            transform: rotate(-180deg);
        }
    }

    .expandable-content-title{
        font-size: 1.7em;
        font-weight: bold;
        color: rgb(65, 65, 65);
        margin-left: 12px;
    }
 

    .input-select {
        display: none;
        &:checked + .label-select{
            border-bottom: dashed 1px gray;
            background-color: @background-color;
        }
        &:checked+.label-select>svg {
            transform: rotate(0);
        }
        &:checked~.content-expand {
            height: auto;
            border: none;
            overflow:initial !important;
            background-color: @background-color;
        }
    }

    .content-expand {
        width: 100%;
        height: 0;
        overflow: hidden;
        position: relative;
    }
</style>