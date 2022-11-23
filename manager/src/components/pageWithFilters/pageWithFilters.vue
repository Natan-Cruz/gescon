<template>
    <div class="_ctn_">
        <header-component 
            v-slot="{ hide }"
            :showButtonFilter="showButtonFilter"
            :showPrintOutButton="showPrintOutButton"
            :showButtonClearFilter="showButtonClearFilter"
            :showInputSearch="showInputSearch"
            @event-search="$emit('search', $event)"
            @event-print-out="$emit('open-modal-print')"
            @event-toggle-filters="filterIsShow ? handleClose() : handleOpen()"
            @event-reset-filters="$emit('clear-filters')"
            @event-generate-payments="$emit('event-generate-payments')">

            <slot name="popup_content" :hide="hide"/>
        </header-component>

        <div class="body" :class="{ 'filter-is-open': filterIsShow }">
            <div class="table" :style="contentStyle">
                <slot name="content" />
            </div>

            <filter-component  class="filter" :filterIsShow="filterIsShow" @close="handleClose" @submit="$emit('submit', $event)">
                <slot name="filters" />
            </filter-component>
        </div>

        <slot name="button-circle" />
    </div>
</template>

<script>
import headerComponent from "./headerComponent.vue"
import filterComponent from "./filterComponent.vue"

import { useStore as useStoreHistory } from "@/store/history"
import { onMounted, ref } from 'vue';
import { useRoute } from "vue-router";

export default {
    emits: [
        "submit", 
        "search", 
        "set-filters-by-url-query", 
        "toggle-filters", 
        "open-modal-print", 
        "clear-filters",
        "event-generate-payments",
    ],
    components: { headerComponent, filterComponent },
    props: { 
        headerComponent: Boolean,
        contentStyle: { 
            type: String,
            required: false
        },
        showInputSearch: {
            type: Boolean,
            required: false,
            default: () => true
        },
        showPrintOutButton: {
            type: Boolean,
            required: false,
            default: () => false
        },
        showButtonFilter: {
            tpye: Boolean,
            required: false,
            default: () => true
        },
        showButtonClearFilter: {
            tpye: Boolean,
            required: false,
            default: () => false
        }
    },
    setup( props, { emit }){
        const history = useStoreHistory();
        const filterIsShow = ref(false);
        const $route = useRoute();

        function handleOpen(){
            filterIsShow.value = true;
            history.push({ name: "modal_filter", fn: handleClose });
        }
        function handleClose(){
            filterIsShow.value = false;
            history.remove("modal_filter")
        }

        onMounted(() => {
            const { query } = $route;
            const hasQuery = Object.entries(query).length
            emit("set-filters-by-url-query", hasQuery ? query : null)
            emit("submit", true)
        })

        return {
            filterIsShow,
            // methods
            handleOpen,
            handleClose
        }
    }
}
</script>

<style lang="less" scoped>
    ._ctn_{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .body{
        width: 100%;
        height: calc(100% - 56px);

        position: relative;
    }
    .table{
        overflow: auto;
        position: relative;
        height: 100%;
        border-radius: 5px;
        // background-color: #fff;
        // box-shadow: 0 0 5px rgba(0, 0, 0, .2);
    }
</style>