<template>
    <wrapper-input label="Celular" id="phone">
        <input type="text" ref="input" id="phone" class="input" placeholder="Sem telefone" :disabled="disabled" :value="phone" @input="$emit('update:phone', $event.target.value)" v-maska="['(##) #####-####', '(##) ####-####']">
    </wrapper-input>
</template>

<script>
import { nextTick, ref, watchEffect } from 'vue'
export default {
    props:{ phone: String, disabled: Boolean },
    setup(props){
        const input = ref(null)

        watchEffect(() => {
            if (!props.disabled) {
                nextTick(() => input.value.focus())
            }
        })

        return { input }
    }
}
</script>