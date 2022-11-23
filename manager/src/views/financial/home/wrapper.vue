<template>
    <div class="wrapper wrapper-cash-flow">
        <p class="title">{{ title }}</p>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        title: String
    }
}
</script>

<style lang="less" scoped>
    .wrapper{
        border-radius: 5px;
        width: 100%;
        background-color: #fff;
        padding: 16px;
        box-shadow: 0 0 2px rgba(114, 114, 114, 0.1);
        margin-bottom: 24px;
    }

    .title{
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 12px;
    }
</style>