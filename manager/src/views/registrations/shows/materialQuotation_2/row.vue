<template>
    <div class="row">
        <span class="key" :style="`width: ${ width }px`">{{ label }}:</span>
        <span class="value" :class="{ 'without-text': without }">
            <slot />

            <template v-if="without">
                {{ without_text }}
            </template>
        </span>
    </div>
</template>

<script>

export default {
    props: {
        label: String,
        width: Number,
        without_text: String,
        without: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>

<style lang="less" scoped>
    .row{
        border-bottom: solid 1px rgb(202, 202, 202);
        margin-bottom: 4px;
        padding-bottom: 4px;
    }
    .key{
        display: inline-block;

        color: rgb(63, 63, 63);
        font-size: 1.5em;
        text-align: right;
    }
    .value{
        font-size: 1.5em;
        margin-left: 6px;
    }
    .without-text{
        color: gray
    }
</style>