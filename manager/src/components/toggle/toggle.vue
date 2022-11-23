<template>
    <label class="container" >
        <span class="label-input">{{ label }}</span>
        <input
            v-bind="$attrs"
            class="input"
            type="checkbox"
            :checked="modelValue || value"
            @change="handleChange"
        />
        <span class="switch" :style="style"></span>
    </label>
</template>

<script>
export default {
    name: "toggle",
    inheritAttrs: false,
    emits: ["toggle", "update:modelValue"],
    props: {
        label: {
            type: String,
            required: true,
        },
        modelValue: {
            type: Boolean,
            required: false,
        },
        value: {
            type: Boolean,
            required: false,
        },
        height: {
            type: Number,
            required: false,
            default: () => 50
        }
    },
    setup(props, { emit }){
        function handleChange(evt){
            emit('update:modelValue', evt.target.checked)
            emit('toggle', evt.target.checked)
        }

        const style = `--switch-container-width: ${props.height}px;`

        return { handleChange, style }
    }
}
</script>

<style lang="less" scoped>
    .container {
        // width: 50px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .label-input {
        margin-right: 12px;
        white-space: nowrap;
        font-weight: bold;
        font-size: 1.7em;
        display: block;
        color: #383838;
    }
    .input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
   .switch {
        --switch-container-width: 50px;
        --switch-size: calc(var(--switch-container-width) / 2);
        width: 50px;
        /* Vertically center the inner circle */
        display: flex;
        align-items: center;
        position: relative;
        height: var(--switch-size);
        flex-basis: var(--switch-container-width);
        /* Make the container element rounded */
        border-radius: var(--switch-size);
        background-color: rgb(255, 191, 136);
        transition: background-color 0.25s ease-in-out;
    }

    .switch::before {
        content: "";
        position: absolute;
        /* Move a little bit the inner circle to the right */
        left: 1px;
        height: calc(var(--switch-size) - 4px);
        width: calc(var(--switch-size) - 4px);
        /* Make the inner circle fully rounded */
        border-radius: 9999px;
        transition: transform 0.375s ease-in-out;
        background-color: white;
    }
    .input:checked + .switch {
        /* Teal background */
        background-color: #f70;
    }

    .input:checked + .switch::before {
        border-color: #f70;
        /* Move the inner circle to the right */
        transform: translateX(
            calc(var(--switch-container-width) - var(--switch-size))
        );
    }
</style>