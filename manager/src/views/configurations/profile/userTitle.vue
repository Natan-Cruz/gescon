<template>
    <wrapper-input label="Titulo:" id="title">
        <input type="text" ref="input" id="title" class="input" :disabled="disabled" :value="title" @input="$emit('update:title', $event.target.value)">
    </wrapper-input>
</template>

<script>
import { nextTick, ref, watchEffect } from 'vue'
export default {
    props:{ title: String, disabled: Boolean },
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