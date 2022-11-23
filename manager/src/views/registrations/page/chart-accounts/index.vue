<template>
    <div style="height: 100%; width: 100%">
        <div class="header">
            <topbar @search="state.search = $event; fetchChartAccounts()"/>
        </div>
        <div class="body">
            <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchChartAccounts" />

            <template v-if="!state.isLoading && !state.error">
                <router-view v-slot="{ Component, route }">
                    <transition :name="transitionName || 'fade'">
                        <component :is="Component" :key="route.path" :accounts="accounts" @edit="openModal" @remove="handleRemove"/>
                    </transition>
                </router-view>
            </template>

            <button-circle v-can="'create:chart_accounts'" @click="openModal"></button-circle>
        </div>

        <modal 
            v-if="state.modalIsShow" 
            :account_type="$route.meta.account_type" 
            :item="state.item" 
            @close-modal="closeModal" 
            @push-item="handlePushItem"
            @edit-item="handleEditItem" />
    </div>
</template>

<script>
import Topbar from './components/topbar.vue';
import Modal from "./components/modal"
import buttonCircle from "@/components/buttons/buttonCircle.vue"

import { computed, reactive, ref, watch } from 'vue';
import axios from '@/services/api';
import { useRoute } from 'vue-router';
import { useStore as useStoreHistory } from '@/store/history';
import { notify } from '@kyvg/vue3-notification';

export default {
    name:"constructions",
    components:{ Topbar, buttonCircle, Modal },
    setup(){
        const state = reactive({ data: [], isLoading: false, error: "", search: "" })
        const history = useStoreHistory()

        const $route = useRoute();
        const index = ref($route.meta.index)
        const transitionName = ref("fade");

        const accounts = computed(() => {
            if(!state.data || !state.data.length) return [];

            let accounts;
            switch($route.meta.account_type){
                case "revenue": accounts = state.data.filter( acc => acc.type === "revenue"); break
                case "expense": accounts = state.data.filter( acc => acc.type === "expense"); break
                default: accounts = []
            }
            return accounts;
        })

        watch($route, route => {
            if(index.value < route.meta.index){
                transitionName.value = "slide-right" 
            }else{
                transitionName.value = "slide-left" 
            }

            index.value = route.meta.index
        })

        fetchChartAccounts();
        async function fetchChartAccounts(){
            state.isLoading = true;
            state.error = undefined;
            state.data = [];
            try {
                const { data } = await axios.get("/financial/chart-accounts?search=" + state.search)
                state.data = data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        async function handleRemove(account_id){
            try {
                await axios.delete("/financial/chart-accounts/" + account_id)
                notify({
                    title: "Item deletado!",
                    type: "success",
                    duration: 5000
                })
                const index = state.data.findIndex( itm => itm.id === account_id)
                state.data.splice(index, 1)
            } catch (error) {
                notify({
                    title: "Erro ao deletar item!",
                    type: "error",
                    duration: 5000
                })
            }
        }


        function openModal(item = {}){
            state.item = item
            state.modalIsShow = true;
            history.push({ name: "modal_tree_structure", fn: closeModal });
        }
        function closeModal(){
            history.remove("modal_tree_structure");
            state.modalIsShow = false;
        }

        function handlePushItem(account){
            state.data.push(account)
        }
        function handleEditItem(account){
            const index = state.data.findIndex( itm => itm.id === account.id )
            state.data.splice(index, 1, account)
        }

        return {
            state,
            transitionName,
            accounts,
            // 
            fetchChartAccounts,
            openModal,
            closeModal,
            handleRemove,
            handlePushItem,
            handleEditItem,
        }
    }
}
</script>

<style lang="less" scoped>
    .sub_content{
        min-height: 100%;
    }
    .body{
        width: 100%;
        height: 100%;
        height: calc(100% - 43px);
        overflow: hidden auto;
        background-color: #fff;
        border-radius: 5px;
        position: relative;
        overflow: hidden;
    }
</style>
