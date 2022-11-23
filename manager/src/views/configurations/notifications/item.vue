<template>
    <div class="item">
        <div class="icon">
            <slot name="icon" />
        </div>
        <p class="title">{{ title }}</p>
        <p class="description">{{ description }}</p>
        <div class="toggle">
            <slot name="toggle"/>
        </div>
    </div>
</template>

<script>

export default {
    name: "item",
    props: {
        title: String,
        description: String
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        max-width: 300px;

        display: grid;
        grid-template-areas: "icon title toggle" "icon description toggle";
        grid-template-columns: 24px 1fr 50px;
        grid-template-rows: auto;
        column-gap: 20px;

        border-radius: 5px;
        border: solid 1px gray;
        padding: 10px;
    }
    .icon{
        grid-area: icon;
        align-self: center;
    }
    .title{
        grid-area: title;
        font-size: 1.7em;
        font-weight: bold;
    }
    .description {
        grid-area: description;
        font-size: 1.5em;
        color: gray;
    }
    .toggle{
        grid-area: toggle;
        align-self: center;

        & > :deep(.container){
            width: 100%;
            display: initial;
        }
    }
</style>