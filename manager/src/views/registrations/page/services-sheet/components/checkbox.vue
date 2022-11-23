<template>
    <div class="checkbox">
        <input type="checkbox" :id="uuid" v-model="isChecked">

        <label :for="uuid">{{ label }}</label>
        
        <div class="icon">
            <slot />
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { randomID } from "@/Utils/index.js"

export default {
    emits: ["input"],
    props: {
        label: String,
        key_value: String,
        value: Array
    },
    setup(props, { emit }){
        const isChecked = ref(false);
        const uuid = randomID();

        onMounted(() => {
            props.modelValue && props.modelValue.forEach( value => {
                if(value === props.value) isChecked.value = true
            })
        })

        watch(() => props.modelValue, () => {            
            props.modelValue && props.modelValue.forEach( value => {
                if(value === props.value) isChecked.value = true
            })
        })
        
        watch(isChecked, isChecked => {
            if(isChecked){
                const model = props.value || []
                model.push(props.key_value);
                emit("input", model)
            }else{
                const model = props.value.filter( key_value => key_value !== props.key_value)
                emit("input", model)
            }
        })
        return {
            isChecked,
            uuid
        }
    }
}
</script>
<style lang="less" scoped>
    .checkbox{
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        position: relative;

        margin-bottom: 8px;
        padding-bottom: 4px;
        cursor: pointer;

        input{
            width: 16px;
            height: 16px;
            margin-right: 6px;
        }

        label{
            font-size: 1.7em;
        }

        input:checked + label {
            font-weight: bold;
        }
        input:checked + label + .icon {
            opacity: 1;
        }
        
        .icon{
            position: absolute;
            right: 0;
            top: 0;
            opacity: .5;
           
        }
    }

</style>