<template>
    <div :class=" position === 'absolute' ? 'container-spinner-loading': ''" :style="{ 'height': ctn_height, 'top': top}" v-if="loading" >
        <span class="spinner-loading" :style="{ 'position': position ,'width': width, 'height': height }"></span>
    </div>
</template>

<script>
export default {
    name:'spinner-loading',
    props: {
        loading: Boolean,
        width:{
            type:String,
            required: false,
            default: () => "40px"
        },
        height:{
            type: String,
            required: false,
            default: () => "40px"
        },
        ctn_height: {
            type: String,
            required: false,
            default: () => "50px"
        },
        position:{
            type: String,
            required: false,
            default: () => "absolute"
        },
        top: {
            type: String,
            required: false
        }
    }
}
</script>

<style lang="less" scoped>
    .container-spinner-loading{
        width:100%;
        height:50px;
        position: absolute;
    }
    .spinner-loading {
        border: solid 4px transparent;
        border-bottom: solid 4px #FF7900;
        border-radius: 50%;
        // position: absolute;
        top: calc(50% - 20px);
        left: calc(50% - 20px);
        transform: rotate(0deg);
        animation: animation-reload 1250ms infinite;
        display: block;
    }

    @keyframes animation-reload {
        to {
            transform: rotate(0deg);
        }
        from {
            transform: rotate(1080deg);
        }
    }
</style>