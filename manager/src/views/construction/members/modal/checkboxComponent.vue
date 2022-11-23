<template>
    <div class="wrapper-checkbox">
        <input type="checkbox" class="input-checkbox" :id="uuid" v-model="isChecked" @input="handleInput" :disabled="disabled">
        <label :for="uuid" class="label-checkbox" :class="{ 'disabled': disabled }">{{ label }}</label>
    </div>
</template>

<script>
/* eslint-disable */
import { nextTick, onMounted, ref, watch } from 'vue'
import { randomID } from "@/Utils/index.js"

export default {
    emits: ["update:modelValue"],
    props: {
        label: String,
        key_value: String,
        modelValue: Array,
        disabled: Boolean,
        defaultChecked: {
            type: Boolean,
            required: false,
            default: () => false
        }
    },
    setup(props, { emit }){
        const isChecked = ref(false);
        const uuid = randomID();

        watch(() => props.modelValue, defineCheck)
        onMounted(() => {
            defineCheck()
            const has = props.modelValue && props.modelValue.findIndex( perm => perm === props.key_value )
            if(props.defaultChecked && has === -1){
                nextTick(() => {
                    isChecked.value = true
                    const m = props.modelValue;
                    m.push(props.key_value)
                    emit("update:modelValue", m)
                });
            }
        })

        function defineCheck(){
            props.modelValue && props.modelValue.forEach( value => {
                if(value === props.key_value) isChecked.value = true
            })
        }

        function handleInput(evt){
            const checked = evt.target.checked;
            if(checked){
                const m = props.modelValue;
                m.push(props.key_value)
                emit("update:modelValue", m)
            }else{
                const m = props.modelValue.filter( k => k !== props.key_value)
                emit("update:modelValue", m)
            }
        }
       
        return {
            isChecked,
            uuid,
            handleInput
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper-checkbox{
        display: flex;
        justify-content: flex;
        align-items: center;
        flex-direction: row;
        margin-bottom: 10px;
    }
 
    @input-measures: 17px;
    .input-checkbox{
        width: @input-measures;
        height: @input-measures;
    }

    .label-checkbox{
        font-size: 1.5em;
        margin-left: 8px;
    }
    .disabled{
        color: gray
    }
</style>