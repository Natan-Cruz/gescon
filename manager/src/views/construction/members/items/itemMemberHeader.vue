<template>
    <div class="item-account-header">
        <p class="ctn-photo">Foto</p>
        <p class="ctn-name">Nome</p>
        <p class="ctn-email">Email</p>
        <p class="ctn-title">Titulo</p>
        <p class="popup-options"></p>
    </div>
</template>

<script>
export default {
    name: "item-account-header"
}
</script>

<style lang="less" scoepd>
    .item-account-header{
        width: 100%;
        display: grid;
        grid-template-areas: "photo name email title options";
        grid-template-columns: 36px repeat(3, 1fr) 30px;
        grid-template-rows: auto;
        column-gap: 10px;
        margin-bottom: 12px;
        p{
            font-weight: bold;
            font-size: 1.7em;
            align-self: center;
            text-align: center;
        }
    }
    .ctn-photo{
        grid-area: photo;
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
        .item-account-header{
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