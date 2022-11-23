<template>
    <li>
        <div class="group-header">
            <p>{{ group_title }}</p>
        </div>
        <ul>
            <slot />
        </ul>
    </li>
</template>

<script>
export default {
    props: {
        group_title: String
    }
}
</script>

<style lang="less" scoped>
    .group-header{
        background-color: rgb(240, 240, 240);
        padding: 10px 6px;
        margin: 4px 0;

        p{
            font-size: 1.7em;
        }
    }
</style>