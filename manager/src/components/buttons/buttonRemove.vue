<template>
    <button class="button-component" @click="$emit('click')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14.258" height="14.258" viewBox="0 0 14.258 14.258">
            <path id="Icon_material-close" data-name="Icon material-close" d="M21.758,8.936,20.322,7.5l-5.693,5.693L8.936,7.5,7.5,8.936l5.693,5.693L7.5,20.322l1.436,1.436,5.693-5.693,5.693,5.693,1.436-1.436-5.693-5.693Z" transform="translate(-7.5 -7.5)"/>
        </svg>
    </button>
</template>

<script>
export default {
    name: "button-remove"
}
</script>

<style lang="less" scoped src="./button.style.less"></style>