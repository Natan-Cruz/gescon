<template>
    <subpages-layout>
        <template v-slot:topbar="{ isActive }">
            <router-link :to="`/main/constructions/c/${ $route.params.constructionID }/services/progress`" class="items item-nav-bar" :class="{ 'selected': isActive('progress') }">
                <span>Em andamento</span>
            </router-link>
            <router-link :to="`/main/constructions/c/${ $route.params.constructionID }/services/service-sheet`" class="items item-nav-bar" :class="{ 'selected': isActive('service-sheet') }">
                <span>Serviços</span>
            </router-link>
            <router-link :to="`/main/constructions/c/${ $route.params.constructionID }/services/unconformities`" class="items item-nav-bar"  :class="{ 'selected': isActive('unconformities') }" >
                <span>Não-conformidades</span>
            </router-link>
        </template>
    </subpages-layout>
</template>

<script setup>
import subpagesLayout from "@/components/subpagesLayout/subpagesLayout.vue"
</script>