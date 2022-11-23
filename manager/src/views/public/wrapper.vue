<template>
    <div class="global-wrapper">
        <label class="label">{{ label }}:</label>
        <slot />
    </div>
</template>

<script>
export default {
    name: "global-wrapper",
    props: { label:String }
}
</script>

<style lang="less" scoped>
    .global-wrapper{
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px dashed #979797;
    }
    .label{
        font-weight: bold;
        font-size: 1.7em;
        display: block;
        color: #3b3b3b;
    }
</style>