<template>
    <div>
        <label :for="id" class="label" v-if="label" :class="{ 'label-error': error }">{{ label }}</label>
        <div :class="{ 'slot-error': error }">
            <slot />
        </div>
        <span v-show="error" class="error">{{ error }}</span>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: false
        },
        id: {
            type: String,
            required: false
        },
        error: {
            type: String,
            required: false
        }
    }
}
</script>
<style lang="less" scoped>
    @error-color: #ff3333;

    .error{
        font-size: 1.6em;
        color: @error-color;
        margin-top: 4px;
        display: inline-block;
    }
    .label-error{
        color: @error-color;
    }
    .slot-error{
        :deep(.input_error),  :deep(.input){
            border-color: @error-color !important;
            border-width: 2px !important;
            color: @error-color !important;

            &::placeholder{
                color: @error-color !important;
            }
        }

        :deep(.text_error){
            color: @error-color !important;
        }
    }
</style>