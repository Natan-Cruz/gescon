<template>
    <ul>
        <template v-if="isLoading">
            <li class="item" style="border-color: #ccc;" v-for="n in 3" :key="n">
                <div class="container-description">
                    <span class="skeleton-text" style="width: 120px; height: 15px; display: block; margin-bottom: 6px"></span>
                    <span class="skeleton-text" style="width: 120px; height: 15px; display: block; margin-bottom: 6px"></span>
                    <span class="skeleton-text" style="width: 120px; height: 15px; display: block"></span>
                </div>
            </li>
        </template>
        <template v-else>
            <li class="item" v-for="(visit, i) in visits" :key="i" @click="$router.push({ name: 'registrations/form_visit', params: { id: visit.id }, query: { previous: $route.fullPath }})">
                <p class="bold" style="font-size: 1.7em">{{ visit.name }}</p>
                <p>{{ visit.reasons }}</p>
                <p>{{ formatDate(visit.date) }}</p>
            </li>
        </template>
    </ul>
</template>

<script>
import dayjs from 'dayjs'
export default {
    props: {
        visits: Array,
        isLoading: Boolean
    },
    setup(){
        return {
            formatDate: date => date ? dayjs(date).format("DD/MM/YYYY") : ""
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        padding: 6px;

        border-radius: 5px;
        border: solid 1px rgb(189, 189, 189);

        margin-bottom: 12px;
        cursor: pointer;

        p{
            font-size: 1.6em;
            color: #272727;
        }
    }
</style>