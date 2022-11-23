<template>
    <li class="item-table">
        <div class="content-row">
            <div class="wrapper-cell" @click="onClickHandler">
                <div class="wrapper-name" :title="data.name" :style="{ 'padding-left': padding_left }">
                    <button :aria-label="data.name" class="button-expand-or-collapse" :class="{ 'is-expanded': isExpanded }" v-show="hasChildren">
                        <svg class="" width="16" height="16" viewBox="0 0 48 48" data-icon="caret-down" style="stroke-width: 0; vertical-align: bottom;">
                            <path d="M24.21 33.173l12.727-12.728c.78-.78.78-2.048 0-2.828-.78-.78-2.047-.78-2.828 0l-9.9 9.9-9.9-9.9c-.78-.78-2.047-.78-2.827 0-.78.78-.78 2.047 0 2.828L24.21 33.173z"></path>
                        </svg>
                    </button>
                    <span class="name">{{ data.name }}</span>
                </div>
                <div class="gradient"></div>
            </div>

            <div class="cell-value" v-for="n in numberOfColumns" :key="n" :class="{ 'nth-color': n % 2 === 0 }"><span :class="{ 'bold': cellValueIsBold(n - 1) }">{{ formatValue(data.value[n - 1]) }}</span></div>
        </div>
        <div v-show="isExpanded" >
            <item-table v-for="(d, i) of data.children" :key="i" :data="d" :numberOfColumns="numberOfColumns"/>
        </div>
    </li>
</template>

<script>
import { computed, ref } from 'vue'
import { formatCurrency } from "@/Utils/index.js"

export default {
    props: {
        data: Object,
        numberOfColumns: Number
    },
    setup(props){
        const isExpanded = ref(true) 
        const padding_left = computed( () => {
            if(props.data.deep > 1)
                return (props.data.deep * 18) + "px"
            else
                return "8px"
        })
        const hasChildren = computed( () =>  {
            const { children } = props.data
            return children && children.length > 0
        })

        function cellValueIsBold(n){
            return typeof props.data.value[n] !== 'number' && typeof props.data.value[n] !== 'undefined'
        }
        function onClickHandler(){
            isExpanded.value = !isExpanded.value
        }
        function formatValue(v){
            if(typeof v === 'undefined') return "-"
            if(typeof v === "number")
                return v !== 0 ? formatCurrency(v) : "-"
            else
                return v
        }

        return {
            isExpanded,
            padding_left,
            hasChildren,
            // methods
            cellValueIsBold,
            onClickHandler,
            formatValue
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
    }
    .wrapper-name{
        padding: 8px 10px;
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
        // visibility: hidden;
    }
    .is-expanded{
        transform: rotate(0deg);
    }
    .makes_visible{
        visibility: initial;
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

        & > span{
            font-size: 1em;
        }
    }
    .nth-color{
        background-color: #fff;
    }
</style>