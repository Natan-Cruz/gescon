<template>
    <li class="item" >
        <div class="content" @click="$emit('select-check-item', { service_id: item.service_id, check_item_id: item.id })">
            <p class="name">{{ item.name }}</p>
            <p class="description">{{ item.problem_description }}</p>

            <div class="group_flex" v-if="reinspection_date">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#f51720" style="margin-right: 8px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <span class="name" style="color: #f51720">{{ reinspection_date }}</span>
            </div>
        </div>
        <check-buttons class="buttons" :item="item" @edit-item="handleEditItem"/>
    </li>
</template>

<script>
import checkButtons from "@/components/buttonsCheckItem/buttonCheckItemAxios.vue"
import dayjs from 'dayjs'

export default {
    components: { checkButtons },
    emits: ["select-check-item", "remove-check-item"],
    props: {
        item: Object
    },
    setup(props, { emit }){
        function handleEditItem({ id, checked }){
            if(checked !== false)
                emit("remove-check-item", id)
        }
        const reinspection_date = props.item.reinspection_date ? dayjs(props.item.reinspection_date).format("DD/MM/YY") : ""
        return {
            reinspection_date,
            handleEditItem
        }
    }
}
</script>
<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: "content buttons";
        grid-template-columns: 1fr 50px;
        column-gap: 20px;
        grid-template-rows: auto;

        padding-bottom: 12px;
        margin-bottom: 12px;
        border-bottom: dashed 1px gray;

        &:last-child{
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
    }
    .content{
        grid-area: content;
        align-self: center;

        &:hover{
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .name{
        font-size: 1.5em;
        font-weight: bold;
        margin-bottom: 4px;
    }
    .description{
        font-size: 1.5em;
        color: rgb(63, 63, 63);
    }
    .buttons{
        grid-area: buttons;
        align-self: center;
        position: relative;
    }


    .group_flex{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
</style>