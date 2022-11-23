<template>
    <li class="item">
        <p class="label">{{ label }}:</p>
        <p class="value">{{ value }}</p>
    </li>
</template>

<script>
export default {
    name: "item",
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
    .item{
        border-bottom: 1px dashed #bebebe;
        padding: 10px 0;
        &:last-child{
            border:none;
            padding-bottom: 0;
        }
        & > p{
            font-size: 1.6em;
        }
    }
    .label{
        font-weight: bold;  
        display: inline-block;
        text-align: right;
        width: 160px;
        margin-right: 12px;
    }
    .value{
        display: inline-block;
        color: #707070;
    }

</style>