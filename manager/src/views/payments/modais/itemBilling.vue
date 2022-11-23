<template>
    <li class="item-billing">
        <p class="label">{{ label }}:</p>
        <p class="value">{{ value }}</p>
    </li>
</template>

<script>
export default {
    name: "item-billing",
    props: {
        label: {
            type: String
        },
        value: {
            type: [String, Number]
        }
    }
}
</script>

<style lang="less" scoped>
    .item-billing{
        padding: 4px 0;
        & > p{
            font-size: 1.6em;
        }
    }
    .label{
        font-weight: bold;  
        display: inline-block;
        text-align: right;
        width: 112px;
        margin-right: 12px;
        color: rgb(121, 121, 121);
    }
    .value{
        display: inline-block;
        color: #707070;
    }
</style>