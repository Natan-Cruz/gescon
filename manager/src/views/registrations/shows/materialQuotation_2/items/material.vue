<template>
    <li class="item">
        <div v-show="isChecked" class="background-select" ></div>

        <input type="checkbox" :id="uid" class="checkbox" :checked="isChecked" @input="handleToggle">
        <label :for="uid" class="label-item"></label>
        
        <p class="material_name">{{ item.material_name }}</p>
        <p class="unity"><span class="sub-text bold">Un:</span> {{ item.unity }}</p>
        <p class="quantity"><span class="sub-text bold">Qnd:</span> {{ item.quantity }}</p>
        <p class="unitary_value"><span class="sub-text bold">V/Un:</span> {{ formatCurrency(item.unitary_value) }}</p>
        <p class="total"><span class="sub-text bold">Total:</span> {{ formatCurrency(item.quantity * item.unitary_value) }}</p>
        <p class="anotation">{{ item.anotation }}</p>
    </li>
</template>

<script>
import { formatCurrency, randomID } from "@/Utils/index.js";
import { ref } from '@vue/reactivity';

export default {
    emits: ["toggle-check-item"],
    props: { item: Object },
    setup(props , { emit }){
        const isChecked = ref(false);
        function handleToggle(evt){
            const checked = evt.target.checked;
            isChecked.value = checked;
            
            emit('toggle-check-item', { 
                id: props.item.id, 
                isChecked: checked 
            })
        }
        const uid = randomID()

        return { formatCurrency, isChecked, uid, handleToggle }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: 
            "checkbox material_name material_name material_name material_name" 
            "checkbox unity unitary_value quantity total"
            "checkbox anotation anotation anotation anotation";
        grid-template-columns: 16px repeat(4, 1fr);
        grid-template-rows: repeat(3, minmax(0, auto));
        column-gap: 10px;
        row-gap: 5px;

        margin-bottom: 22px;
        position: relative;

        p{
            font-size: 1.5em;
        }

        &:last-child{
            margin-bottom: 0;
        }
    }

    .checkbox{ grid-area: checkbox; align-self: center; width: 16px; height: 16px; }
    .material_name{ grid-area: material_name; align-self: center; }
    .unity{ grid-area: unity; align-self: center; white-space: wrap; }
    .quantity{ grid-area: quantity; align-self: center; white-space: wrap; }
    .unitary_value{ grid-area: unitary_value; align-self: center;white-space: wrap; }
    .total{ grid-area: total; align-self: center; white-space: wrap; }
    .anotation{ grid-area: anotation; color: rgb(80, 80, 80); }

    // background-select
    .background-select{
        width: calc(100% + 10px);
        height: calc(100% + 15px);

        position: absolute;
        left: -5px;
        top: -7px;

        pointer-events: none;
        border-radius: 5px;

        background-color: rgba(212, 212, 212, 0.2);
        border: dashed 2px #f70;
    }

    .label-item{
        width: 100%;
        height: 100%;

        position: absolute;
        left: 0px;
        top: 0px;
    }
</style>