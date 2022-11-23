<template>
    <div>
        <div class="header">
            <p class="sub-title">{{ label }}</p>
        </div>
        <ul>
            <slot></slot>
        </ul>
        <button class="button-add" @click="$emit('add-item')" :disabled="disabled">{{ button_label }}</button>
    </div>
</template>

<script>
export default {
    emits: ["add-item"],
    props: {
        label: String,
        button_label: String,
        disabled: Boolean
    }
}
</script>

<style lang="less" scoped>
    .header{
        margin: 12px 0;
    }
    .sub-title{
        font-size: 1.6em;
        color: rgb(97, 97, 97);
        font-weight: bold;
    }
    .button-add{
        width: auto;
        height: auto;
        border-radius: 5px;
        border: solid 1px gray;
        cursor: pointer;
        font-size: 1.5em;
        padding: 4px;
        transition: transform 250ms;
        &:active{
            transform: scale(.8);
        }
    }
</style>