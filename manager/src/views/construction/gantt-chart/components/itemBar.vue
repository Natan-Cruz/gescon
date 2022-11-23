<template>
    <div class="wrapper-bar"  :style="item.data.isShow !== false ? 'visibility: visible;' : 'visibility: hidden;' ">
        <div class="content-bar" @click="$emit('select-service', item.data.id)">
            <div class="item-bar" :style="{ width: barMeasures.width + 'px', left: barMeasures.left + 'px', backgroundColor: item.data.backgroundColor }"></div>
        </div>

        <template v-if="item.data.isOpen">
            <div>
                <item-bar 
                    v-for="service in item.children" :key="service.data.id" 
                    :item="service"
                    :chart_start_date="chart_start_date"
                    :chart_end_date="chart_end_date"
                    :chart_collumn_width="chart_collumn_width"
                    :chart_frequency="chart_frequency"
                    @select-service="$emit('select-service', $event)" />
            </div>
        </template>
    </div>
</template>

<script>
import { computed } from 'vue';
import { getMeasures } from "../utils"

export default {
    name: "item-bar",
    emits: ["select-service"],
    props: { 
        item: Object, 
        chart_start_date: String,
        chart_end_date: String,
        chart_collumn_width: Number,
        chart_frequency: String
    },
    setup(props){
        const barMeasures = computed(() => {
            return getMeasures(
                props.chart_start_date, 
                props.chart_end_date, 
                props.chart_collumn_width,
                props.chart_frequency,
                props.item.data.start_date, 
                props.item.data.end_date)        
        })

        return {
            barMeasures
        }

    }
}
</script>

<style lang="less" scoped>
    .wrapper-bar{
        width: 100%;
    }
    .content-bar{
        width: 100%;
        height: 30px;
        padding: 10px 0;

        position: relative;
    }
    .item-bar{
        height: 20px;

        background-color: #f70;
        border-radius: 5px;

        position: absolute;

        z-index: 35;
        // transition: 230ms;
    }
    .name{
        font-size: 1.5em;
    }
</style>