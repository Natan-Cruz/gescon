<template>
    <div class="wrapper-component">
        <div class="ctn">
            <button-close
                @event-close="$emit('event-close')"/>

            <item 
                v-for="( risk, i) in risks" 
                :key="i" 
                :severity="severity"
                :risk="risk" 
                :title="risk.title"
                @select-item="$emit('event-close');$emit('event-select-severity-occurrence', $event)"/> 
        </div>
    </div>
</template>

<script>
import buttonClose from "./buttonClose.vue";
import item from "./item.vue";

export default {
    name: "wrapper-component",
    components: {
        buttonClose,
        item
    },
    props: {
        severity: {
            type: Number
        },
        risks:{
            type: Array
        }
    }
}
</script>

<style lang="less" scoped >
    @very-low: #00ac46;
    @low: #fdc500;
    @moderate: #fd8c00; 
    @high: #dc0000;
    @very-high: #780000;

    .wrapper-component{
        width: 220px;
        height: auto;
        box-shadow: 0 0 6px rgba(0,0,0,.35);
        border-radius: 5px;
        padding: 10px;
        position:absolute;
        top: 0;
        left: 0;
        background-color: #fff;
        border-radius: 5px;
        z-index: 1000;
    }

    ._ctn_{
        position: relative;
    }

    .list-severity{
        li{
            font-size: 1.7em;
            line-height: 1em;
            position: relative;
            padding-left: 30px;
padding-top: 5px;
            height: 34px;
            margin-bottom: 12px;
            border-bottom: dashed 1px gray;
            &:last-child{
                border: none;
                margin-bottom: 0;
            }
            cursor: pointer;
        }
        li::before{
            content: "";
            display: block;
            width: 26px;
            height: 26px;
            position: absolute;
            top: 0;
            left: 0;
        }
    }

    .very-low::before{
        background-color: @very-low;
    }

    .low::before{
        background-color: @low;
    }
    .moderate::before{
        background-color: @moderate;
    }
    .high::before{
        background-color: @high;
    }
    .very-high::before{
        background-color: @very-high;
    }
</style>