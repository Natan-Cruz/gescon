<template>
    <subpages-layout>
        <template v-slot:topbar="{ isActive }">
            <router-link :to="`/main/constructions/c/${ $route.params.constructionID }/materials/orders`" class="items item-nav-bar"  :class="{ 'selected': isActive('orders') }" >
                <span>Pedidos</span>
            </router-link>
            <!-- <router-link :to="`/main/constructions/c/${ $route.params.constructionID }/materials/sheets`" class="items item-nav-bar" :class="{ 'selected': isActive('sheets') }">
                <span>Fichas de verificação de materiais</span>
            </router-link> -->
        </template>
    </subpages-layout>
</template>

<script setup>
import subpagesLayout from "@/components/subpagesLayout/subpagesLayout.vue"
</script>