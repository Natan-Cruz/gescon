<template>
    <div class="content">
        <div class="banner">
            <h1>
                <span :class="{ 'skeleton-text': state.isLoading }">{{ state.welcomeMessage }}, {{ userName }}</span>
            </h1>
            <p>
                <span :class="{ 'skeleton-text': state.isLoading }">Aqui está o que está acontecendo no projeto "{{ state.construction.name }}"</span>
            </p>
        </div>
        <div class="grid">
            <!-- por questoes funcionais do masonry -->
            <div class="grid-sizer"></div>
            
            <card-wrapper class="c1 grid-item grid-item--width2" :url="urls.progress" title="Progresso na obra" @refresh-masonry="refreshMasonry">
                <template v-slot="{ data, isLoading, isShowingMore }">
                    <progress-component 
                        :data="data" 
                        :planned_end_date="state.construction.planned_end_date" 
                        :isLoading="isLoading" 
                        :isShowingMore="isShowingMore" />
                </template>
            </card-wrapper>

            <card-wrapper class="c2 grid-item" style="max-height: 70vh" :url="urlErpActivities" title="Últimas atividades" @refresh-masonry="refreshMasonry">
                <template v-slot="{ data, isLoading }">
                    <activities-component 
                        :activities="data" 
                        :filter_date="state.activitiesFilter" 
                        :isLoading="isLoading" 
                        @event-define-filter-date="state.activitiesFilter = $event"
                        ref="activities" />
                </template>
            </card-wrapper>
        
            <card-wrapper class="c3 grid-item" title="Atalhos" :showMore="false" >
                <shortcuts-component :isLoading="state.isLoading"/>
            </card-wrapper>

            <card-wrapper class="c4 grid-item" :url="urls.weather" title="Clima na obra" @refresh-masonry="refreshMasonry">
                <template v-slot="{ data, isLoading, isShowingMore }">
                    <weather-component :weatherData="data" :isLoading="isLoading" :isShowingMore="isShowingMore" @refresh-masonry="refreshMasonry"/>
                </template>
            </card-wrapper>

            <card-wrapper class="c5 grid-item" :url="urls.visits" title="Últimas visitas" @refresh-masonry="refreshMasonry">
                <template v-slot="{ data, isLoading }">
                    <visits-component :visits="data" :isLoading="isLoading"/>
                </template>
            </card-wrapper>

            <card-wrapper class="c6 grid-item" :url="urls.purchasedMaterials" title="Pedidos a receber" @refresh-masonry="refreshMasonry">
                <template v-slot="{ data, isLoading }">
                    <purchased-materials-component :purchased_materials="data" :isLoading="isLoading" />
                </template>
            </card-wrapper>

            <!-- nao conformidades -->
            <!-- <card-wrapper class="c6 grid-item" :url="urls.unconformitites" title="Não-conformidades" @refresh-masonry="refreshMasonry">
                <template v-slot="{ data, isLoading }">
                    <unconformitites-component :unconformitites="data" :isLoading="isLoading"/>
                </template>
            </card-wrapper> -->


            <card-wrapper class="c7 grid-item" :url="urls.occorrences" title="Últimas ocorrências" @refresh-masonry="refreshMasonry">
                <template v-slot="{ data, isLoading }">
                    <occurrences-component :occurrences="data" :isLoading="isLoading" />
                </template>
            </card-wrapper>
        </div>
    </div>
</template>

<script>
import weatherComponent from "./weatherComponent.vue"
import shortcutsComponent from "./shortcutsComponent.vue"
import progressComponent from "./progressComponent.vue"
import activitiesComponent from "./activitites/activitiesComponent.vue"
import occurrencesComponent from "./occurrencesComponent.vue"
import purchasedMaterialsComponent from "./materialOrders.vue"
// import unconformititesComponent from "./unconformititesComponent.vue"
import visitsComponent from "./visitsComponent.vue"

import cardWrapper from "./cardWrapper.vue"

import { computed, onMounted, reactive, ref, watch } from 'vue'
import axios from "@/services/api"
import { useRoute } from "vue-router"
import { useStore as useStoreUser } from "@/store/user"
import { useStore as useStoreMenuLeft } from "@/store/menuLeft"
import Masonry from "masonry-layout"

