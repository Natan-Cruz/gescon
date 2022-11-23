<template>
    <li class="item-table">

        <div class="content-row">
            <div v-show="disabled" class="disabled"></div>

            <div class="wrapper-cell" @click="isExpanded = !isExpanded">
                <div class="wrapper-name" :title="data.name" :style="{ 'padding-left': padding_left }">
                    <button :aria-label="data.name" class="button-expand-or-collapse" :class="{ 'is-expanded': isExpanded }" v-show="hasItems">
                        <svg class="" width="16" height="16" viewBox="0 0 48 48" data-icon="caret-down" style="stroke-width: 0; vertical-align: bottom;">
                            <path d="M24.21 33.173l12.727-12.728c.78-.78.78-2.048 0-2.828-.78-.78-2.047-.78-2.828 0l-9.9 9.9-9.9-9.9c-.78-.78-2.047-.78-2.827 0-.78.78-.78 2.047 0 2.828L24.21 33.173z"></path>
                        </svg>
                    </button>
                    <span class="name">{{ data.name || data }}</span>
                </div>
                <div class="gradient"></div>
            </div>

            <div class="cell-value" v-for="(item, n) in items" :set="uuid = randomID()" :key="item.key" :class="{ 'nth-color': n % 2 === 0 }">
                <template v-if="!item.hide">
                    <input type="checkbox" class="checkbox" :id="uuid" :checked="dataIsChecked(item.key)" @change.prevent.stop="handleClick(item.key, data.feature, $event.target.checked)">
                    <label :for="uuid">{{ item.name }}</label>
                </template>
            </div>
        </div>
        <div v-show="isExpanded" >
            <item-table v-for="(d, i) of data.items" :key="i" :data="d" :disabled="disabled" @select-item="$emit('select-item', $event)" @deselect-item="$emit('deselect-item', $event)"/>
        </div>
    </li>
</template>

<script>
import { computed, ref } from 'vue'
import { randomID } from "@/Utils/index.js" 

export default {
    name: "item-table",
    emits: ["select-item", "deselect-item"],
    props: {
        data: [ Object, String ],
        disabled: Boolean
    },
    setup(props, { emit }){
        const isExpanded = ref(false)

        const hasItems = computed( () => {
            const { items } = props.data
            return items && items.length > 0
        })

        const padding_left = computed(() => {
            return hasItems.value ? "" : "24px"
        })

        const items = computed(() => {
            const items = [
                { key: "show", name: "Ver" },
                { key: "create", name: "Criar" },
                { key: "edit", name: "Editar" },
                { key: "delete", name: "Deletar" },
            ]

            if(props.data.hide){
                return items.map( item => {
                    item.hide = props.data.hide.findIndex( actionHide => actionHide === item.key ) > -1
                    return item
                })
            }else{
                return items
            }
        })

        function handleClick(item_id, feature, checked){
            let keyName = checked ? "select-item" : "deselect-item";
            const items = [`${ item_id }:${ feature }`]
            if(props.data.items)
                props.data.items.forEach(({ feature }) => items.push(`${ item_id }:${ feature }`))

            emit(keyName, items)
        }

        function dataIsChecked(action_id){
            if(!props.data.actions) return false;
            return props.data.actions.findIndex( action => action === action_id) > -1
        }

        return {
            uuid: randomID(),
            randomID,
            isExpanded,
            padding_left,
            hasItems,
            numberOfColumns: 4,
            items,
            // 
            handleClick,
            dataIsChecked
        }
    }
}
</script>

<style lang="less" scoped>
    @nameFontSize: 1.5em;
    @valueFontSize: 1.7em;

    .item-table{
        display: block;
    }
    .content-row{
        display: table-row;
        position: relative;
    }

    .disabled{
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        background-color: rgba(171,181,186,.3);
        z-index: 1;
    }

    .wrapper-cell{
        position: -webkit-sticky; /* apenas chrome e webkit nightly */
        position: sticky;
        left: 0;
        border-left: solid 1px #e0e4e9;
        border-bottom: solid 1px #e0e4e9;
        border-right: solid 1px #e0e4e9;
        background-color: #fff;
        text-align: left;
        cursor: pointer;
    }
    .wrapper-name{
        padding: 8px 4px;
        width: 180px;
        height: 34px;
        vertical-align: middle;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 100%;
    }

    .button-expand-or-collapse{
        font-size: 1.3em;
        vertical-align: middle;
        padding: 0;
        margin-right: 2px;
        border: none;
        background-color: #fff;
        transform: rotate(-90deg);
        cursor: pointer;
        // visibility: hidden;
    }
    .is-expanded{
        transform: rotate(0deg);
    }

    .name{
        font-size: @nameFontSize;
        vertical-align: middle;
        white-space: nowrap;
        text-align: left;
        hyphens: none;
    }

    .gradient{
        background: linear-gradient(90deg,rgba(171,181,186,.3),transparent);
        height: 100%;
        width: 3px;

        position: absolute;
        left: 100%;
        top: 0;
        pointer-events: none;
        padding-right: 5px;
    }

    // 
    .cell-value{
        text-align: center;
        min-width: 130px;
        display: table-cell;
        padding: 6px 0;
        font-size: @valueFontSize;
        vertical-align: middle;
            background-color: #f0f3f5;

        border-left: solid 1px #e0e4e9;
        border-bottom: solid 1px #e0e4e9;
        border-right: solid 1px #e0e4e9;

        & > label{
            font-size: 1em;
            margin-left: 6px;
        }
    }
    .nth-color{
        background-color: #fff;
    }
</style>