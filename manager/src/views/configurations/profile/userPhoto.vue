<template>
    <div class="ctn-person-picture">
        <div class="ctn-image">
            <img v-if="photo_file_url" :src="photo_file_url" class="img-tag-profile-picture">
        </div>

        <div class="wrapper-buttons">
            <button class="button-change-photo" v-show="photo_file_url" @click="$emit('delete-image')">Remover foto</button>
            <button class="button-change-photo" @click="$emit('open-modal')">{{ photo_file_url ? "Alterar" : "Adicionar" }} foto</button>
        </div>
    </div>
</template>

<script>
export default {
    emits: ["open-modal", "delete-image"],
    props:{
        photo_file_url: String
    }
}
</script>

<style lang="less" scoped>
    .ctn-person-picture {
        width: 100%;
        height: auto;
    }

    .ctn-image {
        width: 200px;
        min-height: 200px;
        border: 1px dashed #FF7900;
        border-radius: 50%;
        overflow: hidden;
        & > img{
            width: 100%;
        }
    }
    .wrapper-buttons{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
    }
    .button-change-photo {
        text-align: center;
        font-size: 1.7em;
        cursor: pointer;
        color: #FF7900;
        font-weight: bold;
        padding: 5px 10px;
        margin-top: 12px;
        border-radius: 5px;
        border: 1px dashed #FF7900;
        background-color: #fff;
        &:first-child{
            margin-right: 20px;
        }
    }

</style>