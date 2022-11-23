<template>
    <profile/>
    <notifications />
    <sort-menu-left />
</template>

<script>
import profile from "./profile/profile.vue";
import notifications from "./notifications/notifications.vue";
import sortMenuLeft from "./sortMenuLeft/sortMenuLeft.vue"

export default {
    name: "configurations",
    components: { profile, notifications, sortMenuLeft }
}
</script>

<style lang="less" scoped>
   
    .wrapper-informations {
        width: 100%;
        max-width: 1000px;
        padding: 20px;
        border-radius: 5px;
        background-color: #fff;
        overflow: hidden;

        margin-bottom: 24px;
    }
    :deep(.subtitle-content) {
        font-size: 2.2em;
        line-height: 1em;
        font-weight: bold;
        margin-bottom: 15px;
    }
    @media screen and (max-width:750px) {
        .wrapper-informations {
            padding: 20px;
        }
    }
</style>