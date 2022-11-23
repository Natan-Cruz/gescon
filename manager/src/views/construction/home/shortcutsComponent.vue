<template>
    <div>
        <router-link :to="{ name: 'construction/form_occurrence', query: { previous: $route.fullPath } }" class="shortcut-link">
            <div class="ctn-image">
                <div v-if="isLoading" class="skeleton-text" style="width: 20px; height: 20px; display: block; margin-right: 10px;"></div>
                <img v-else src="../../../assets/icons/warn.png" alt="">
            </div>
            <p :class="{ 'skeleton-text': isLoading }" >Adicionar Ocorrência</p>
        </router-link>
        <router-link :to="{ name: 'construction/materials/orders' }" class="shortcut-link">
            <div class="ctn-image">
                <div v-if="isLoading" class="skeleton-text" style="width: 20px; height: 20px; display: block; margin-right: 10px;"></div>
                <img v-else src="../../../assets/icons/delivery-box.png" alt="">
            </div>
            <p :class="{ 'skeleton-text': isLoading }" >Receber material</p>
        </router-link>
        <router-link :to="{ name: 'registrations/form_visit', query: { previous: $route.fullPath, construction_id: $route.params.constructionID } }" class="shortcut-link">
            <div class="ctn-image">
                <div v-if="isLoading" class="skeleton-text" style="width: 20px; height: 20px; display: block; margin-right: 10px;"></div>
                <img v-else src="../../../assets/icons/visit-cards.png" alt="">
            </div>
            <p :class="{ 'skeleton-text': isLoading }" >Registrar visitante</p>
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        isLoading: Boolean
    }
}
</script>

<style lang="less" scoped>
     .shortcut-link{
        // text-decoration: non;
        display: flex;
        flex-direction: row;        
        justify-content: flex-start;
        align-items: center;

        border-bottom: dashed 1px gray;
        padding: 6px 0;
        margin-bottom: 6px;
        
        color: #000;

        &:last-child{
            margin-bottom: 0;
            border: none;
        }
        &:hover{
            text-decoration: underline;
        }
        img{
            width: 24px;
            margin-right: 10px;
        }
        p{
            font-size: 1.7em;
        }
    }
</style>