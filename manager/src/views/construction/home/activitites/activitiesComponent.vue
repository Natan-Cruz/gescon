<template>
    <div>
        <div class="ctn-filter">
            <div v-if="isLoading" class="skeleton-text" style="width:130px; height: 34px"></div>
            <select v-else v-model="filterDate">
                <option value="today">Hoje</option>
                <option value="yesterday">Ontem</option>
                <option value="last_7_days">Últimos 7 dias</option>
            </select>
        </div>

        <div class="ctn">
            <span class="line-detail" :style="isLoading && 'background-color: #ccc' " ref="line_detail"></span>

            <template v-if="isLoading">
                <div class="item" v-for="n in 3" :key="n">
                    <span class="ball-detail" style="border-color: #ccc !important"></span>
                    <div class="wrapper-item ">
                        <span class="skeleton-text" style="width: 150px; height: 20px;display: block: margin-bottom: 6px"></span>
                        <span class="skeleton-text" style="width: 230px; height: 18px;display: block"></span>
                    </div>
                </div>
            </template>

            <template v-else>
                <div v-for="(item, i) in activitiesGrouped" :key="i">

                    <p class="group-date">{{ item.date }}</p>

                    <div class="item" v-for="activity in item.activities" :key="activity.id">
                        <span class="ball-detail"></span>


                        <div class="wrapper-item">
                            <p class="description">{{ activity.description }}</p>
                            <p class="text" v-if="activity.title"># {{ activity.title }}</p>
                            <router-link v-show="activity.action !== 'DELETE' && resouceName(activity)" :to="routerLink(activity)" class="link">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M17.5 9.917V15.75Q17.5 16.479 16.99 16.99Q16.479 17.5 15.75 17.5H4.25Q3.521 17.5 3.01 16.99Q2.5 16.479 2.5 15.75V4.25Q2.5 3.521 3.01 3.01Q3.521 2.5 4.25 2.5H10.083V4.25H4.25Q4.25 4.25 4.25 4.25Q4.25 4.25 4.25 4.25V15.75Q4.25 15.75 4.25 15.75Q4.25 15.75 4.25 15.75H15.75Q15.75 15.75 15.75 15.75Q15.75 15.75 15.75 15.75V9.917ZM8.104 13.125 6.875 11.896 14.521 4.25H11.833V2.5H17.5V8.167H15.75V5.479Z"/></svg>
                                {{ resouceName(activity) }}
                            </router-link>
                            <span class="text">{{ activity.user_name }} - {{ formatDate(activity.created_at, "DD/MM/YYYY [às] HH:mm") }}</span>

                            <ul v-if="activity.attachments.length" class="list-attachments" :class="{ 'only-image': activity.attachments.length === 1 }">
                                <item-attachment 
                                    v-for="(attachment, i) in activity.attachments" 
                                    :key="i" 
                                    :item="attachment" 
                                    @click="$router.push({ name: 'viewer/viewer', params: { id: attachment.id }, query: { previous: $route.fullPath }})" />
                            </ul>
                        </div>

                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import itemAttachment from "./itemAttachment.vue"

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate } from "@/Utils/index.js"
import dayjs from 'dayjs';

