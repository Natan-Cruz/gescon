<template>
    <div class="header">
        <div class="content-header">

            <button class="button-back" @click="goBack" >
                <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24" width="36">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>

                <div class="title">
                    <p>{{ title }}</p>
                </div>
            </button>


            <popup-options v-if="store.data.id" class="popup-options" v-slot="{ hide }">
                <div class="container-loading" v-if="popupLoading">
                    <spinner-loading :loading="popupLoading" />
                </div>
                
                <p class="text-medium" @click="handleDelete(hide)">Excluir</p>
            </popup-options>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>