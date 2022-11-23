<template>
    <li class="item">
        <div class="content">
            <p class="name bold">{{ item.name }}</p>
            <see-more-component class="description" style="font-size: 1.5em">{{ item.check_method }}</see-more-component>
            <p class="description">{{ item.problem_description }}</p>
        </div>
        <div class="buttons">
            <check-buttons :item="item" @edit-item="$emit('edit-item', $event)"></check-buttons>
            <p :style="`color: ${ styleColor }`">{{ formatDate(item.checked_at) }}</p>
            <p>{{ item.user_name }}</p>
        </div>
        <div class="reinspection-date" v-if="item.reinspection_date && item.checked === false">
            <p class="text bold" style="color: #f51720">Data de reinspeção</p>
            <div class="display_flex">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#f51720" style="margin-right: 8px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <span>{{ formatDate(item.reinspection_date) }}</span>
            </div>
        </div>

        <div class="attachments">
            <slot />
        </div>
    </li>
</template>

<script>
import dayjs from 'dayjs'
import checkButtons from "@/components/buttonsCheckItem/buttonCheckItemAxios.vue"
import seeMoreComponent from "@/components/seeMoreComponent.vue"

export default {
    components: { checkButtons, seeMoreComponent },
    props: {
        item: Object
    },
    setup(props){
        const styleColor = (() => {
            if(props.item.checked === false)
                return '#F51720'

            if(props.item.checked === true && !props.item.reinspected_at)
                return '#287928'

            if(props.item.checked === true && props.item.reinspected_at)
                return "#FFA500"

            return 'gray'
        })()

        return {
            styleColor,
            formatDate: date => date ? dayjs(date).format("DD/MM/YY") : ""
        }
    }
}
</script>
<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: "content reinspection_date buttons" "content reinspection_date buttons" "attachments attachments attachments";
        grid-template-columns: 1fr auto 63px;
        column-gap: 40px;
        grid-template-rows: auto auto;
        padding: 10px 20px 10px 60px;

        border-bottom: solid 1px gray;
    }
    .content{
        grid-area: content;
        align-self: center;
        margin-bottom: 6px;

        p{
            font-size: 1.5em;
            margin-bottom: 4px;
        }
    }
    .description{
        color: rgb(63, 63, 63);
        font-size: 1.5em;
        margin-bottom: 4px;
    }
    
    .buttons{
        grid-area: buttons;
        align-self: center;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-self: flex-start;

        p{
            font-size: 1.5em;
            font-weight: bold;
        }
    }
    .reinspection-date{
        grid-area: reinspection_date;
        align-self: center;
        span{
            color: #f51720;
            font-size: 1.5em;
            font-weight: bold;
        }
    }
    .attachments{
        grid-area: attachments
    }
    .display_flex{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .text{
        font-size: 1.5em;
    }

    @media screen and (max-width: 700px) {
        .item{
            width: 100%;
            grid-template-areas: "content buttons" "reinspection_date buttons" "attachments attachments";
            grid-template-columns: 1fr 63px;
            grid-template-rows: auto auto;
            padding: 10px 20px 10px 20px;
            column-gap: 10px;

            border-bottom: solid 1px gray;
        }
    }  
</style>