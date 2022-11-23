<template>
    <div class="row">
        <span class="key">{{ label }}:</span>
        <span class="value"> {{ value }} </span>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        label: String,
        value: [String, Number]
    }
}
</script>

<style lang="less" scoped>
    .row{
        margin-bottom: 6px;
        border-bottom: solid 1px gray;
        padding-bottom: 6px;
    }
    .key{
        color: rgb(63, 63, 63);
        margin-bottom: 6px;
        font-size: 1.6em;
        font-weight: bold;
    }
    .value{
        font-size: 1.5em;
        margin-left: 6px;
    }
</style>