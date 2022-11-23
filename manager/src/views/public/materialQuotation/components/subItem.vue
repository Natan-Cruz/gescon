<template>
    <li class="item">
        <p class="material_name">{{ item.material_name }}</p>
        <p class="unity"><span class="sub-text bold">Unid:</span> {{ item.unity }}</p>
        <p class="quantity"><span class="sub-text bold">Qtd:</span> {{ item.quantity }}</p>
        <p class="unitary_value"><span class="sub-text bold">V/Unid:</span> {{ formatCurrency(item.unitary_value) }}</p>
        <p class="total"><span class="sub-text bold">Total:</span> {{ formatCurrency(item.quantity * item.unitary_value - (item.discount || 0)) }}</p>
        <p class="anotation">{{ item.anotation }}</p>
     
        <button class="button-actions error" @click="handleEmit('decline')">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
        </button>
    </li>
</template>

<script>
import { formatCurrency } from "@/Utils/index.js"
import { computed } from 'vue';

export default {
    emits: ["done", "decline", "add-item"],
    props: { item: Object },
    setup(props, { emit }){
        const showButtons = computed(() => {
            let done = true, decline = true;

            if(props.item.type === "done") decline = false
            if(props.item.type === "decline") done = false

            return {
                done, decline
            }
        })

        function handleEmit(evtName){
            if(props.item.type)
                emit("reset")
            else
                emit(evtName)
        }
        return { showButtons, formatCurrency, handleEmit }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: 
            "material_name unity unitary_value quantity  total decline" 
            "anotation anotation anotation anotation anotation decline";
        grid-template-columns: repeat(5, 1fr) 30px;
        grid-template-rows: repeat(3, minmax(0, auto));
        column-gap: 10px;
        row-gap: 3px;

        padding: 0 20px;

        border-bottom: dashed 1px gray;
        margin-bottom: 12px;
        position: relative;

        &:last-child{
            border-bottom: none;
        }

        p{
            font-size: 1.6em;
        }
    }

    .material_name{ grid-area: material_name; align-self: center; }
    .unity{ grid-area: unity; align-self: center;}
    .quantity{ grid-area: quantity; align-self: center; }
    .unitary_value{ grid-area: unitary_value; align-self: center; }
    .total{ grid-area: total; align-self: center; }
    .anotation{ grid-area: anotation; color: rgb(80, 80, 80); }
    .decline{ grid-area: decline }
    // button actions
    .button-actions{
        width: 30px;
        height: 30px;

        border: solid 2px #fff;
        border-radius: 5px;
        cursor: pointer;
        background-color: #fff;
        z-index: 1000;

        &:active{
            transform: scale(.8);
        }
    }
    .error{
        @color: #fe1701; 
        fill: @color;
        border-color: @color;
    }
</style>