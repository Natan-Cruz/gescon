<template>
    <div class="_ctn_">
        <loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" @event-retry="fetchAccounts" />

        <div class="table">
            <item-account-header />
            
            <ul class="accounts-list">
                <item-account 
                    v-for="(account, i) in state.accounts" 
                    :key="i" 
                    :account="account"
                    @click="routerPush(account.id)">
                </item-account>
            </ul>
        </div>

        <button-circle @click="routerPush()"/>
    </div>
</template>

<script>
import buttonCircle from "@/components/buttons/buttonCircle.vue"

import itemAccountHeader from "./itemAccountHeader.vue";
import itemAccount from "./itemAccount.vue";

import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from "@/services/api"

export default {
    name: "sub-accounts",
    components: {
        itemAccountHeader,
        itemAccount,
        buttonCircle
    },
    setup(){
        const state = reactive({ accounts: [], isLoading: false, errorMsg: "" })
        const $router = useRouter();
 
        async function fetchAccounts(){
            state.isLoading = true;
            state.errorMsg = "";
            try{
                const { data } = await axios.get("/users/admin")
                state.accounts = data
            } catch (error) {
                state.errorMsg = error
            } finally {
                state.isLoading = false
            }
        }

        function routerPush(accountID){
            $router.push({ name: 'registrations/form_sub_accounts', params: { id: accountID } })
        }

        fetchAccounts()

        return {
            state,
            fetchAccounts,
            routerPush
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
        height: 100%;
        padding: 20px;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>