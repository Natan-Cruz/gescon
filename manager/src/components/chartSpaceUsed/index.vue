<template>
    <div class="wrapper-char-space-used">
        <p class="title">Espaço em nuvem usado:</p>
        <div class="progress">
            <span class="bar-progress" :style="{ 'width': calcWidthBySpaceUsed(totalUsed) }"></span>
            <p class="text-bar-progress bold"> {{ formatBytes(totalUsed) }} </p>
        </div>

        <span class="availabe-space bold">{{ formatBytes(availableSpaceInBytes) }}</span>
    </div>
</template>

<script>
import { formatBytes } from "@/Utils/index.js"

export default {
    props: {
        totalUsed: Number,
        availableSpaceInBytes: Number
    },
    setup(props){
        function calcWidthBySpaceUsed(totalUsed){
            return `${( totalUsed / props.availableSpaceInBytes ) * 100}%`
        }

        return {
            calcWidthBySpaceUsed,
            formatBytes
        }
    }
}
</script>

<style lang="less" scoped>
    @primary-color: #f70;
    @secondary-color: #f8d8bc;
    .wrapper-char-space-used{
        margin-bottom: 16px;
    }
    .title{
        font-size: 1.7em;
    }
    .progress{
        width: 100%;
        height: 30px;
        border-radius: 10px;
        border: 1px solid @primary-color;
        background-color: @secondary-color;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        overflow: hidden;
        margin: 12px 0;
    }
    .bar-progress{
        background-color: @primary-color;
        height: 100%;
        display: block;
        &:last-child{
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }
    .text-bar-progress{
        color: @primary-color;
        font-size: 1.4em;
        margin-left: 15px;
        display: block;
    }

    .availabe-space{
        color: @primary-color;
        font-size: 1.7em;
        text-align: right;
        display: block;
    }
</style>