export default {
    components: { 
        weatherComponent, 
        shortcutsComponent, 
        progressComponent, 
        activitiesComponent, 
        occurrencesComponent, 
        purchasedMaterialsComponent, 
        // unconformititesComponent, 
        visitsComponent,
        cardWrapper
    },
    setup(){
        const state = reactive({ isLoading: true, errorMsg: "", construction: "", welcomeMessage: "", activitiesFilter: "today" })
        const menuLeft = useStoreMenuLeft()
        const user = useStoreUser()
        const $route = useRoute()
        
        const activities = ref(null)
        const masonry = ref(null)


        const urlErpActivities = computed(() => {
            const constructionId = $route.params.constructionID;
            return `/constructions/${ constructionId }/erp-activities?filter=${ state.activitiesFilter }`
        })
        const urls = computed( () => {
            const constructionId = $route.params.constructionID;
            return {
                purchasedMaterials: `/materials/material-orders?construction_id=${ constructionId }&status=bought`,
                unconformitites: `/services/check-items?type=unconfomitites&construction_id=${ constructionId }`,
                weather: `/constructions/${ constructionId }/occurrences/weather-data`,
                occorrences: `/constructions/${ constructionId }/occurrences?status[]=1&status[]=2`,
                visits: `/registrations/visits?construction_id=${ constructionId }`,
                progress: `/constructions/${ constructionId }/progress`
            }
        })


        watch(() => $route.params.constructionID, initialFetch)
        
        // main function
        async function initialFetch(){
            const hour = new Date().getHours()
            if(hour >= 0 && hour < 12) state.welcomeMessage = "Bom dia";
            if(hour >= 12 && hour < 18) state.welcomeMessage = "Boa tarde"; 
            if(hour >= 18 && hour <= 23) state.welcomeMessage = "Boa noite";

            state.isLoading = true;
            state.errorMsg = "";
            masonry.value.layout();

            try {
                const constructionId = $route.params.constructionID;
                const { data } = await axios.get(`/constructions/${ constructionId }/informations`)
                state.construction = data;
                refreshMasonry()
            } catch (error) {
                state.errorMsg = error
            } finally {
                state.isLoading = false
            }
        }

        function refreshMasonry(){
            setTimeout(() => {
                masonry.value.layout();
                activities.value && activities.value.render()
            }, 300);
        }

        function initMasonry(){
            const grid = document.querySelector(".grid")
            masonry.value = new Masonry(grid, {
                itemSelector: '.grid-item',
                columnWidth: '.grid-sizer',
                percentPosition: true,
                gutter: 15,
                resize: true,
            });
        }

        watch(() => menuLeft.isExpanded, refreshMasonry)
        onMounted(() => {
            initMasonry();
            initialFetch()
        })

        return {
            state,
            userName: user.data.first_name,
            refreshMasonry,
            activities,
            initialFetch,
            // urls
            urlErpActivities,
            urls
        }
    }
}
</script>
<style lang="less" scoped>
    .content{
        height: auto;
        margin: 0 auto;
        position: relative;
    }

    .grid{
        & > * {
            min-height: 80px;
        }
    }
    .grid-sizer{
        width: 32%; 
    }
    .grid-item { 
        width: 32%; 
        min-width: 300px;
        margin-bottom: 15px;
    }
    .grid-item--width2 { 
        width: 65%; 
        min-width: 300px;
    }
  
    .banner{
        width: 100%;
        height: 60px;
        position: relative;
        background-color: #f1f1f1;

        margin: 20px 0;

        h1{
            font-size: 3em;
            line-height: 1em;
            color: #3b3b3b;
            font-weight: normal;

            margin-bottom: 6px;

            span{
                font-size: 1em;
            }
        }
        p{
            font-size: 1.6em;
            color: gray;

            span{
                font-size: 1em;
            }
        }
    }
   
    .c1{
        min-height: 156px;
    }

    @media screen and (max-width: 1300px) and (min-width: 501px){
        .grid-sizer{
            width: 49%;
        }
        .grid-item { 
            width: 49%;
            min-width: initial;

        }
        .grid-item--width2 { 
            width: 100%;
            min-width: initial;
        }
    }
    @media screen and (max-width: 500px){
        .grid-sizer{
            width: 100%;
        }
        .grid-item { 
            width: 100%;
            min-width: 340px; 
        }
        .grid-item--width2 { 
            width: 100%;
            min-width: 340px;
        }

        .banner{
            h1{
                font-size: 2.3em;
            }
            p{
                font-size: 1.5em;
            }
        }
    }
</style>