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
    // .header{
    //     display: flex;
    //     align-items: center;
    //     justify-content: space-between;
    //     background-color: rgb(219, 219, 219);
    //     padding: 10px;
    //     margin: 12px 0;
    // }
    // .sub-title{
    //     font-size: 1.6em;
    //     color: rgb(59, 59, 59);
    //     font-weight: bold;
    // }

    .header{
        background-color: rgba(255, 102, 0, 0.8);
        padding: 10px;
        color: #fff;
        font-weight: bold;
        margin: 16px 0;
    }
    .sub-title{
        font-size: 1.6em;
        font-weight: bold;
    }
    
    .button-add{
        width: auto;
        height: auto;
        border-radius: 5px;
        border: solid 1px gray;
        cursor: pointer;
        font-size: 1.5em;
        padding: 8px;
        transition: transform 250ms;
        &:active{
            transform: scale(.8);
        }
    }
</style>