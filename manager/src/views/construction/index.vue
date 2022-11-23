<template>
    <router-view v-slot="{ Component }">
        <transition>
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<script>

export default {
    name:"construction"
}
</script>

<style lang="less">
    .main{
        width: 100%;
        height: 100%;
        // overflow: hidden auto;
    }
</style>
