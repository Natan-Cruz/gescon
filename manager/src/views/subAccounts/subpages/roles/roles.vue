<template>
    <div class="_ctn_">
        <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchRoles" />

        <div class="table">
            <item-role :role="itemRoleHeader" style="font-weight: bold; cursor: default; padding-top: 0"/>
            
            <ul class="accounts-list">
                <item-role 
                    v-for="role in state.roles" 
                    :key="role.id" 
                    :role="role"
                    @click="routerPush(role.id)">
                </item-role>
            </ul>
        </div>

        <button-circle @click="routerPush()"/>
    </div>
</template>

<script>
import buttonCircle from "@/components/buttons/buttonCircle.vue"
import itemRole from "./itemRole.vue";

import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from "@/services/api"

export default {
    components: {
        itemRole,
        buttonCircle
    },
    setup(){
        const state = reactive({ roles: [], isLoading: false, error: undefined })
        const $router = useRouter();

        fetchRoles()
        async function fetchRoles(){
            state.isLoading = true;
            state.error = undefined;
            try{
                const { data } = await axios.get("/companies/roles/")
                state.roles = data
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        function routerPush(roleId){
            $router.push({ name: 'registrations/form_role', params: { id: roleId } })
        }

        const itemRoleHeader = {
            name: "Nome",
            description: "Descrição"
        }

        return {
            state,
            itemRoleHeader,
            // methods
            fetchRoles,
            routerPush,
        }
    }
}
</script>

<style lang="less" scoped>
    ._ctn_{
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color:#fff ;
        border-radius: 5px;
        position: relative;
    }
    .table{
        height: 100%;
        padding: 20px;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>