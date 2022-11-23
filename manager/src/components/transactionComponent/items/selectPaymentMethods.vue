<template>
    <select class="select" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
        <option value="" disabled>Escolha um método de pagamento</option>
        <option value="Pix">Pix</option>
        <option value="Depósito bancário">Depósito bancário</option>
        <option value="Boleto">Boleto bancário</option>
        <option value="Dinheiro">Em espécie</option>
        <option value="Cheque">Cheque</option>
        <option value="Permuta">Permuta</option>
        <optgroup label="Transferência eletrônica">
            <option value="TED">TED</option>
            <option value="DOC">DOC</option>
        </optgroup>
        <optgroup label="Cartão">
            <option value="Crédito">Crédito</option>
            <option value="Débito">Débito</option>
        </optgroup>
    </select>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: String,
            required: true,
            default: ""
        }
    }
}
</script>  