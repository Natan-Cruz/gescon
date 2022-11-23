<template>
    <li class="item">
        <div class="name">
            <span class="bold">{{ visit.name }}</span>
            <span v-if="visit.company" class="date" style="margin-left: 6px">{{ visit.company }}</span>
        </div>
        <p class="date">{{ formatDate(visit.date) }}</p>
    </li>
</template>

<script>
import { formatDate } from "@/Utils/index.js"
export default {
    props: { visit: Object },
    setup(){
        return { formatDate }
    }
}
</script>

<style lang="less" scoped>
    .item{
        border-bottom: solid 1px #c1c1c1;
        padding: 20px;
        cursor: pointer;

        &:hover{
            background-color: rgb(243, 243, 243);
        }
    }

    .name{
        font-size: 1.6em;

        margin-bottom: 6px;

        span{
            font-size: 1em;
        }
    }
    .date{
        font-size: 1.5em;
        color: gray;
    }
</style>