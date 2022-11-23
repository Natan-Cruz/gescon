<template>
    <div class="payment-terms">
        <input type="number" class="input" :value="payment_term_days" placeholder="Dias" min="0" @input="$emit('update:payment_term_days', $event.target.value)">
        <select class="select" :value="payment_terms" @input="$emit('update:payment_terms', $event.target.value)">
            <option value=""  disabled >Defina o termo</option>
            <option value="DDL">DDL</option>
            <option value="DDF">DDF</option>
            <option value="DFM">DFM</option>
            <option value="DFQ">DFQ</option>
            <option value="DFS">DFS</option>
        </select>
    </div>
</template>

<script>
export default {
    emits: ["update:payment_term_days", "update:payment_terms"],
    props: {
        payment_term_days: Number,
        payment_terms: String
    }
}
</script>
<style lang="less" scoped>
    .payment-terms{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .input{
        width: 60px;
    }
    .select{
        width: calc(100% - 70px)
    }
</style>