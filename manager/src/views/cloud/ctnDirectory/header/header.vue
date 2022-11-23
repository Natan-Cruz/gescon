<template>
    <div class="header no_highlights">
        <!-- arrow back -->
        <button class="button__main button-back" @click="handleLeaveFolder" v-if="paths.path_tree.length > 1">
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>

        <!-- current path -->
        <display-paths-component 
            :path_name="paths.path_name" 
            :path_tree="paths.path_tree" 
            :is_loading="isLoading"
            @enter-folder="$emit('enter-folder', $event)"/>
        
        <!-- button refresh -->
        <button class="button__main button-refresh" @click="$emit('event-refresh')" :disabled="isLoading">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="M0 0h24v24H0V0z" fill="none"/>
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
        </button>

        <!-- search button -->
        <button class="button__main button-search" @click="openInputSearch">
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>

        <!-- input search -->
        <search-and-filters 
            ref="ref_search_and_files"
            :path_name="paths.path_name" 
            :path_tree="paths.path_tree"
            :is_loading="isLoading"
            
            :search="search"
            :filter="filter"
            :mode="mode"
            @update:search="$emit('update:search', $event)"
            @update:filter="$emit('update:filter', $event)"
            @update:mode="$emit('update:mode', $event)" />
    </div>
</template>

<script>
import displayPathsComponent from "./displayPaths.vue"
import searchAndFilters from "./searchAndFilters.vue"

import { computed, ref } from 'vue'

export default {
    emits: ["event-refresh", "enter-folder", "leave-folder"],
    components: { displayPathsComponent, searchAndFilters },
    props:{
        path_name: String,
        path_tree: String,
        isLoading: Boolean,
        search: String,
        filter: String,
        mode: String
    },
    setup(props, { emit }){
        const ref_search_and_files = ref(null)

        const paths = computed(() => {
            return {
                path_name: props.path_name ? props.path_name.split("/") : [],
                path_tree: props.path_tree ? props.path_tree.split(".") : []
            }
        })

        function handleLeaveFolder(){
            const pathLtree = paths.value.path_tree;
            pathLtree.pop();
            emit("enter-folder", pathLtree.join("."))
        }
       
        function openInputSearch(){
            ref_search_and_files.value.show()
        }
       
        return {
            // refs
            ref_search_and_files,
            // computed
            paths,
            // methods
            handleLeaveFolder,
            openInputSearch
        }
    }
}
</script>

<style lang="less" scoped>
    ::-webkit-scrollbar {
        width: 6px;
        height: 4px;
    }
    ::-webkit-scrollbar-button {
        width: 0px;
        height: 0px;
    }
    ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border: 0px none #ffffff;
        border-radius: 50px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border: 0px none #ffffff;
    }
    ::-webkit-scrollbar-corner {
        background: transparent;
    }
</style>

<style lang="less" scoped>
	.header{
        width: 100%;
        height: 60px;

		display: grid;
		grid-template-areas: 'back path refresh search';
		grid-template-columns: auto 1fr 50px 50px;
		grid-template-rows: 100%;

        border-bottom: solid 1px rgb(180, 180, 180);
        box-shadow: 0 1px 6px rgba(231, 231, 231, 0.3);
        position: relative;
	}
	.button-back{ grid-area: back; }
    .button-refresh{ grid-area: refresh;}
    .button-search{ grid-area: search;}
</style>