<template>
    <li class="item">
        <wrapper-input class="material_name form_spacing_bottom" label="Material:" id="material_id" :error="errors.material_id">
            <input-suggest-list
                url="/materials/m?minimal=true"
                :options="{ key: 'id', displayName: 'name' }"
                placeholder="Selecione uma material"
                v-model="material_id" :disabled="disabled">
            </input-suggest-list>
        </wrapper-input>

        <div class="informations form_row">
            <wrapper-input label="Unidade:" id="unity">
                <input type="text" class="input" id="unity" v-model="unity" :disabled="disabled">
            </wrapper-input>

            <wrapper-input label="Valor da unidade:" id="unitary_value">
                <input-money class="input" id="unitary_value" v-model="unitary_value" :disabled="disabled"/>
            </wrapper-input>

            <wrapper-input label="Quantidade:" id="quantity">
                <input type="text" class="input" id="quantity" v-model="quantity" :disabled="disabled">
            </wrapper-input>

             <wrapper-input label="Total:" id="amount">
                <input-money class="input" id="amount" v-model="amount" :disabled="disabled"/>
            </wrapper-input>
        </div>

        <wrapper-input class="anotation" label="Anotação">
            <textarea-autosize
                placeholder="Anote aqui..."
                v-model="anotation"
                :minHeight="40"
                :maxHeight="250"
                :maxLength="255"
                :disabled="disabled">
            </textarea-autosize>
        </wrapper-input>

        <button class="button-trash" @click="remove" v-show="!disabled">
            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
    </li>
</template>

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import inputMoney from "@/components/inputMoney/inputMoney.vue"

import { computed, watch } from 'vue'

export default {
    emits: ["edit", "remove"],
    components: { inputMoney, inputSuggestList },
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
        const material_id = computed({
            get: () => props.item.material_id,
            set: material_id => emit("edit", { index: props.index, item: { ...props.item, material_id }})
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
        const amount = computed({
            get: () => props.item.amount,
            set: amount => emit("edit", { index: props.index, item: { ...props.item, amount }})
        })
        const anotation = computed({
            get: () => props.item.anotation,
            set: anotation => emit("edit", { index: props.index, item: { ...props.item, anotation }})
        })
        

        watch([ () => unitary_value.value, () => quantity.value ], () => {
            if(unitary_value.value && quantity.value) amount.value = unitary_value.value * quantity.value;
        })

        function remove(){
            emit("remove", { index: props.index, item: props.item } )
        }

        return {
            material_id,
            unity,
            unitary_value,
            quantity,
            amount,
            anotation,
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
        grid-template-areas: "material_name buttonTrash" "informations buttonTrash" "anotation buttonTrash";
        grid-template-columns: 1fr 36px;
        grid-template-rows: repeat(2, auto);
        column-gap: 10px;

        border-bottom: dashed 1px gray;
        margin-bottom: 12px;

        &:last-child{
            border-bottom: none;
        }
    }

    .material_name{
        grid-area: material_name;
    }
    .informations{
        grid-area: informations;
    }
    .anotation{
        grid-area: anotation;
    }

    .button-trash{
        grid-area: buttonTrash;
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