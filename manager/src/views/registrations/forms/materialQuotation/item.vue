<template>
    <li class="item">
        <wrapper-input class="material_name" label="Material:" id="material_name" :error="errors.material_name">
            <input-suggest-list
                url="/materials/m?minimal=true"
                :options="{ key: 'name', displayName: 'name' }"
                placeholder="Selecione uma material"
                v-model="material_name" :disabled="disabled">
            </input-suggest-list>
        </wrapper-input>

        <wrapper-input class="unity" label="Unidade:" id="unity">
            <input type="text" class="input" id="unity" v-model="unity" :disabled="disabled">
        </wrapper-input>

        <wrapper-input class="unitary_value" label="Valor unitário:" id="unitary_value">
            <input-money class="input" id="unitary_value" v-model="unitary_value" :disabled="disabled" />
        </wrapper-input>

        <wrapper-input class="quantity" label="Quantidade:" id="quantity">
            <input type="number" class="input" id="quantity" v-model="quantity" :disabled="disabled">
        </wrapper-input>

        <wrapper-input class="discount" label="Disconto:" id="discount">
            <input-money class="input" id="discount" v-model="discount" :disabled="disabled" />
        </wrapper-input>

        <wrapper-input class="total" label="Total:" id="total">
            <input-money class="input" id="discount" :value="total" :disabled="disabled" />
        </wrapper-input>

        <button class="button-trash" @click="remove" v-if="!disabled">
            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
    </li>
</template>

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import inputMoney from "@/components/inputMoney/inputMoney.vue"

import { computed } from 'vue'

export default {
    emits: ["edit", "remove"],
    components: { inputSuggestList, inputMoney },
    props: {
        item: Object,
        disabled: Boolean,
        index: Number,
        errors: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    setup(props, { emit }){
        const material_name = computed({
            get: () => props.item.material_name,
            set: material_name => emit("edit", { index: props.index, item: { ...props.item, material_name }})
        })
        const unity = computed({
            get: () => props.item.unity,
            set: unity => emit("edit", { index: props.index, item: { ...props.item, unity }})
        })
        const quantity = computed({
            get: () => props.item.quantity,
            set: quantity => emit("edit", { index: props.index, item: { ...props.item, quantity }})
        })
        const unitary_value = computed({
            get: () => props.item.unitary_value,
            set: unitary_value => emit("edit", { index: props.index, item: { ...props.item, unitary_value }})
        })  
        const discount = computed({
            get: () => props.item.discount,
            set: discount => emit("edit", { index: props.index, item: { ...props.item, discount }})
        })  

        const total = computed(() => {
            const { unitary_value, quantity, discount } = props.item;
            return (unitary_value * quantity) - (discount || 0)
        })
       
        
        function remove(){
            emit("remove", { index: props.index, item: props.item } )
        }

        return {
            material_name,
            unity,
            quantity,
            unitary_value,
            discount,
            total,
            // 
            remove
        }
    }
}
</script>

<style lang="less" scoped> 
    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: "material_name unity quantity unitary_value discount total buttonTrash";
        grid-template-columns: 2fr repeat(5, 1fr) auto;
        grid-template-rows: auto;
        gap: 10px;

        border-bottom: dashed 1px gray;
        padding-bottom: 18px;
        margin-bottom: 18px;

        &:last-child{
            border-bottom: none;
            padding-bottom: none;
        }
    }

    @media screen and (max-width: 900px) {
        .item{
            grid-template-areas: 
                "material_name   material_name  material_name  material_name  material_name  buttonTrash" 
                "unity           quantity       unitary_value  discount       total          buttonTrash"; 
            grid-template-columns: repeat(5, 1fr) auto;
            grid-template-rows: repeat(2, auto);
        }
    }
    @media screen and (max-width: 650px) {
        .item{
            grid-template-areas: 
                "material_name   material_name    material_name  buttonTrash" 
                "unity           unity            quantity       buttonTrash"
                "unitary_value   discount         total          buttonTrash"; 
            grid-template-columns: repeat(3, 1fr) auto;
            grid-template-rows: repeat(3, auto);
        }
    }

    .material_name{ grid-area: material_name; }
    .unity{ grid-area: unity;}
    .quantity{ grid-area: quantity;}
    .unitary_value{ grid-area: unitary_value }
    .discount{ grid-area: discount }
    .total{ grid-area: total }
    .button-trash{ grid-area: buttonTrash; }

    .button-trash{
        align-self: center;

        width: 42px;
        height: 42px;

        border: none;
        background-color: #fff;
        border-radius: 50%;

        cursor: pointer;

        transition: 80ms ease-in;

        &:hover{
            background-color: rgb(206, 206, 206);
        }

        &:active{
            background-color: rgb(179, 179, 179);
            transform: scale(.96);
        }
    }
</style>