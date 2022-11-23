<template>
    <button class="button-component" @click="$emit('click')">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
    </button>
</template>

<script>
export default {
    name: "button-done"
}
</script>

<style lang="less" scoped src="./button.style.less"></style>