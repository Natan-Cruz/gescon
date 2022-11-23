<template>
    <div style="height: 100%;">
        <div class="main_content">
            <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchInformationsAboutConstruction"></loading-or-error>    

            <template v-if="state.construction">
                <wrapper-banner :pathBanner="state.construction.banner_file_url" @show-modal-photo="openModalBanner"/>

                <wrapper-informations :construction="state.construction" @show-modal="openModalInformations"/>

                <wrapper-chart-space-used :spaceUsed="state.spaceUsed"/>
            </template>
        </div>

        <modal-banner v-if="state.modal.banner" :constructionId="$route.params.constructionID" @close-modal="closeModalBanner" @set="handleSetAlterationsBanner"></modal-banner>
        <modal-informations v-if="state.modal.informations" :construction="state.construction" @close-modal="closeModalInformations" @set="handleSetAlterationsInformations"></modal-informations>
    </div>
</template>

<script>
import wrapperBanner from "./wrappers/banner.vue"
import wrapperInformations from "./wrappers/informations.vue"
import wrapperChartSpaceUsed from "./wrappers/chartSpaceUsed.vue";

import modalBanner from "./modals/cropBanner.vue"
import modalInformations from "./modals/informations.vue"

import axios from "@/services/api";
import { useRoute } from "vue-router"
import { reactive, watch } from "vue"
import { useStore as useStoreHistory } from "@/store/history"

export default {
    name: 'view-configurations',
    components:{
        wrapperBanner,
        wrapperInformations,
        wrapperChartSpaceUsed,
        // 
        modalBanner,
        modalInformations
    },
    setup(){
        const history = useStoreHistory()
        const $route = useRoute();
        const state = reactive({ isLoading: false, error: "", construction: undefined, spaceUsed: {}, modal: { banner: false, informations: false  } })

        async function fetchInformationsAboutConstruction(){
            state.isLoading = true
            state.error = ""

            try {
                const [ construction, spaceUsed ] = await Promise.all([ 
                    axios.get(`/constructions/${ $route.params.constructionID }/informations`),
                    axios.get(`/constructions/${ $route.params.constructionID }/calc-space-used`)
                ]) 
                state.construction = construction.data
                state.spaceUsed = spaceUsed.data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        fetchInformationsAboutConstruction()

        watch(() => $route.params.constructionID, fetchInformationsAboutConstruction)


        // BANNER
        function openModalBanner(){
            history.push({ name: "modal_banner_construction", fn: closeModalBanner })
            state.modal.banner = true
        }

        function closeModalBanner(){
            history.remove("modal_banner_construction")
            state.modal.banner = false
        }

        function handleSetAlterationsBanner({ banner_file_url }){
            state.construction.banner_file_url = banner_file_url
        }
        // INFORMATION
        function openModalInformations(){
            history.push({ name: "modal_informations_banner", fn: closeModalInformations })
            state.modal.informations = true
        }

        function closeModalInformations(){
            history.remove("modal_informations_banner")
            state.modal.informations = false
        }

        function handleSetAlterationsInformations(informations){
            Object.entries(informations).forEach(([key,value]) => state.construction[key] = value )
        }

        return {
            state,
            // 
            fetchInformationsAboutConstruction,
            openModalBanner,
            closeModalBanner,
            handleSetAlterationsBanner,
            // 
            openModalInformations,
            closeModalInformations,
            handleSetAlterationsInformations
        }
    }
}
</script>

<style lang="less" scoped>
    .main_content{
		width: 100%;
		height: 100%;
        padding: 20px;
        background-color: #fff;
        overflow: hidden auto;
        border-radius: 5px;
        position: relative;
	}
    .main-wrapper{
        margin-bottom: 36px;

        &:last-child{
            margin-bottom: 0;
        }
    }
    :deep(.header){
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
    }
    :deep(.sub-title) {
        font-size: 1.7em;
        margin-bottom:12px;
    }
    :deep(.button){
        width: auto;
        height: auto;
        padding: 6px;
    }
</style>