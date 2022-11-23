<template>
    <div class="block-info">
        <div class="row-inputs">
            <slot :disabled="disabled" />
        </div>
        <!--  -->
        <button v-if="disabled" class="btn button_main" @click="disableToggle">Editar</button>
        <!--  -->
        <div v-else>
            <button class="btn button_second" @click="disableToggle">Cancelar</button>
            <button class="btn button_main" @click="$emit('submit'); disableToggle()">Salvar</button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup(){
        const disabled = ref(true)

        function disableToggle(){
            disabled.value = !disabled.value;
        }

        return {
            disabled,
            disableToggle
        }
    }
}
</script>

<style lang="less" scoped>
    @color: #f70;

    .block-info{
        margin-bottom: 12px
    }

    .btn{
        text-align: center;
        font-weight: bold;
        font-size: 1.7em;
        cursor: pointer;

        color: @color;
        border-radius: 5px;
        background-color: #fff;
        margin: 12px 0;
        padding: 5px 10px;

        &:disabled {
            opacity: 0.7;
        }
    }
    
    .button_main{
        border-radius: 5px;
        border: 1px dashed @color;
    }

    .button_second{
        margin-right: 10px;
        border: none;
    }
</style>