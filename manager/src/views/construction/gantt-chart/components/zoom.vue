<template>
    <div class="container-zoom">
        <button class="btn-zoom" @click="$emit('update:modelValue', modelValue + 20 )">+</button>
        <span class="display">{{ modelValue }}%</span>
        <button class="btn-zoom" @click="modelValue > 20 && $emit('update:modelValue', modelValue - 20)"> -</button>
    </div>
</template>

<script>
export default {
    emits: ["update:modelValue"],
    props: {
        modelValue: Number
    }
}
</script>

<style lang="less" scoped>
    @width: 40px;
    @height: 30px;

    .container-zoom{
        width: @width;
        height: @height * 3;
        border-radius: 25px;

        box-shadow: 0px 0px 10px rgba(0, 0, 0, .4);
        background-color: #fff;

        position: absolute;
        top: 100px;
        right: 10px;
        overflow: hidden;
        z-index: 1000;
    }

    .btn-zoom{
        font-size: 1.5em;

        width: @width;
        height: @height;
        border: none;
        background-color: #fff;
        cursor: pointer;
    }

    .display{
        height: @height;

        text-align: center;
        font-size: 1.4em;
        display: inline-block;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>