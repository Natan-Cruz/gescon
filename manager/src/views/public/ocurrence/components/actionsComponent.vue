<template>
    <button v-show="showBtnInProgress" class="button-action"  @click="$emit('change-status', STATUS_IN_PROGRESS)">Marcar como "Em progresso"</button>
    <button v-show="showBtnCompleteOccurrence" class="button-action" @click="$emit('change-status', STATUS_COMPLETED_BY_PROVIDER)">Finalizar ocorrência</button>
</template>

<script>
import { computed } from '@vue/runtime-core';
export default {
    emits: [ "change-status", "generate-pdf"],
    props: { status: Array },
    setup(props){
        const STATUS_IN_PROGRESS = 5
        const STATUS_COMPLETED_BY_PROVIDER = 6;

        const showBtnInProgress = computed(() => {
            return props.status.findIndex( status => status.status_code === STATUS_IN_PROGRESS) === -1 
        })
        const showBtnCompleteOccurrence = computed(() => {
            return props.status.findIndex( status => status.status_code === STATUS_COMPLETED_BY_PROVIDER) === -1 
        })

        return {
            // constants
            STATUS_IN_PROGRESS,
            STATUS_COMPLETED_BY_PROVIDER,
            // computed
            showBtnInProgress,
            showBtnCompleteOccurrence
        }
    }
}
</script>

<style lang="less" scoped>
    .button-action{
        width: auto;
        height: auto;
        background-color: #189AB4;
        border: none;
        border-radius: 5px;
        padding: 10px;
        font-size: 1.8em;;
        font-weight: bold;
        color: #fff;
        margin-bottom: 20px;
        display: block;
        cursor: pointer;
        transition: 100ms;
        &:last-child{
            margin-bottom: 0;
        }

        &:active{
            transform: scale(.8);
        }
    }
</style>