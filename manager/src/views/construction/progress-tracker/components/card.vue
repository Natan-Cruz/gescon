<template>
    <div class="card" >
        <div v-show="on_blur" class="blur-background">
            <p>Sem dados</p>
        </div>
        <div class="display_flex" :class="{ 'on-blur': on_blur }">
            <p class="title">{{ title }}</p>
            <slot name="toggle" />
        </div>
        <div :class="{ 'on-blur': on_blur }">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: { title: String, on_blur: Boolean }
}
</script>

<style lang="less" scoped>
    .card{
        width: 100%;
        height: 470px;
        border-radius: 5px;
        background-color: #fff;
        padding: 20px;
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
    }
    .display_flex{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 0 10px 0;
        margin-bottom: 10px;
        border-bottom: solid 1px gray;

        flex-wrap: wrap;
    }
    .title{
        font-size: 1.7em;
        line-height: 1em;
        font-weight: bold;
        white-space: nowrap;
        span {
            font-size: 1em;
        }
    }

    .blur-background{
        background-color: rgba(0, 0, 0, .45);
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        p{
            font-size: 2.2em;
            color: #fff;
            font-weight: bold;
        }
    }
    .on-blur{
        filter: blur(3px);
    }
</style>