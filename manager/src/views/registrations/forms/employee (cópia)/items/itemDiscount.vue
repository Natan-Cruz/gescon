<template>
    <li class="item">
        <div class="content form_row">
            <wrapper-input label="Nome:" >
                <input type="text" class="input" v-model="name" :disabled="disabled">
            </wrapper-input>
            
            <wrapper-input label="Valor:" >
                <input-money class="input" v-model="value" :disabled="disabled" />
            </wrapper-input>

             <wrapper-input label="Dia de pagamento:" >
                <input type="number" class="input" v-model="payday" :disabled="disabled">
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
        discount: Object,
        disabled: Boolean,
        index: Number
    },
    setup(props, { emit }){
        const name = computed({
            get: () => props.discount.name,
            set: name => emit("edit", { index: props.index, discount: { ...props.discount, name }})
        })
        const value = computed({
            get: () => props.discount.value,
            set: value => emit("edit", { index: props.index, discount: { ...props.discount, value }})
        })
        const payday = computed({
            get: () => props.discount.payday,
            set: payday => emit("edit", { index: props.index, discount: { ...props.discount, payday }})
        })
        function remove(){
            emit("remove", { index: props.index, discount: props.discount } )
        }

        return {
            name,
            value,
            payday,
            // 
            remove
        }
    }
}
</script>

<style lang="less" scoped src="./item.style.less"></style>