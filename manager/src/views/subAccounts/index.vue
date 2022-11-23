<template>
    <subpages-layout>
        <template v-slot:topbar="{ isActive }">
            <router-link to="/main/sub-accounts/users" class="items item-nav-bar"  :class="{ 'selected': isActive('users') }" >
                <span>Usuários</span>
            </router-link>
            <router-link to="/main/sub-accounts/roles" class="items item-nav-bar" :class="{ 'selected': isActive('roles') }">
                <span>Papéis</span>
            </router-link>
        </template>
    </subpages-layout>
</template>

<script setup>
import subpagesLayout from "@/components/subpagesLayout/subpagesLayout.vue"
</script>