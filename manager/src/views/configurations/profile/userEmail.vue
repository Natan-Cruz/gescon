<template>
    <wrapper-input label="Email" id="email">
        <input type="email" id="email" ref="input" class="input" :value="email" :disabled="disabled" @input="$emit('update:email', $event.target.value)">
    </wrapper-input>
    <div class="ctn-msg" v-if="!confirmed_email">
        <span>Email não confirmado!</span>
        <button class="button button-second" @click="$emit('send-confirmation-email')">Enviar email</button>
    </div>
</template>

<script>
import { nextTick, ref, watchEffect } from 'vue'

export default {
    emits: [ "update:email", "send-confirmation-email"],
    props:{ email: String, disabled: Boolean, confirmed_email: Boolean },
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
    .ctn-msg{
        width: 100%;
        height: auto;

        display: flex;
        align-items: center;
        flex-direction: row;
        margin-top: 4px;
        font-size: 1.5em;

        span{
            font-size: 1em;
            color: #6b081c;
            background-color: #ffcc00;
            padding: 4px;
            border-radius: 5px;
        }

        button{
            width: auto;
            height: auto;
            margin-left: 5px;

            font-size: 1em;
            padding: 3px;
            // background-color: #ffcc00;
        }
    }
</style>