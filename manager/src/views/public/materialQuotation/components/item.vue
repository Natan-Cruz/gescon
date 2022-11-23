<template>
    <li class="item">
        <div v-if="isAnswerDecline" class="decline-background" ></div>

        <p class="material_name">{{ item.material_name }}</p>
        <p class="unity"><span class="sub-text bold">Unid:</span> {{ item.unity }}</p>
        <p class="quantity"><span class="sub-text bold">Qtd:</span> {{ item.quantity }}</p>
        <p class="unitary_value"><span class="sub-text bold">V/Unid:</span> {{ formatCurrency(item.unitary_value) }}</p>
        <p class="total"><span class="sub-text bold">Total:</span> {{ formatCurrency(item.quantity * item.unitary_value - (item.discount || 0)) }}</p>
        <p class="anotation">{{ item.anotation }}</p>

        <button v-if="showButtons.done" :style="!item.answer ? 'opacity: .7' : 'opacity: 1' " class="button-actions done" @click="handleEmit('done')">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z"/></svg>
        </button>
        <button v-if="showButtons.decline" :style="!item.answer ? 'opacity: .7' : 'opacity: 1' " class="button-actions error" @click="handleEmit('decline')">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/></svg>
        </button>

        <div class="sub-items">
            <slot />
        </div>

        <button v-if="isAnswerDecline" class="button-add-alternative" @click="$emit('add-item')">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"/></svg>
            Adicionar alternativa
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

            if(props.item.answer === "done") decline = false
            if(props.item.answer === "decline") done = false

            return { done, decline }
        })

        const isAnswerDecline = computed(() => props.item.answer === "decline")

        function handleEmit(evtName){
            if(props.item.answer)
                emit("reset")
            else
                emit(evtName)
        }
        return { showButtons, isAnswerDecline, formatCurrency, handleEmit }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: 
            "material_name    material_name      material_name        material_name      done decline"
            "unity            unitary_value      quantity             total              done decline" 
            "anotation        anotation          anotation            anotation          done decline"
            "sub_items        sub_items          sub_items            sub_items          sub_items sub_items "
            "btn_alternative  btn_alternative    btn_alternative      btn_alternative    btn_alternative btn_alternative";
        grid-template-columns: repeat(4, 1fr) repeat(2, minmax(0, auto));
        grid-template-rows: repeat(5, minmax(0, auto));
        column-gap: 10px;
        row-gap: 3px;

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
    .done{ grid-area: done; align-self: center; }
    .decline, .error{ grid-area: decline; align-self: center; }
    .sub-items{ grid-area: sub_items; }
    .button-add-alternative{ grid-area: btn_alternative;}

    // decline-background
    .decline-background{
        width: calc(100% + 20px);
        height: calc(100% + 20px);

        position: absolute;
        left: -10px;
        top: -16px;

        pointer-events: none;
        border-radius: 5px;
      
        &::before{
            content: "";
            display: block;
            width: calc(100% - 70px);
            height: 1px;
            background-color: #000;
            margin-top: 25px;
            margin-left: 10px;
        }

        &::after{
            content: "";
            display: block;
            width: calc(100% - 70px);
            height: 1px;
            background-color: #000;
            margin-top: 20px;
            margin-left: 10px;
        }
    }

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
    .done{
        @color: #00c800; 
        fill: @color;
        border-color: @color;
    }
    .error{
        @color: #fe1701; 
        fill: @color;
        border-color: @color;
    }

    .button-add-alternative{
        @color: #f70;

        width: auto;
        height: auto;
        justify-self: left;
        z-index: 1000;

        padding: 6px;

        border: dashed 1px @color;
        color: @color;
        fill: @color;
        background-color: #fff;
        
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.6em;
        transition: 200ms;
        margin-bottom: 12px;
        margin-left: 24px;

        display: flex;
        align-items: center;

        &:active{
            transform: scale(.8);
        }

        svg{
            margin-right: 8px;
        }
    }
</style>