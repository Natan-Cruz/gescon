<template>
    <div class="checkbox" :class="{ 'checked': isChecked, 'is-disabled': disabled }">
        <input type="checkbox" :id="uuid" v-model="isChecked" @change="handleChange" :disabled="disabled">
        <label :for="uuid">{{ label }}</label>
    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { randomID } from "@/Utils/index.js"

export default {
    emits: ["update:modelValue"],
    props: {
        label: String,
        key_value: String,
        modelValue: Array,
        disabled: Boolean
    },
    setup(props, { emit }){
        const isChecked = ref(false);
        const uuid = randomID();

        onMounted(() => {
            if(props.modelValue && Array.isArray(props.modelValue))
                props.modelValue.forEach( keyValue => {
                    if(keyValue === props.key_value)
                        isChecked.value = true;
                })
        })

        watch(() => props.modelValue, modelValue => {
            if(modelValue && Array.isArray(modelValue))
                modelValue.forEach( keyValue => {
                    if(keyValue === props.key_value) isChecked.value = true;
                })
            else
                isChecked.value = false;
        })
        
        function handleChange(evt){
            const isChecked = evt.target.checked;
            if(isChecked){
                const model = props.modelValue || [];
                model.push(props.key_value)
                emit("update:modelValue", model)
            }else{
                const model = props.modelValue.filter( keyValue => keyValue !== props.key_value)
                emit("update:modelValue", model)
            }
        }

        return {
            isChecked,
            uuid,
            handleChange
        }
    }
}
</script>
<style lang="less" scoped>
    .checkbox{
        width: 100%;
        height: 42px;

        position: relative;

        border-radius: 6px;
        border: solid 1px gray;
        cursor: pointer;

        padding: 6px;

        input{
            display: none;
        }

        label{
            width: 100%;
            height: 100%;
            font-size: 1.6em;
            line-height: 1em;
            white-space: nowrap;

            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            cursor: inherit;
        }
    }
    .checked{
        background-color: rgba(211, 98, 0, 0.75);
        border-color: #f70;
        color: #fff9f4;
        font-weight: bold;
    }
    .is-disabled{
        opacity: .7;
        cursor: default;
    }
</style>