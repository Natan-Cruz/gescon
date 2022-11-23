<template>
    <li class="item-member">
        <div class="ctn-photo">
            <img :src="member.photo_file_url" >
        </div>
        <p class="ctn-name">{{ member.first_name }} {{ member.last_name }}</p>
        <p class="ctn-email"> {{ member.email }} </p>
        <p class="ctn-title"> {{ member.title }} </p>
        <popup-options class="popup-options" v-slot="{ hide }">
            <p class="text-medium" @click="$emit('edit'); hide()">Editar</p>
            <p class="text-medium" @click="$emit('remove'); hide()">Excluir</p>
        </popup-options>
    </li>
</template>

<script>
import popupOptions from '@/components/popup-options.vue';

export default {
    components: { popupOptions },
    props: {
        member: Object
    }
}
</script>

<style lang="less" scoped>
    .item-member{
        width: 100%;
        display: grid;
        grid-template-areas: "photo name email title options";
        grid-template-columns: 36px repeat(3, 1fr) 30px;
        grid-template-rows: auto;
        column-gap: 10px;
        padding: 20px 0;
        border-bottom: 1px dashed #c2c2c2;
        position: relative;
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
        .item-member{
            grid-template-areas: "photo name options";
            grid-template-columns: 36px 1fr 30px;
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