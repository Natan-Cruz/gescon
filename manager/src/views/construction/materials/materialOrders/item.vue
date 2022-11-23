<template>
    <li class="item">
        <p class="text-medium bold" :title="item.number">#{{ item.number }}</p>
        <p class="text-medium date" :title="item.entity_name">{{ item.entity_name || "-/-" }}</p>
        <p class="text-medium date">Data de entrega: {{ formatDate(item.delivery_date, "DD/MM [-] dddd") || "Não especificada" }}</p>
    </li>
</template>

<script>
import { formatDate } from "@/Utils/index.js"

export default {
    props: { item: Object },
    setup(){
        return { formatDate }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        min-height: 70px;
        height: auto;

        cursor: pointer;
        padding: 10px;

        border-radius: 5px;
        background: #fff;
        border: solid 1px gray;
        position: relative;
        overflow: hidden;

        p{
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: dashed 1px gray;
        }

        p:last-child{
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        &:hover{
            background-color: rgb(243, 243, 243);
        }   
    }

    .date{
        color: rgb(90, 90, 90);
    }
</style>