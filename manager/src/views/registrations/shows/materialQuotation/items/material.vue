<template>
    <li class="item">
        <div v-show="isChecked" class="background-select" ></div>

        <input type="checkbox" :id="uid" class="checkbox" @change="handleToggle($event.target.checked)">
        <label :for="uid" class="label-item"></label>

        <p class="material_name">{{ item.provider_name }}</p>
        <p class="unity">Unidade: <span class="sub-text bold">{{ item.unity }}</span> </p>
        <p class="quantity">Quantidade:<span class="sub-text bold">{{ item.quantity }}</span> </p>
        <p class="unitary_value">Valor unitário: <span class="sub-text bold">{{ formatCurrency(item.unitary_value) }}</span> </p>
        <p class="total">Valor total: <span class="sub-text bold">{{ formatCurrency(item.quantity * item.unitary_value) }}</span> </p>
        <p v-if="item.anotation" class="anotation">{{ item.anotation }}</p>
    </li>
</template>

<script>
import { formatCurrency, randomID } from "@/Utils/index.js";
import { ref } from 'vue';

export default {
    emits: ["select-item", "deselect-item"],
    props: { 
        item: {
            type: Object,
            required: true,
            default: () => ({})
        }  
    },
    setup(props , { emit }){
        const isChecked = ref(false);

        function handleToggle(checked){
            let keyName = checked ? "select-item" : "deselect-item"
            emit(keyName, { id: props.item.id })
        }

        return { 
            isChecked, 
            uid: randomID(), 
            // methods
            handleToggle, 
            formatCurrency, 
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: 
            "checkbox  material_name  material_name   material_name  material_name" 
            "checkbox  unity          unitary_value   quantity       total"
            "checkbox  anotation      anotation       anotation      anotation";
        grid-template-columns: 16px repeat(4, 1fr);
        grid-template-rows: repeat(3, minmax(0, auto));
        column-gap: 10px;

        position: relative;
        margin-bottom: 12px;
        padding: 12px 0;

        border-bottom: dashed 1px gray;

        p{
            font-size: 1.6em;
        }

        .material_name{
            font-weight: bold;
            font-size: 1.7em;
            color: rgb(58, 58, 58);
            line-height: 15px;
            margin-bottom: 10px;
        }

        &:last-child{
            margin-bottom: 0;
            border-bottom: none;
        }
    }

    .checkbox{ grid-area: checkbox; align-self: flex-start; width: 16px; height: 16px; }
    .material_name{ grid-area: material_name; align-self: center; }
    .unity{ grid-area: unity; align-self: center; white-space: wrap; }
    .quantity{ grid-area: quantity; align-self: center; white-space: wrap; }
    .unitary_value{ grid-area: unitary_value; align-self: center;white-space: wrap; }
    .total{ grid-area: total; align-self: center; white-space: wrap; }
    .anotation{ grid-area: anotation; color: rgb(80, 80, 80); }

    .label-item{
        width: 100%;
        height: 100%;

        position: absolute;
        left: 0px;
        top: 0px;
    }

    @media screen and (max-width: 700px){
        .item{
            grid-template-areas: 
                "checkbox  material_name  material_name" 
                "checkbox  unity          unitary_value"
                "checkbox  quantity       total"
                "checkbox  anotation      anotation";
            grid-template-columns: 16px repeat(2, 1fr);
            grid-template-rows: repeat(4, minmax(0, auto));
            
            .unity, .unitary_value{
                margin-bottom: 10px;
            }
        }
    }
</style>