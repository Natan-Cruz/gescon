<template>
    <li class="item-account">
        <p class="name">{{ role.name }}</p>
        <p class="description">{{ role.description }}</p>
    </li>
</template>

<script>
export default {
    props: {
        role: Object
    }
}
</script>

<style lang="less" scoped>
    .item-account{
        width: 100%;
        display: grid;
        border-bottom: 1px dashed #c2c2c2;
        cursor: pointer;
        padding: 10px 0;

        display: grid;
        grid-template-areas: "name description";
        grid-template-columns: repeat(2,1fr);
        grid-template-rows: auto;

        p{
            font-size: 1.7em;
        }
    }
    
</style>