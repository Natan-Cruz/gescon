<template>
    <ul class="list">
        <li class="item" v-for="account in accounts" :key="account.id">
            <span class="short-description">{{ account.short_description || "-" }}</span>
            <span class="long-description">{{ account.long_description }}</span>

            <popup-options class="popup-options" v-slot="{ hide }">
                <p class="text-medium" @click="$emit('edit', account); hide()">Editar</p>
                <p class="text-medium" @click="$emit('remove', account.id); hide()">Excluir</p>
            </popup-options>
        </li> 

        <p v-show="!accounts.length" class="without-item">Nenhum item</p>
    </ul>
</template>

<script>
import popupOptions from '@/components/popup-options.vue';

export default {
    components: { popupOptions },
    props: { accounts: Array }
}
</script>

<style lang="less" scoped>
    .list{
        width: 100%;
        height: 100%;
        overflow: hidden auto;
        position: relative;

        padding-bottom: 80px;
    }
    .item{
        width: 100%;
        display: grid;
        grid-template-areas: "short_description long_description popup_options";
        grid-template-columns: 100px 1fr 30px;
        grid-template-rows: auto;
        column-gap: 10px;
        padding: 10px 14px;
        border-bottom: 1px dashed #c2c2c2;
        position: relative;
        span{
            font-size: 1.7em;
            align-self: center;
        }
    }
  
    .short-description{
        grid-area: short_description;
    }
    .long-description{
        grid-area: long_description;
    }
    .popup-options{
        grid-area: popup_options;
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