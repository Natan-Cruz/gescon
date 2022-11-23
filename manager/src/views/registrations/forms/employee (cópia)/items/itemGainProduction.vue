<template>
    <li class="item">
        <div class="content form_row form_spacing_bottom">
            <wrapper-input label="Descrição curta:" id="short_description">
                <input type="text" class="input" id="short_description" v-model="short_description" :disabled="disabled">
            </wrapper-input>

             <wrapper-input label="Descrição longa:" id="long_description">
                <input type="text" class="input" id="long_description" v-model="long_description" :disabled="disabled">
            </wrapper-input>

            <wrapper-input label="Valor:" id="price">
                <input-money class="input" id="price" v-model="price" :disabled="disabled" />
            </wrapper-input>

            <wrapper-input label="Unidade:" id="unity">
                <input type="text" class="input" id="unity" v-model="unity" :disabled="disabled">
            </wrapper-input>
        </div>

        <button class="button-trash" @click="remove" v-show="!disabled">
            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
    </li>
</template>

<script>
import inputMoney from "@/components/inputMoney/inputMoney.vue"

import { computed } from 'vue'

export default {
    emits: ["edit", "remove"],
    components: { inputMoney },
    props: {
        gain_production: Object,
        disabled: Boolean,
        index: Number
    },
    setup(props, { emit }){
        const short_description = computed({
            get: () => props.gain_production.short_description,
            set: short_description => emit("edit", { index: props.index, gain_production: { ...props.gain_production, short_description }})
        })
        const long_description = computed({
            get: () => props.gain_production.long_description,
            set: long_description => emit("edit", { index: props.index, gain_production: { ...props.gain_production, long_description }})
        })
         const unity = computed({
            get: () => props.gain_production.unity,
            set: unity => emit("edit", { index: props.index, gain_production: { ...props.gain_production, unity }})
        })
        const price = computed({
            get: () => props.gain_production.price,
            set: price => emit("edit", { index: props.index, gain_production: { ...props.gain_production, price }})
        })

        function remove(){
            emit("remove", { index: props.index, gain_production: props.gain_production } )
        }

        return {
            short_description,
            long_description,
            unity,
            price,
            // 
            remove
        }
    }
}
</script>

<style lang="less" scoped src="./item.style.less"></style>
