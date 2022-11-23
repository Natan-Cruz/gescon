<template>
    <ul class="list">    
        <template v-if="isLoading">
            <li class="item" style="border-color: #ccc;" v-for="n in 3" :key="n">
                <div>
                    <span class="skeleton-text" style="width: 120px; height: 15px; display: block; margin-bottom: 6px"></span>
                    <span class="skeleton-text" style="width: 120px; height: 15px; display: block; margin-bottom: 6px"></span>
                </div>
                <span class="skeleton-text" style="width: 83px; height: 15px"></span>
            </li>
        </template>
        <template v-else>
            <li class="item" v-for="( item, i ) in purchased_materials" :key="i" @click="$router.push({ name: 'construction/purchased_materials/check', params: { id: item.id }, query:{ previous: $route.fullPath }})">
                <div>
                    <p class="text-medium bold" style="margin-bottom: 6px">{{ item.name || '#' }}</p>
                    <p class="text-medium">{{ item.entity_name || "-" }}</p>
                </div>
                <p class="text-medium date">{{ formatDate(item.delivery_forecast, "DD/MM [-] ddd") }}</p>
            </li>
        </template>
    </ul>
</template>

<script>
import { formatDate } from "@/Utils/index.js"

export default {
    props: {
        purchased_materials: Array,
        isLoading: Boolean
    },
    setup(){
        return { formatDate }
    }
}
</script>

<style lang="less" scoped>
    .list{
        width: 100%;
        height: 100%;
    }

    .padding{
        padding: 20px;
    }

    .item{
        width: 100%;
        height: auto;
        min-height: 70px;

        display:flex;
        align-items: center;
        justify-content: space-between;

        border: solid 1px rgb(189, 189, 189);
        border-radius: 5px;

        background: #fff;
        padding: 12px;
        position: relative;
        overflow: hidden;
        transition: height 230ms;
        
        color: rgb(39, 39, 39);

        margin-bottom: 12px;
        padding: 10px;

        cursor: pointer;

        &:last-child{
            margin-bottom: 0;
        }

        &:hover{
            background-color: rgb(243, 243, 243);
        }   
    }

    .date{
        color: rgb(90, 90, 90);
        white-space: nowrap;
    }

    @media screen and (max-width: 500px) {
        .padding{
            padding: 10px;
        }
    }
</style>