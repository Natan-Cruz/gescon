<template>
    <div class="wrapper-profile" :class="{ 'not-expanded' : !isExpanded }">
        <div class="content-img">
            <img :src="photo_file_url" alt="">
        </div>
        <div class="ctn-info">
            <p class="bold">{{ first_name }} {{ last_name }} </p>
            <p> {{ title }} </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "wrapper-profile",
    props:{
        photo_file_url: String,
        first_name: String,
        last_name: String,
        title: String,
        isExpanded: Boolean
    }
}
</script>

<style lang="less" scoped>
    .wrapper-profile {
        width: 100%;
        height: auto;
        border-bottom: dashed 1px #dddddd;
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 10px 20px;
    }

    .content-img {
        width: 60px;
        height: 60px;
        overflow: hidden;
        box-shadow: 1px 0px 3px rgba(122, 122, 122, 0.3);
        background: #fff;
        border-radius: 50%;
        border: 2px solid #fff;
        img {
            width: 100%;
        }
    }

    .ctn-info {
        margin-left: 20px;
        display: block;
        p{
            max-width: 130px;
            font-size: 1.7em;
            display: block;
            color: #000;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    
    @media screen and (min-width:1000px) {
        .not-expanded{
            padding: 12px;
            .content-img {
                width: 42px;
                height: 42px;
            }
            .ctn-info{
                display: none;
            }
        }

    }
</style>