<template>
    <ul class="list-errors">
        <li class="message" :style="'opacity:1; height:min-content'">
            {{ errorMsg }}
        </li>
    </ul>
</template>

<script>
export default {
    name: "wrapper-errors",
    props: {
        errorMsg: {
            type: String
        }
    }
}
</script>

<style lang="less" scoped>
    .list-errors{
        margin-top: 16px;
    }
    .message {
        font-size: 1.7em;
        line-height: 1em;
        height: 0;
        opacity: 0;
        font-weight: bold;
        transition: 150px;
        color: #ff0033;
        list-style: inside;
        margin: 5px 0;
        &::marker {
            margin-right: 10px;
        }
    }

</style>