<template>
    <div style="height: 100%;">
        <div class="_ctn_">
            <loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" @event-retry="fetchMembers" />

            <div class="table">
                <item-member-header />
                
                <ul class="members-list">
                    <item-member 
                        v-for="member in state.members" 
                        :key="member.id" 
                        :member="member"
                        @edit="openModal(member)"
                        @remove="handleRemoveMember(member.id)">
                    </item-member>
                </ul>
            </div>

            <button-circle @click="openModal()"/>
        </div>
        <modal v-if="state.modalIsShow" :item="state.item" @set="handleSet" @close-modal="closeModal"/>
    </div>
</template>

<script>
import buttonCircle from "@/components/buttons/buttonCircle.vue"
import modal from "./modal/modal.vue"

import itemMemberHeader from "./items/itemMemberHeader.vue";
import itemMember from "./items/itemMember.vue";

import { reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from "@/services/api"
import { useStore as useStoreHistory } from "@/store/history"
import { notify } from '@kyvg/vue3-notification';

export default {
    name: "sub-members",
    components: {
        itemMemberHeader,
        itemMember,
        buttonCircle,
        modal
    },
    setup(){
        const state = reactive({ members: [], isLoading: false, errorMsg: "", modalIsShow: false, item: {} })
        const $route = useRoute();
        const history = useStoreHistory()

        fetchMembers()
        async function fetchMembers(){
            state.isLoading = true;
            state.errorMsg = "";
            state.members = [];
            
            try{
                const { data } = await axios.get(`constructions/${ $route.params.constructionID }/members`)
                state.members = data
            } catch (error) {
                state.errorMsg = error
            } finally {
                state.isLoading = false
            }
        }

        watch(() => $route.params.constructionID, fetchMembers)

        async function handleRemoveMember(member_id){
            try{
                await axios.delete(`constructions/members/${ member_id }`)
                const index = state.members.findIndex( elem => elem.id === member_id)
                state.members.splice(index, 1)
                notify({
                    title: "Membro removido com sucesso",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                notify({
                    title: "Nao foi possivel remover membro",
                    type: "error",
                    duration: 5000
                })
            } finally {
                state.isLoading = false
            }
        }

        function openModal(member = {}){
            state.item = member
            state.modalIsShow = true
            history.push({ name: "modal", fn: closeModal })
        }
        function closeModal(){
            state.item = {}
            state.modalIsShow = false
            history.remove("modal")
        }
        function handleSet(member){
            state.members.push(...member)
        }

        return {
            state,
            // 
            fetchMembers,
            openModal,
            closeModal,
            handleSet,
            handleRemoveMember
        }
    }
}
</script>

<style lang="less" scoped>
    ._ctn_{
        width: 100%;
        height: 100%;
        background-color:#fff ;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
    }
    .table{
        width: 100%;
        height: 100%;
        padding: 20px;
        overflow: hidden auto;
    }
</style>