<template>
    <li class="item">
        <div class="content form_spacing_bottom form_row">
            <wrapper-input label="Método de pagamento:" id="payment_method">
                <select class="select" v-model="paymentMethod" :disabled="disabled">
                    <option value="" disabled>Escolha um método de pagamento</option>
                    <option value="Pix">Pix</option>
                    <option value="Depósito bancário">Depósito bancário</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <optgroup label="Transferência eletrônica">
                        <option value="TED">TED</option>
                        <option value="DOC">DOC</option>
                    </optgroup>
                    <optgroup label="Cartão">
                        <option value="Crédito">Crédito</option>
                        <option value="Débito">Débito</option>
                    </optgroup>
                    <optgroup label="Criptomoedas">
                        <option value="Bitcoin">Bitcoin</option>
                        <option value="Ethereum">Ethereum</option>
                        <option value="Criptomoeda">Outras...</option>
                    </optgroup>
                </select>
            </wrapper-input>
            <wrapper-input label="Descrição da forma de pagamento:" id="description">
                <input type="text" class="input" id="description" v-model="description" :disabled="disabled">
            </wrapper-input>
        </div>

        <button class="button-trash" @click="remove" v-show="!disabled">
            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
    </li>
</template>

<script>
import { computed } from 'vue'

export default {
    emits: ["edit", "remove"],
    props: {
        payment_method: Object,
        disabled: Boolean,
        index: Number
    },
    setup(props, { emit }){
        const paymentMethod = computed({
            get: () => props.payment_method.payment_method,
            set: payment_method => emit("edit", { index: props.index, payment_method: { ...props.payment_method, payment_method}})
        })
        const description = computed({
            get: () => props.payment_method.description,
            set: description => emit("edit", { index: props.index, payment_method: { ...props.payment_method, description }})
        })

        function remove(){
            emit("remove", { index: props.index, payment_method: props.payment_method } )
        }

        return {
            paymentMethod,
            description,
            // 
            remove
        }
    }
}
</script>

<style lang="less" scoped src="./item.style.less"></style>
