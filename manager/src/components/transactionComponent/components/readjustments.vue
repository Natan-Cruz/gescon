<template>
    <div class="container-msg">
        <p>Você pode criar uma fórmula simples para adicionar, subtrair, multiplicar ou dividir valores</p>
        
        <p>Há funções pre-definidas, que são: <b>@POUPANCA()</b>, <b>@PERCENTUAL()</b></p>
    </div>
    <div class="readjustment">

        <wrapper-input label="Intervalo de repetição:" class="form_spacing_bottom" :error="errors.readjustment_frequency">
            <select-frequency class="input_error" v-model="readjustment_frequency" :disabled="disabled" />
        </wrapper-input>

        <wrapper-input label="Formula de correção:" :error="errors.readjustment_content">
            <textarea-autosize
                class="input_error"
                :minHeight="40"
                :maxLength="256"
                :maxHeight="300"
                v-model="readjustment_content"
                :disabled="disabled">
            </textarea-autosize>
        </wrapper-input>
    </div>
</template>

<script>
import selectFrequency from "../items/selectFrequency.vue"
import { computed } from "vue"

export default {
    emits: ["event-edit"],
    components: { selectFrequency },
    props: {
        trx: Object,
        index: Number,
        disabled: Boolean,
        errors: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    setup(props, { emit }){
        const readjustment_frequency = computed({
            get: () => props.trx.readjustment_frequency,
            set: readjustment_frequency => emit("event-edit", { ...props.trx, readjustment_frequency })
        })
        const readjustment_content = computed({
            get: () => props.trx.readjustment_content,
            set: readjustment_content => emit("event-edit", { ...props.trx, readjustment_content })
        })
       
        return {
            readjustment_frequency,
            readjustment_content
        }
    }
}
</script>

<style lang="less" scoped>
    .container-msg{
        margin-bottom: 12px;
        font-size: 1.7em;

        p, b{
            font-size: 1em;
        }
    }
</style>