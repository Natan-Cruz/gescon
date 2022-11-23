<template>
    <td class="expandable-content" :class="{ 'is-expanded': isOpen }" >
        <input type="checkbox" :id="uuid" class="input-select input-select-row" v-model="isOpen" @change="handleChange">

        <div class="row">
            <label :for="uuid" class="label-select">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
            </label>

            <div class="label-content" @click="$emit('vizualize');">
                <slot name="label" />
            </div>

            <popup-options class="popup-options" v-show="!disabled" v-slot="{ hide }">
                <p class="text-medium" @click="$emit('edit'); hide()">Editar</p>
            </popup-options>
        </div>
        
        <div class="content-expand">        
            <slot />
        </div>
    </td>
</template>

<script>
import { ref } from 'vue';
import { randomID } from '@/Utils';
import popupOptions from '@/components/popup-options.vue';

export default {
    components: { popupOptions },
    setup(){
        const uuid = randomID();
        const isOpen = ref(false)

       function handleChange(evt){
            const checked = evt.target.checked
            if(checked)
                document.querySelectorAll(".input-select-row").forEach( node => node.checked = node.id === uuid)
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
    @background-color: rgba(255, 127, 15, 0.2) ;

   .expandable-content{
        width: 100%;
        transition: 120ms ease-in;
        border-radius: 5px;
        display: block;
        border-bottom: solid 1px rgb(218, 218, 218);
    }

    .row{
        width: 100%;
        height: auto;
        display: flex;
        align-items: center;
    }
    
    .label-select {
        width: 50px;
        height: 50px;

        padding: 13px;

        cursor: pointer;
        background-color: transparent;

        transition: 120ms;
        -webkit-tap-highlight-color: transparent;
        user-select: none;

        svg {
            transition: 250ms;
            transform: rotate(-180deg);
        }
    }
    .label-content{
        &:hover{
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .popup-options{
        position: absolute;
        right: 0;
    }

    .input-select {
        display: none;
        &:checked+.row{
            border-bottom: dashed 1px gray;
            background-color: @background-color;
        }
        &:checked+.row>.label-select>svg {
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