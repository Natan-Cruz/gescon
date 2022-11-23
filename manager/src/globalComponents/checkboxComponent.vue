<template>
    <div class="wrapper-checkbox" @keydown="handleKeydown">
        <input :type="type" class="input-checkbox"
            :name="name"
            :id="id" 
            :checked="modelValue || value" 
            :style="style"
            @change="$emit('update:modelValue', $event.target.checked)" :disabled="disabled">
        <label :for="id" class="label-checkbox" :style="{ fontSize: `${ font }px` }" :class="{ 'disabled': disabled }">{{ label }}</label>
    </div>
</template>

<script>
import { randomID } from "@/Utils/index";
import { computed } from "vue";

export default {
    name: "checkbox",
    props: {
        label: {
            type: String
        },
        value: {
            type: Boolean,
            default: false
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            required: false,
            default: () => false
        },
        scale: {
            type: Number,
            required: false,
            default: 20
        },
        font: {
            type: Number,
            required: false,
            default: 17
        },
        type: {
            type: String,
            required: false,
            default: "checkbox"
        },
        name: {
            type: String
        }
    },
    setup(props, { emit }){
        function handleKeydown(evt){
            if(evt.keyCode === 13)
                emit('update:modelValue', !evt.target.checked)
        }
        const style = computed(() =>{ 
            return `width: ${ props.scale }px; height: ${ props.scale }px`
        })

        return {
            id: randomID(),
            handleKeydown,
            style
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
    }
    .label-checkbox{
        font-size: 1.7em;
        margin-left: 8px;
    }
    .disabled{
        color: gray
    }
</style>