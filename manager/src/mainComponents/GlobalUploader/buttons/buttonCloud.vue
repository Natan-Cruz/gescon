<template>
    <div class="upload-button no_highlights" @click="openPopup">
        <svg class="icon-cloud" xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95A5.469 5.469 0 0112 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11A2.98 2.98 0 0122 15c0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z"/>
        </svg>

        <div class="icon-warning" v-show="hasError">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><circle cx="12" cy="19" r="2"/><path d="M10 3h4v12h-4z"/></svg>
        </div>
        
        <div class="wrapper-loading" v-show="wrapperLoadingIsRunning">
            <span class="bar-wrapper-loading"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: "button-icon-cloud",
    props: {
        wrapperLoadingIsRunning: {
            type: Boolean
        },
        hasError: {
            type: Boolean
        } 
    },
    methods: {
        openPopup(){
            this.$emit("open-popup")
        }
    }
}
</script>

<style lang="less" scoped>
    .upload-button{
        width: 50px;
        height: 47px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 5px;
        pointer-events: all;
        padding: 0 8px;
        cursor: pointer;
        transition: 120ms;
        position: relative;

        // 
        &>p{
            font-size: 1.5em;
        }

        &:active{
            transform: scale(.8);
        }
    }

    .wrapper-loading{
        width: 100%;
        height: 4px;
        background-color: #ebebeb;
        margin-top: 6px;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
    }

    .bar-wrapper-loading{
        width: 14px;
        height: 100%;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        animation: animation 1s infinite;
        background-color: #ff7700;
    }

    @keyframes animation {
        from{
            transform: translateX(-14px);
        }
        to{
            transform: translateX(300%);
        }
    }
    .icon-warning{
        pointer-events: none;
        &::before{
            content: "";
            width: 14px;
            height: 24px;
            background-color: #e6e6e6;
            display: block;
            position: absolute;
            left: 5px;
            right: 0;
            z-index: 2;

            border-radius: 2px;
        }
        position: absolute;
        top: 20px;
        right: 23px;
        z-index: 1;

        & > svg{
            fill: red;
            width: 24px;

            position: absolute;
            top: 0;
            left: 0;
            z-index: 3;
        }
    }

</style>