<template>
    <ul class="ctn-informations">
        <li style="margin-bottom: 2px">
            <span class="bold" style="color: #383838">Valor: </span>
            <span>{{ production.value }} {{ production_unity }}</span>
        </li>
        <li style="margin-bottom: 2px">
            <span class="bold" style="color: #383838">Mão de obra(Qtd.): </span>
            <span>{{ production.allocated_labor }}</span>
        </li>
        <li style="margin-bottom: 2px">
            <span class="bold" style="color: #383838">Data: </span>
            <span>{{ formatDate(production.date, "DD/MM/YYYY") }}</span>
        </li>
        <li style="margin-bottom: 2px">
            <span class="bold" style="color: #383838">Unidade: </span>
            <span>{{ production_unity }}</span>
        </li>
        <li>
            <span class="bold" style="color: #383838">Acumulado: </span>
            <span>{{ production.accumulated_production }} {{ production_unity }}</span>
        </li> 
    </ul>
</template>

<script>
import { formatDate } from "@/Utils/index.js"

export default {
    props: {
        production: Object,
        production_unity: String
    },
    setup(){
        return { formatDate }
    }
}
</script>

<style lang="less" scoped>
    .ctn-informations{
        font-size: 1.5em;
        margin: 6px 0 12px 0;
        border-bottom: dashed 1px gray;
        padding-bottom: 6px;
        &:last-child{
            border-bottom: none;
            padding-bottom: 0;
        }
        li, span{
            font-size: 1em;
        }
    }
</style>