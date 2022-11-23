<template>
    <li class="item" @click="$emit('select-item', risk.riskCode)" :class="{ 'hasSelected': hasSelected  }">
        <span class="detail" :style="`background-color: ${risk.color}`"></span>
        <span class="text">{{ risk.title }}</span>
    </li>
</template>

<script>
export default {
    name: "item",
    props:{
        risk: Object,
        severity: Number
    },
    computed: {
        hasSelected(){
            return this.severity === this.risk.riskCode;
        }
    }
}
</script>

<style lang="less" scoped >
    .item{
        position: relative;
        height: 34px;
        margin-bottom: 12px;
        border-bottom: dashed 1px gray;
        &:last-child{
            border: none;
            margin-bottom: 0;
        }
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 0 4px;
        border-radius: 5px;
    }

    .hasSelected{
        background-color: rgb(224, 224, 224);
    }

    .detail{
        content: "";
        display: block;
        width: 26px;
        height: 26px;
    }

    .text{
        font-size: 1.7em;
        line-height: 1em;
        margin-left: 10px;
    }
</style>