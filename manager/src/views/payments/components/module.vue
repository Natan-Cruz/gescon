<template>
    <li class="item" :class="{ 'is-selected': selected }">
        <div class="ctn-icon">
            <slot />
        </div>

        <p class="label">{{ label }}</p>
    </li>
</template>

<script>
export default {
    name: "item",
    props: {
        label: String,
        selected: Boolean
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 5px;
        background-color: #fff;
        border: solid 1px rgb(153, 153, 153);
        padding: 10px;
        &:last-child{
            margin-right: 0;
        }
    }
    .is-selected{
        border-color: #f70;
        background-color: rgb(228, 228, 228);
    }

    .ctn-icon{
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #F4F7FA;
        display: flex;
        align-items: center;
        justify-content: center;

        margin-bottom: 16px;
        
        :deep(svg){
            width: 30px;
        }
    }

    .label{
        font-size: 1.6em;
        color: #14395B;
        font-weight: bold;
    }
</style>