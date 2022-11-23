<template>
    <div>
        <ul class="list-occurrences">
            <template v-if="isLoading">
                <li class="item-occurrence" style="border-color: #ccc;" v-for="n in 3" :key="n">
                    <span class="detail-risk" style="background-color: #ccc"> </span>
                    <!--  -->
                    <div class="container-description">
                        <span class="skeleton-text" style="width: 120px; height: 13px; display: block; margin-bottom: 6px;"></span>
                        <span class="skeleton-text" style="width: 120px; height: 13px; display: block; margin-bottom: 6px;"></span>
                        <span class="skeleton-text" style="width: 120px; height: 13px; display: block"></span>
                    </div>
                </li>
            </template>
            <template v-else>
                <li class="item-occurrence" v-for="(item, i) in occurrences.map(formatDates)" :key="i" @click="$router.push({ name: 'construction/form_occurrence', params: { constructionID: $route.params.constructionID, id: item.id }, query: { previous: $route.fullPath }})">
                    <span class="detail-risk" :style="{ backgroundColor: setBackogrundColor(item.severity) }"> </span>
                    <!--  -->
                    <div class="container-description">
                        <p class="text-15 bold title"> {{ item.title }} </p>
                        <p class="text-15 bold scope"> {{ item.scope === "internal" ? "Interno" : "Externo" }} </p>
                        <p class="text-15 description"> {{ item.description }} </p>
                    </div>
                    <!-- Quando foi gerado -->
                    <span class="text-15" style="white-space: nowrap"> {{ item.created_at }} </span>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
    props:{
        occurrences: {
            type: Array,
            required: false,
            default: () => []
        },
        isLoading: Boolean
    },
    setup(){
        function setBackogrundColor(severity){
            let color;
            switch(severity){
                // Muito baixo
                case 1: color = "#00ac46"; break
                // Baixo
                case 2: color = "#fdc500"; break
                // Moderado
                case 3: color = "#fd8c00"; break
                // Alto
                case 4: color = "#dc0000"; break
                // Muito alto
                case 5: color = "#780000"; break
                // padrao
                default: color = "#808080"; 
            }
            return color
        }

        function formatDates(occurrence){
            return {
                ...occurrence,
                created_at: dayjs(occurrence.created_at).format("DD/MM/YY [às] hh:mm")
            }
        }

        return {
            setBackogrundColor,
            formatDates
        }
    }
}
</script>

<style lang="less" scoped>
    .item-occurrence {
        width: 100%;
        height: 70px;

        display:flex;
        align-items: center;
        justify-content: space-between;

        border-radius: 5px;
        background: #fff;
        border: solid 1px gray;

        cursor: pointer;
        position: relative;
        overflow: hidden;

        margin-bottom: 12px;
        padding-right: 10px;
    }
    .detail-risk{
        width: 12px;
        height: 100%;
        border-radius: 5px;
        display: block;
        margin-right: 6px;
    }

    .container-description{
        width: calc(100% - 18px);
        height: 100%;
        padding: 10px 10px 10px 0;
        overflow: hidden;
    }
    
    .text-15{
        font-size: 1.5em;
        line-height: 1em;
		cursor: default;
    }

    @scope-color: rgb(112, 112, 112);
    .scope{
        color: @scope-color;
        position: relative;
        padding-left: 10px;
        margin: 3px 0;
        &::before{
            content:"";
            display: block;
            width: 6px;
            height: 6px;
            background-color: @scope-color;
            border-radius: 50%;
            position: absolute;
            top: 3px;
            left: 0;
            z-index: 1;
        }
    }
</style>