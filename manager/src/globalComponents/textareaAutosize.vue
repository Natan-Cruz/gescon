<template>
    <div class="container-textarea input_error" ref="container_textarea" :class="{ 'container-textarea-disabled': disabled }">

        <div v-show="disabled" class="disabled"></div>

        <textarea
            :value="mValue"
            :placeholder="placeholder"
            @input="resize"
            ref="textarea"
            rows="1"
            class="textarea-autosize"
            :style="styles">
        </textarea>
        
        <div v-show="!disabled" class="bottom">
            <span class="counter">{{ modelValueLength }} / {{ maxLength || '-' }}</span>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
    name: "textarea-autosize",
    emits: ["set-error", "update:modelValue"],
    props: {
        modelValue: {
            type: String,
            default: ""
        },
        value:{
            type: String,
            default: ""
        },
        minHeight:{
            type: Number,
            required: false,
            default: 50
        },
        maxHeight:{
            type: Number,
            required: false
        },
        maxLength: {
            type: Number,
            required: false
        },
        disabled: {
            type: Boolean,
            required: false,
            default: () => false
        },
        placeholder: {
            type: String,
            required: false
        }
    },
    setup(props, { emit }){
        const textarea = ref(null);
        const container_textarea = ref(null)

        const mValue = computed({
            get: () => props.modelValue || props.value,
            set: value => {
                emit("update:modelValue", value)
            }
        })

        const styles = computed(() => {
            if(!mValue.value && props.disabled)
                return `min-height: ${ 0 }px;`

            return `min-height: ${ props.minHeight }px`
        })

        watch(() => props.modelValue, modelValue => {
            
            if(!props.maxLength || typeof modelValue !== 'string') return;

            if(modelValue.length > props.maxLength)
                emit("set-error", "Tamanho máximo do texto atingido")
            else
                emit("set-error", "")
        })
        let i;
        function resize(evt){
            const txtArea = textarea.value;
            if(txtArea.scrollHeight > props.minHeight){

                if(i && i > txtArea.scrollHeight)
                    container_textarea.value.style.height = (txtArea.scrollHeight - 40) + 'px';
                    
                if(i && i < txtArea.scrollHeight)
                    container_textarea.value.style.height = (txtArea.scrollHeight + 40) + 'px';
                
                i = txtArea.scrollHeight
            } else {
                container_textarea.value.style.height = (props.minHeight + 30 + 10) + 'px';
            }

            emit('update:modelValue', evt.target.value)
        }

        const modelValueLength = computed(() => {
            if(typeof props.modelValue === 'string')
                return props.modelValue.length
            else
                return 0
        })

        return {
            mValue,
            textarea,
            container_textarea,
            modelValueLength,
            styles,
            // method
            resize
        }
    }
}
</script>

<style lang="less" scoped>
    .container-textarea{
        height: auto;
        border: 1px solid rgba(210, 210, 210);
        padding: 10px 15px 30px 10px;
        position: relative;
        border-radius: 3px;
    }
    .container-textarea-disabled{
        border: none;
        border-bottom: 1px solid rgba(165, 165, 165, 0.5);
        background-color: #fff;
        color: #484848;
        padding: 10px 15px 5px 10px;
    }

    .disabled{
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        background-color: #f3f3f3;
        opacity: 0.4;
    }
    .textarea-autosize{
        overflow-y: auto;
        overflow-x: hidden;
        resize: none;
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        font-size: 1.7em;

        color: inherit;
    }
   
    .bottom{
        width: calc(100% - 30px);
        height: 20px;

        position: absolute;
        bottom: 5px;
        left: 15px;
        padding-top: 3px;

        border-top: dashed 1px gray !important;
        text-align: right;

        .counter{
            font-size: 1.4em;
            display: block;
            opacity: .7;
        }
    }
</style>