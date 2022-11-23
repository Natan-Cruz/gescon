<template>
    <button class="button-refresh">
        <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
    </button>
</template>

<script>
export default {
    name: "button-refresh"
}
</script>

<style lang="less" scoped>
    .button-refresh{
        width: 30px;
		height: 30px;
        border: none;
        background-color: #fff;
        cursor: pointer;
        transition: 120ms;
        border-radius: 50%;
        &:active{
            transform: scale(.8);
        }
        &:hover{
            background-color: #e6e6e6;
        }

        &>svg{
            width: 24px;
            height: 24px;
        }
    }
</style>