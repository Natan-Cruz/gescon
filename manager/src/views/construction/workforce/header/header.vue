<template>
    <div class="header">
        <button class="button-today" @click="$emit('set-today')">Hoje</button>
       
        <filter-by-date 
            :frequency="frequency" 
            :start_date="start_date" 
            :end_date="end_date"
            @set-dates="$emit('set-dates', $event)" />
    </div>
</template>

<script>
import filterByDate from "./filterByDateComponent.vue"
export default {
    components: { filterByDate },
    props: {
        frequency: String,
        start_date: String,
        end_date: String
    },
    setup(){
        function selectToday(){}

        return {
            selectToday
        }
    }
}
</script>

<style lang="less" scoped>
     .header{
        width: 100%;
        height: 60px;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        column-gap: 20px;
        
        border-bottom: #dadce0 1px solid;
        padding: 0 20px;
    }

    .button-today{
        font-size: 1.7em;
        border: solid 1px gray;
        border-radius: 3px;
        padding: 6px 8px;
        background-color: #fff;
        cursor: pointer;

        &:hover{
            background-color: rgba(238, 238, 238, 0.8);
        }
    }
</style>