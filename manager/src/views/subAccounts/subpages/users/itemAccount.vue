<template>
    <li class="item-account">
        <div class="ctn-photo">
            <img :src="account.photo_file_url" >
        </div>
        <p class="ctn-name">{{ account.first_name }} {{ account.last_name }}</p>
        <p class="ctn-email"> {{ account.email }} </p>
        <p class="ctn-title"> {{ account.title }} </p>
    </li>
</template>

<script>
export default {
    name: "item-account",
    props: {
        account: {
            type: Object
        }
    }
}
</script>

<style lang="less" scoped>
    .item-account{
        width: 100%;
        display: grid;
        grid-template-areas: "photo name email title";
        grid-template-columns: 36px repeat(3, 1fr);
        grid-template-rows: auto;
        column-gap: 10px;
        padding: 20px 0;
        border-bottom: 1px dashed #c2c2c2;
        cursor: pointer;
        p{
            font-size: 1.7em;
            align-self: center;
            text-align: center;
        }
    }
    .ctn-photo{
        grid-area: photo;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        background-color: rgb(228, 228, 228);
        img{
            width: 100%;
        }
    }
    .ctn-name{
        grid-area: name;
    }
    .ctn-email{
        grid-area: email;
    }
    .ctn-title{
        grid-area: title;
    }
    
    @media screen and (max-width: 1000px) {
        .item-account{
            grid-template-areas: "photo name";
            grid-template-columns: 36px 1fr;
            column-gap: 22px;
            p{
                text-align: left;
            }
        }
        .ctn-email, .ctn-title{
            display: none;
        }
    }
</style>