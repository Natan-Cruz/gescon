<template>
    <input-suggest
        ref="input_suggest"
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
                <item-group v-for="(group, i) in groupBy(items)" :key=i :group_title="group.title" >
                    <item
                        v-for="(item, i) in group.items" :key=i 
                        :text='formatDisplayName(item, options.displayName)' 
                        :query="search"
                        :arrowsSelect="i === selectedIndex" 
                        :isSelected="isSelected(item.id)" 
                        :showEditButton="showEditButton"
                        @select-item="handleSelectItem(item)"
                        @edit-item="$emit('edit-item', item)" >
                    </item>
                </item-group>
            </ul>
        </template>
    </input-suggest>
</template>

<script>
import inputSuggest from "./baseComponent.vue";
import item from "./items/item.vue"
import itemGroup from "./items/itemGroup.vue"

import { computed, ref } from 'vue';
import { formatDisplayName } from "./utils.js"

export default {
    components: { inputSuggest, item, itemGroup },
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

        function groupBy(items){
            const opts = { key: "entity_id", title: "entity_name" };

            const reduced = items.reduce(function(rv, x) {
                (rv[x[opts.key]] = rv[x[opts.key]] || []).push(x);
                return rv;
            }, {});

            return Object.entries(reduced).map(([ id, value ]) => {
                return {
                    id: id,
                    title: value[0][opts.title],
                    items: value.map( contact => {
                        contact.contact_person = contact.contact_person || "Contato principal"
                        return contact
                    })
                }
            })
        }

        return {
            mValue,
            input_suggest,
            // 
            formatDisplayName,
            handleSelectItem,
            isSelected,
            clearSelected,
            // 
            groupBy
        }
    }
}
</script>