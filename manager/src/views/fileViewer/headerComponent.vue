<template>
    <div class="header-file-viewer">
        <!-- arrow back -->
        <button class="button-back" @click="$emit('event-back')" >
            <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
        </button>

        <div class="title" :class="{ 'skeleton': !fileName }">
            <p>{{ fileName }}</p>
        </div>

        <button class="icon-download-file no_highlights" title="Fazer download" 
            @click.prevent="handleDownloadItem" :disabled="isLoading">

            <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36" v-show="!isLoading">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4l-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z"/>
            </svg>

            <spinner-loading :loading="isLoading" position="relative" width="24px" height="24px"></spinner-loading>
        </button>
        
        <!-- MOBILE < 1000px AND DESKTOP >= 1000px   -->
        <!-- exibido apenas em mobile -->
        <popup-options class="popup-buttons" v-slot="slotProps">
            <router-link :to="{ name: 'viewer/viewer', params: { fileID: $route.params.fileID }}"  @click="slotProps.hide()" class="button-header" :class="{ 'btn-selected': viewerIsDisplayed }">
                Vizualizar
            </router-link>
            <router-link :to="{ name: 'viewer/details', params: { fileID: $route.params.fileID }}" @click="slotProps.hide()" class="button-header" :class="{ 'btn-selected': !viewerIsDisplayed }">
                Detalhes
            </router-link>
        </popup-options>
        <!-- exibido apenas em desktop -->
        <div class="wrapper-buttons">
            <router-link :to="{ name: 'viewer/viewer', params: { fileID: $route.params.fileID }, query: { previous: $route.query.previous }}" class="button-header"  :class="{ 'btn-selected': viewerIsDisplayed }">
                Vizualizar
            </router-link>
            <router-link :to="{ name: 'viewer/details', params: { fileID: $route.params.fileID }, query: { previous: $route.query.previous }}" class="button-header"  :class="{ 'btn-selected': !viewerIsDisplayed }">
                Detalhes
            </router-link>
        </div>
    </div>
</template>

<script>
import popupOptions from "@/components/popup-options.vue";
import { computed, ref } from 'vue';
import { useRoute } from "vue-router"
import { saveAs } from 'file-saver';

export default {
    emits: ["event-back"],
    components: { popupOptions },
    props: {
        fileName: String,
        fileId: String
    },
    setup(props){
        const isLoading = ref(false);
        const $route = useRoute()

        const viewerIsDisplayed = computed(() => {
            const lastPath = $route.path.split("/").pop();
            return (lastPath !== "details") ? true : false
        })

        async function handleDownloadItem(){
            saveAs(`https://gescon-tec.herokuapp.com/erp/files/${ props.fileId }`, props.fileName);
		}

        return {
            isLoading,
            handleDownloadItem,
            viewerIsDisplayed
        }
    }
}
</script>

<style lang="less" scoped>
    .header-file-viewer{
        width: 100%;
        height: 60px;
        
        padding: 0 10px;
        
        display: grid;
        grid-template-areas: "btnBack title btnDownload wrapperButtons";
        grid-template-columns: 30px 1fr 30px 260px;
        column-gap: 10px;
        grid-template-rows: 100%;

        background-color: #fff;
        border-bottom: solid 1px rgb(179, 179, 179);
        position: relative;

        &::after{
            content: "";
            display: block;
            
            width: 100%;
            height: 1px;


            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
        }
    }

    .button-back{
        grid-area: btnBack;
        // Herda medidas de header-grid
		width: 30px;
		height: 30px;
        border: none;
        background-color: #fff;
        align-self: center;
        transition: 150ms;
        &:active{
            transform: scale(.8);
        }
        &>svg{
            width: 30px;
            height: 30px;
        }
	}

    .title{
        grid-area: title;
        align-self: center;
        padding-left: 12px;
        overflow: hidden;

        p{
            white-space: nowrap;
            font-size: 2em;
            font-weight: bold;
        }
    }

    .icon-download-file{
        grid-area: btnDownload;
        background-color: #fff;
        border: none;
        width: 30px;
        height: 30px;
        align-self: center;
        cursor: pointer;
        transition: 150ms;
        &:active{
            transform: scale(.8);
        }
        svg{
            width: 100%;
            height: 100%;
        }
    }

    .btn-viewer{
        grid-area: btnMessages;
        align-self: center;
    }

    .btn-details{
        grid-area: btnDetails;
        align-self: center;
    }
    .wrapper-buttons{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .popup-buttons{
        display: none;
    }

    .button-header{
        width: 100%;
        height: 32px;
        
        font-size: 1.7em;
        color: #535353;
        background-color: transparent;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        padding-top: 5px;
        text-align: center;

        &:active{
            transform: scale(.85);
        }
    }
    .btn-selected{
        color: #FF7900;
        background-color: #ffd9b8;
        font-weight: bold;
    }

    @media screen and (max-width: 1000px) {
        .header-file-viewer{
            grid-template-columns: 30px 1fr 30px 30px;
            grid-template-areas: "btnBack title btnDownload popupButtons";
        }
        .wrapper-buttons{
            display: none;
        }
        .popup-buttons{
            grid-area: popupButtons;
            display: block;
            align-self: center;
        }
        .button-header{
            width: 120px;
            margin: 7px 0;
            height: 36px;
        }
    }

    .skeleton {
        position: relative;
        overflow: hidden;
        width: 100%;
        max-width: 460px;
        height: 22px;
        background: #ccc;
        display: block;
        border-radius: 5px;
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #ccc, #dedede, #ccc);
            animation: progress 1s ease-in-out infinite;
        }
    }

    @keyframes progress {
        0% {
            transform: translate3d(-100%, 0, 0);
        }
        100% {
            transform: translate3d(100%, 0, 0);
        }
    }
</style>