<template>
    <div class="wrapper-input-password">
        <label :for="input_uid" class="label-input">{{ label }}</label>

        <input 
            :type="state.type" 
            :id="input_uid"
            class="input" 
            :placeholder="placeholder" 
            :value="modelValue" 
            @keydown="keydown"
            @input="$emit('update:modelValue', $event.target.value)"
            :autocomplete="autocomplete"
            ref="input"> 

        <span class="message-info-caps_lock" v-show="state.capsLock">
            CapsLock ligado!
        </span>

        <div class="ctn-toggle-password">
            <input type="checkbox" :id="checkbox_uid" @input="showPassword">
            <label :for="checkbox_uid" class="label-toggle-password">Mostrar senha</label>
        </div>
    </div>
</template>

<script>
import { randomID } from "@/Utils/index.js";
import { ref, reactive } from "vue";

export default {
    name: "wrapper-input-password",
    props: {
        label: {
            type: String,
            default: "",
            required: false
        },
        placeholder: {
            type: String
        },
        modelValue: {
            type: String,
            default: ''
        },
        autocomplete: {
            type: String,
            required: false,
            default: "new-password"
        }
    },
    setup(_, { emit }){
        const state = reactive({
            capsLock: false,
            type: "password"
        })
        const input = ref(null);
        const input_uid = randomID()
        const checkbox_uid = randomID()

        function keydown(evt){
            if(evt.keyCode === 20)
                state.capsLock = !state.capsLock
            else
                state.capsLock = evt.getModifierState("CapsLock")

            if(evt.keyCode === 13)
                return emit("press-enter")
        }
        function showPassword(){
            if(state.type === "password")
                state.type = "text"
            else
            if(state.type === "text")
                state.type = "password"

            setTimeout(() => {
                setFocus() 
            }, 100);
        }
        function setFocus(){
            input.value.focus()
        }

        return {
            state,
            input_uid,
            checkbox_uid,
            keydown,
            showPassword,
            setFocus,
            input
        }
    }
}
</script>

<style lang="less" scoped>
    .label-input {
        font-size: 1.8em;
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
        color: rgb(71, 71, 71);
        outline: none;
    }
    .input {
        width: 100%;
        height: 50px;
        border-radius: 5px;
        border: none;
        font-size: 1.7em;
        padding-left: 15px;
        display: block;
        background: rgb(245, 245, 245);
        outline: none;
        &:focus {
            box-shadow: inset 0px 0 8px -6px #000000d9;
        }
    }
    .message-info-caps_lock{
        font-size: 1.5em;
        margin: 16px 0 4px 0;
        color: #cc3300;
        font-weight: bold;
        display: inline-block;
    }
    .ctn-toggle-password{
        display: flex;
        align-items: center;
        margin-top: 12px;
    }
    .label-toggle-password{
        font-size: 1.7em;
        margin-left: 6px;
    }
</style>