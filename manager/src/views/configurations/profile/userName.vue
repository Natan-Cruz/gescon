<template>
    <div class="row-inputs">
        <div class="ctn-input">
            <wrapper-input label="Nome" id="first-name">
                <input type="text" id="first-name" ref="input" class="input" :value="first_name" @input="$emit('update:first_name', $event.target.value)" :disabled="disabled">
            </wrapper-input>
        </div>
        
        <div class="ctn-input">
            <wrapper-input label="Sobrenome" id="last_name">
                <input type="text" id="last_name" class="input" :value="last_name" @input="$emit('update:last_name', $event.target.value)" :disabled="disabled">
            </wrapper-input>
        </div>
    </div>
</template>

<script>
import { nextTick, ref, watchEffect } from 'vue'

export default {
    props:{
        disabled: Boolean,
        first_name: String,
        last_name: String,
    },
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

<style lang="less" scoped>
    .row-inputs{
        display: flex;   
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .ctn-input{
        width: 48%;
    }
</style>