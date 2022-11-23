<template>
    <div class="main-wrapper">
        <div class="header">
            <p class="sub-title bold">Foto principal da obra:</p>

            <button class="button button-primary text-medium" @click="$emit('show-modal-photo')">Editar</button>
        </div>
        <div class="container-banner">
            <img :src="pathBanner">
        </div>
    </div>
</template>

<script>
export default {
    emits: ["show-modal-photo"],
    props:{
        pathBanner: String
    }
}
</script>

<style lang="less" scoped>
    .main-wrapper{
        width: 100%;
        max-width: 500px;
        margin-bottom: 20px ;
        transition: all 100ms;
        position: relative;
    }
    .container-banner{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &>img{
            width: 100%;
        }
    }
</style>