export default { 
    emits: ["refresh-masonry", "event-define-filter-date"],
    components: { itemAttachment },
    props: {
        activities: Array,
        isLoading: Boolean,
        isError: Boolean,
        filter_date: String
    },
    setup(props, {  emit, expose }){
        const $route = useRoute();
        const line_detail = ref(null);
        const filterDate = computed({
            get: () => props.filter_date,
            set: value => emit('event-define-filter-date', value)
        })

        function render(){
            const balls = document.querySelectorAll(".ball-detail")
            if(!balls.length) return;

            const firstBall = balls[0], lastBall = balls[ balls.length - 1]
            const distanceBetweenBalls = lastBall.getBoundingClientRect().y - firstBall.getBoundingClientRect().y
            line_detail.value.style.height = distanceBetweenBalls + "px"
        }

        function routerLink({ resource, resource_id }){
            let name;
            let params = { id: resource_id }
            let query = { previous: $route.fullPath }
            
            switch(resource){
                case "purchased_materials": 
                    name = "registrations/material_orders_form"; 
                    break
                case "occurrences": 
                    name = "construction/form_occurrence"; 
                    break
                case "visits": 
                    name = "registrations/form_visit"; 
                    break
                case "files": 
                    name = "viewer/viewer"; 
                    break
                case "service_check_items": {
                    name = "constuction/service/check_item";
                    const [ id, check_item_id ] = resource_id.split("/") ;
                    params = { id, check_item_id };
                    break;
                }
                case "service_productions": {
                    name = "constuction/service/production_rate";
                    const [ id, rate_id ] = resource_id.split("/") ;
                    params = { id, rate_id };
                    break;
                }
                case "services": {
                    name = "constuction/service/items";
                    break;
                }
                case "cloud": 
                    name = "construction/cloud"; 
                    delete params.id
                    query = { path: resource_id }
                    break
            }
            
            return { name, params, query }
        }

        function resouceName({ resource }){
            let name;
            switch(resource){
                case "purchased_materials": name = "Abrir pedido"; break
                case "occurrences": name = "Abrir ocorrência"; break
                case "visits": name = "Abrir visita"; break
                case "files": name = "Abrir arquivo"; break
                case "cloud": name = "Abrir pasta"; break
                case "services": name = "Abrir serviço"; break
                case "service_check_items": name = "Abrir item"; break
                case "service_productions": name = "Abrir produção"; break
            }

            return name
        }
        const activitiesGrouped = computed(() => {
            if(!props.activities || !props.activities.length) return []
            
            const map = new Map()

            props.activities.forEach( activity => {
                let key;

                if(props.filter_date === "today" || props.filter_date === "yesterday"){
                    key = dayjs(activity.created_at).format("HH:[00 hrs]")
                }
                if(props.filter_date === "last_7_days"){
                    key = dayjs(activity.created_at).format("DD/MM")
                }

                const has = map.get(key)
                if(has){
                    has.push(activity)
                    map.set(key, has)
                }else{
                    map.set(key, [ activity ])
                }
            })

            return Array.from(map).map(([ key, value ]) => {
                return {
                    date: key,
                    activities: value
                }
            })
        })

        onMounted(render)
        expose({ render })


        return {
            line_detail,
            formatDate,
            filterDate,
            activitiesGrouped,
            // methods //
            routerLink, 
            resouceName
        }
    }
}
</script>

<style lang="less" scoped>
    
    .ctn-filter{
        text-align: center;
        font-size: 1.5em;
        border-bottom: dashed 1px gray;
        padding-bottom: 12px;
        select{
            width: auto;
            font-size: 1em;

            padding: 6px;
        }
        option{
            font-size: 1em
        }
    }

    .ctn{
        position: relative;
    }


    .line-detail{
        display:block;
        width: 2px;
        height: 100%;
        background-color: #f70;
        position: absolute;
        left: 5px;
        top: 10px;
    }

    .item{
        width: 100%;
        height: auto;
        margin-bottom: 0px;
        position: relative;
    }
    .wrapper-item{
        margin-left: 20px;
        padding: 10px 10px 10px 0;
    }
    .ball-detail{
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #fff;
        border: solid 1px #f70;
        display: block;
        position: absolute;
        top: 10px;
        left: 0
    }
    .group-date{
        font-size: 1.6em;
        text-align: center;
        color: gray;
        margin-top: 12px;
    }
    .description{
        font-size: 1.6em;
    }
    .text{
        font-size: 1.5em;
        color: #3d3d3d;
    }
    .link{
        white-space: nowrap;
        text-decoration: underline;
        font-size: 1.5em;
        line-height: 1em;
        margin: 4px 0;
        display: block;
        color: #f70;

        display: flex;
        align-content: center;
        column-gap: 4px;

        svg{
            transform: scale(.8);
            fill: #f70;
        }
    }

    .list-attachments{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        grid-template-rows: auto;
        row-gap: 12px;
        column-gap: 12px;

        margin-top: 12px;

        & > :deep(.item-attachment){
            height: 120px;
        }
    }

    .only-image{
        grid-template-columns: 180px;
        grid-template-rows: 180px;

        & > :deep(.item-attachment){
            height: 180px;
        }
    }

    @media screen and (max-width: 700px) {
        .wrapper-item{
            width: calc(100% - 26px);
            margin-left: 26px;
        }
    }
</style>