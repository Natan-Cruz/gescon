<template>
    <div class="wrapper">
        <p class="title_2">Clima</p>
        <climate 
            :climate_morning="report.climate_morning"
            :climate_afternoon="report.climate_afternoon"
            :climate_night="report.climate_night"
            :wasClosed="wasClosed"  
            :construction_id="construction_id" 
            :report_id="report.id">
        </climate>

        <hr>
        <p class="title_2">Condições de trabalho</p>
        <conditions 
            :condition_morning="report.condition_morning"
            :condition_afternoon="report.condition_afternoon"
            :condition_night="report.condition_night"
            :wasClosed="wasClosed"  
            :construction_id="construction_id" 
            :report_id="report.id"  >
        </conditions>
        <hr>

        <p class="title_2">Anotações</p>
        <anotations 
            :anotations="report.anotations" 
            :wasClosed="wasClosed" 
            :construction_id="construction_id" 
            :report_id="report.id">
        </anotations>
    </div>
</template>

<script>
import climate from "./climate/climate.vue";
import conditions from './conditions/conditions.vue';
import anotations from "./anotations/anotations.vue"

export default {
    props:{ wasClosed: Boolean, report: Object, construction_id: String },
    components: {
        climate,
        conditions,
        anotations,
    }
}
</script>

<style lang="less" scoped>
    .title_2{
        margin-bottom: 6px;
        margin-top: 16px;
    }
</style>