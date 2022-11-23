<template>
    <input-suggest
        ref="input_suggest"
        :id="id"
        :disabled="disabled"
        :placeholder="placeholder"
        :url="url"
        :options="options"
        :selected="mValue"
        :url_search="url_search"
        @select-item="handleSelectItem($event)"
        @clear-selecteds="clearSelected">

        <template v-slot:content="{ items, selectedIndex, search }">
            <ul>
                <item
                    v-for="(item, i) in items" :key=i 
                    :text='formatDisplayName(item, options.displayName)' 
                    :query="search"
                    :arrowsSelect="i === selectedIndex" 
                    :isSelected="isSelected(item.id)" 
                    :showEditButton="showEditButton"
                    @select-item="handleSelectItem(item)"
                    @edit-item="$emit('edit-item', item)" >
                </item>
            </ul>
        </template>
    </input-suggest>
</template>

<script>
import inputSuggest from "./baseComponent.vue";
import item from "./items/item.vue"

import { computed, ref } from 'vue';
import { formatDisplayName } from "./utils.js"

export default {
    components: { inputSuggest, item },
    props: {
        modelValue: {
            type: [String, Number, Array],
        },
        value: [String, Number, Array],
        url: {
            type: String,
            required: true
        },
        options: {
            type: Object,
            required: true
        },
        placeholder: {
            type: String,
            required: false,
            default: ""
        },
        disabled: {
            type: Boolean,
            required: false,
            default: () => false
        },
        showEditButton: {
            type: Boolean,
            required: false,
            default: () => false
        },
        url_search: {
            type: Boolean,
            required: false,
            default: () => true
        },
        id: {
            type: String,
            required: false,
            default: ""
        }
    },
    setup(props, { emit }){
        const input_suggest = ref(null);

        const mValue = computed({
            get: () => props.modelValue || props.value,
            set: value => {
                emit("update:modelValue", value)
                emit("input", value)
            }
        })

        function handleSelectItem(item){
            if(!item) return;

            const keyValue = item[props.options.key]

            if(props.options.multi_select){
                if(mValue.value && Array.isArray(mValue.value)){
                    const index = mValue.value.findIndex( itm => itm === keyValue)

                    if(index > -1)
                        mValue.value.splice(index, 1)
                    else{
                        mValue.value.push(keyValue)
                    }
                }else{
                    mValue.value = [ keyValue ];
                }
            }else{
                mValue.value = keyValue
                input_suggest.value.handleClose()
            }
        }

        function isSelected(item_id){
            if(!mValue.value) return false;

            const typeOfValue = typeof mValue.value;

            if( typeOfValue === "object" && Array.isArray(mValue.value))
                return mValue.value.findIndex( itm => itm === item_id ) >= 0

            if( typeOfValue === "string" || typeOfValue === "number") 
                return mValue.value === item_id
        }

        function clearSelected(){
            const value = props.options.multi_select ? [] : "";
            mValue.value = value
        }

        return {
            mValue,
            input_suggest,
            // 
            formatDisplayName,
            handleSelectItem,
            isSelected,
            clearSelected
        }
    }
}
</script>