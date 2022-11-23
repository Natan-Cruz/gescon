<template>
    <div class="page">
        <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchMaterialQuotations" />

        <template v-if="!state.isLoading && !state.error">

            <expandable-content v-for="({ items }, i) of state.data" :key="i" style="padding: 0" @vizualize="openShowPage(items[0].id)" @edit="openFormPage(items[0].id)"  :defaultOpen="false">
                <template v-slot:label>
                    <span class="expandable-title">Cotações agrupadas</span>
                    <span class="expandable-sub-title"> - {{ items.length > 1 ? items.length + " itens" : items.length + " item" }}</span>
                    <span class="expandable-sub-title"> - {{ formatDate(items[0].created_at) }}</span>
                </template>
                <li class="item" v-for="(item, i) of items" :key="i">
                    <p>Cotação #{{ item.number }}</p>
                    <p>{{ item.provider_name }}</p>

                    <popup-options class="popup-options" v-slot="{ hide }">
                        <p class="text-medium" @click="openFormPage(item.id); hide()">Editar</p>
                    </popup-options>
                </li>
            </expandable-content>
        </template>
    </div>

    <button-circle @click="openFormPage()"/>
</template>

<script>
import expandableContent from "./expandableContentItem.vue"
import popupOptions from '@/components/popup-options.vue';
import buttonCircle from "@/components/buttons/buttonCircle.vue"

import axios from "@/services/api"
import { reactive } from '@vue/reactivity';
import { formatDate } from "@/Utils/index.js"
import { useRoute, useRouter } from "vue-router"

export default {
    components: { expandableContent, popupOptions, buttonCircle },
    setup(){
        const state = reactive({ isLoading: false, error: "", data: [] });
        const $route = useRoute();
        const $router = useRouter();

        async function fetchMaterialQuotations(){
            state.isLoading = true;
            state.error = "";
            try {
                const { data } = await axios.get("/materials/material-quotations")
                state.data = groupBy(data, { key: "group_id" });
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        fetchMaterialQuotations();

        function groupBy(xs, { key }) {
            const reduced = xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});

            return Object.entries(reduced).map(([ , value ]) => ({ items: value}))
        }

        function openShowPage(item_id){
            $router.push({
                name: "registrations/material_quotation_show",
                params: { id: item_id },
                query: { previous: $route.fullPath }
            })
        }

        function openFormPage(item_id){
            $router.push({
                name: "registrations/material_quotation_form",
                params: { id: item_id },
                query: { previous: $route.fullPath }
            })
        }

        return { 
            state,
            // methods
            formatDate,
            fetchMaterialQuotations,
            // routes
            openShowPage,
            openFormPage
        }
    }
}
</script>

<style lang="less" scoped>
    .page{
        width: 100%;
        height: 100%;
        position: relative;

        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 1px 1px 2px 4px rgba(209, 209, 209, 0.4);
    }
    .expandable-title{
        font-size: 1.6em;
        font-weight: bold;
        color: rgb(0, 0, 0);
        margin-left: 12px;
    }
    .expandable-sub-title{
        font-size: 1.5em;
        color: rgb(85, 85, 85);
        margin-left: 4px;
    }

    .item{
        display: flex;
        align-items: center;
        padding: 12px 8px;
        border-bottom: solid 1px gray;
        position: relative;

        &:last-child{
            border: none;
        }

        p{
            font-size: 1.5em;

            &:first-child{
                font-weight: bold;
                color: rgb(68, 68, 68);
                margin-right: 12px;
            }
        }
    }
    .popup-options{
        position: absolute;
        right: 8px;
    }
</style>