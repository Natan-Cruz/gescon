<template>
    <div class="body">
        <loading-or-error style="background-color: rgba(221,221,221, .3)" :isLoading="state.isLoading" :error="state.error" @event-retry="fetchData" />

        <div class="content-body">
            <ul>
                <item-tree 
                    v-for="(row, i) in treeData" :key="i" 
                    :data="row" 
                    @create-new-item="openModal" 
                    @edit-item="openModal"
                    @remove-item="handleRemoveItem"
                    @event-drag-start="handleDragStart"
                    @event-drag-over="handleDragOver"
                    @event-drop="handleDragDrop"
                    @event-drag-end="handleDragEnd"
                    @event-drag-leave="handleDragLeave" >
                </item-tree>
            </ul>
        </div>
    </div>
    <modal 
        v-if="state.modalIsShow" 
        :item="state.item"
        @close-modal="closeModal" 
        @push-item="handlePushItem" 
        @edit-item="handleEditItem" />
</template>

<script>

import { computed, reactive, ref } from 'vue'
import axios from "@/services/api"

import itemTree from "./lists/itemTree.vue";
import Modal from "./modal/modal"

import { useStore as useStoreHistory } from '@/store/history';
import { treeify, sameParent, getNumberBeetwenTwoNumber } from "./lists/utils.js"
import { notify } from '@kyvg/vue3-notification';

export default {
    components: { Modal, itemTree },
    setup(){
        const state = reactive({ data: [], isLoading: false, error: "", modalIsShow: false, item: {} })
        const history = useStoreHistory()
        const elemDrag = ref({})

        const treeData = computed(() => {
            if(state.data && state.data.length)
                return treeify(state.data)
            else
                return []
        })

        fetchData();
        async function fetchData(){
            state.isLoading = true;
            state.error = ""
            
            try {
                const { data } = await axios.get("/financial/cost-center")
                state.data = data;
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }


        async function saveAlterations(){
            state.isLoading = true;
            
            try {
                await axios.put("/financial/cost-center/sort-items", state.data.filter( item => item.newOrder))
                notify({
                    title: "Ordem alterada!",
                    type: "success",
                    duration: 5000,
                })
            } catch (error) {
                console.error(error)
                notify({
                    title: "Erro ao alterar ordem dos itens!",
                    type: "error",
                    duration: 5000,
                })
                state.data = state.data.map( item => {
                    item.newOrder = undefined
                    return item
                })
            } finally {
                state.isLoading = false
            }
        }

        async function handleRemoveItem(item_id){
            state.isLoading = true;
            try {
                await axios.delete("/financial/cost-center/" + item_id)
                notify({
                    title: "Item deletado",
                    type: "success",
                    duration: 5000,
                })
                removeItem(item_id)
            } catch (error) {
                notify({
                    title: "Erro ao deletar item",
                    type: "error",
                    duration: 5000,
                })
            } finally { state.isLoading = false; }
        }


        function handlePushItem(item){
            state.data.push(item)
        }
        function handleEditItem(item){
            const index = state.data.findIndex( itm => itm.id === item.id)
            state.data.splice(index, 1, item)
        }
        function removeItem(item_id){
            const index = state.data.findIndex( itm => itm.id === item_id)
            state.data.splice(index, 1)
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



        function handleDragStart(evt){
            elemDrag.value = evt.data;


            state.data = state.data.map( item => {
                if(sameParent(evt.data.path, item.path))
                    item.name_style = ""
                else
                    item.name_style = "filter: brightness(0.8); opacity: .7"

                return item
            })
        }
        
        function handleDragOver({ data, position }){
            const { id, path, } = data;

            if(elemDrag.value.path === path || elemDrag.value.id === id) 
                return;

            const elemIndex_2 = state.data.findIndex( elem => elem.id === id)

            if(sameParent(elemDrag.value.path, path)){
                if(position === "top"){
                    resetData()
                    state.data.splice(elemIndex_2, 1, { ...data, style: "border-top: solid 3px blue; margin-top: 2px; padding-top: 2px;" })
                }

                if(position === "bottom"){
                    resetData()
                    state.data.splice(elemIndex_2, 1, { ...data, style: "border-bottom: solid 3px blue;margin-bottom: 2px; padding-bottom: 2px;" })
                }

                const elemIndex_1 = state.data.findIndex( elem => elem.id === elemDrag.value.id) 
                state.data.splice(elemIndex_1, 1, { ...elemDrag.value, style: "border: dashed 1px #f70" })
            }
        }

        async function handleDragDrop({ data, position }){
            const { id, path, order, newOrder } = data;

            if(elemDrag.value.path === path || elemDrag.value.id === id) return;

            const elemIndex_1 = state.data.findIndex( elem => elem.id === elemDrag.value.id) 
            let ord = newOrder || order
            // se pais forem iguais, altera somente a ordem
            if(sameParent(elemDrag.value.path, path)){
                if(position === "top")
                    state.data.splice(elemIndex_1, 1, { ...elemDrag.value, newOrder: getNumberBeetwenTwoNumber(order - 1, ord) })

                if(position === "bottom")
                    state.data.splice(elemIndex_1, 1, { ...elemDrag.value, newOrder: getNumberBeetwenTwoNumber(ord, order + 1) })
            }

            await saveAlterations()

            state.data = state.data.map( item => {
                item.style = ""
                item.name_style = ""
                return item
            })
        }

       
        function handleDragEnd(){
            resetData();
            state.data = state.data.map( item => {
                item.style = ""
                item.name_style = ""
                return item
            })
        }


        function resetData(){
            state.data = state.data.map( item => {
                item.style = "";
                return item
            })
        }


        return {
            treeData,
            state,
            //methods
            fetchData,
            handleRemoveItem,
            // 
            handlePushItem,
            handleEditItem,
            // modal
            openModal,
            closeModal,
            // tree events
            handleDragStart,
            handleDragOver,
            handleDragDrop,
            handleDragEnd,
            handleDragLeave: () => {}
        }
    }
}
</script>

<style lang="less" scoped>
    .body{
        width: 100%;
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        background-color: #fff;
    }
    .items{
        font-size: 1.7em;
        margin: 0 16px;
        cursor: default;

    }
</style>