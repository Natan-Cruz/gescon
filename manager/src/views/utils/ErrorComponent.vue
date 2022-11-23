<template>
    <div class="error-page-component">
        <img class="error-image" src="../../assets/icons/dizzy-robot.png" alt="Imagem de robo danificado">
        <p class="bold text-medium">Ops, alguma coisa errada!</p>
        <p class="text-medium" style="margin-top: 6px">Por favor, tente recarregar a pagina</p>
        <button class="button button-primary text-medium" @click="refreshPage">Atualizar pagina</button>
    </div>
</template>

<script>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
    name: "error-component",
    setup(){
        const $route = useRoute();
        
        function refreshPage(){
            const fullPath = $route.query.fullPath ? $route.query.fullPath : "/main/constructions/active"
            window.location.assign(fullPath)
        }

        onMounted(refreshPage)

        return {
            refreshPage
        }
    }
}
</script>

<style lang="less" scoped>
    .error-page-component{
        width: 100vw;
        height: 100vh;

        display: flex;
        justify-content: center;
        align-items: center;

        flex-direction: column;
    }
    .error-image{
        margin-bottom: 24px;
    }
    .button{
        max-width: 200px;
        height: 36px;
        margin-top: 14px;
    }
</style>
