<template>
    <div class="checkbox" :class="{ 'checked': isChecked, 'not-checked': !isChecked && modelValue}">
        <input type="checkbox" :id="uuid" v-model="isChecked">
        <label :for="uuid">
            {{ label }}
            <button class="btn-remove">
                <svg xmlns="http://www.w3.org/2000/svg" width="14.258" height="14.258" viewBox="0 0 14.258 14.258" fill="#fff">
                    <path id="Icon_material-close" data-name="Icon material-close" d="M21.758,8.936,20.322,7.5l-5.693,5.693L8.936,7.5,7.5,8.936l5.693,5.693L7.5,20.322l1.436,1.436,5.693-5.693,5.693,5.693,1.436-1.436-5.693-5.693Z" transform="translate(-7.5 -7.5)"/>
                </svg>
            </button>
        </label>
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
        modelValue: String
    },
    setup(props, { emit }){
        const isChecked = ref(false);
        const uuid = randomID();

        onMounted(() => {
            isChecked.value = props.modelValue === props.key_value
        })

        watch(() => props.modelValue, modelValue => {      
            if(modelValue !== props.key_value) 
                isChecked.value = false
        })
        
        watch(isChecked, isChecked => {
            if(isChecked){
                emit("update:modelValue", props.key_value)
            }else{
                emit("update:modelValue", "")
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
        width: max-content;
        height: auto;

        position: relative;
        cursor: pointer;

        padding: 4px 8px;

        border-radius: 6px;
        border: solid 1px gray;

        input{
            display: none;
        }

        label{
            font-size: 1.6em;
            white-space: nowrap;

            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            column-gap: 10px;
        }

        .btn-remove{
            border: none;
            background-color: transparent;
            width: 15px;
            height: 15px;

            display: none;
            pointer-events: none;
        }
    }
    .checked{
        background-color: rgba(211, 98, 0, 0.75);
        border-color: #f70;
        color: #fff9f4;
        font-weight: bold;

        .btn-remove{
            display: block;
        }
    }

    .not-checked{
        display: none;    
    }
</style>