<template>
    <menu-left :isOpen="isOpen" @event-close-menu-left="closeMenuLeft">
        <wrapper-profile 
            :isExpanded="isExpanded"  
            :photo_file_url="user.photo_file_url"
            :first_name="user.first_name"
            :last_name="user.last_name"
            :title="user.title">
        </wrapper-profile>
        <group-pages 
            :isExpanded="isExpanded" 
            :preview_construction="preview.construction" 
            :preview_home="preview.home"
            @event-navigate-to="navigateTo" 
            @event-to-back="back">
        </group-pages>

        <button-expand-or-shrink :isExpanded="isExpanded" @click="toggle" />
    </menu-left>
</template>

<script>
import menuLeft from "./menuLeftComponent.vue";

import wrapperProfile from "./groupsLinks/wrapperProfile.vue";
import groupPages from "./groupsLinks/groupPages.vue"
import buttonExpandOrShrink from './components/buttonExpandOrShrink.vue';

import { useStore } from "@/store/menuLeft"
import { useStore as useStoreHistory } from "@/store/history"
import { useStore as useStoreUser } from "@/store/user"

import { storeToRefs } from "pinia"
import { reactive, watch, provide } from "vue";
import { useRoute, useRouter } from "vue-router"

export default {
    name: 'menu-left-component',
    components: {
        wrapperProfile,
        menuLeft,
        buttonExpandOrShrink,
        groupPages
    },
    setup(){
        const store = useStore()
        const history = useStoreHistory()
        const user = useStoreUser()

        const $route = useRoute();
        const $router = useRouter();

        const { isOpen, isExpanded } = storeToRefs(store);
        provide("isExpanded", isExpanded)

        const preview = reactive({ home: false, construction: false })

        function definePreview(){
            // Reseta
            preview.home = false;
            preview.construction = false;

            if($route.params.constructionID){
                preview.construction = true;
                preview.home = false;
            }else{
                preview.construction = false;
                preview.home = true;
            }
        }

        function navigateTo(route, saveRoute){
            if(route === $route.path) 
                return closeMenuLeft();

            $router.push(route)
            
            if(saveRoute)
                localStorage.setItem("lastPageConstruction", route.split("/").splice(4).join("/"))
            
            closeMenuLeft();
        }

        function back(){
            const windowWidth = window.innerWidth;
            if(windowWidth >= 1000){
                $router.push({ name: "constructions/active" })
            }else{
                // Este trecho só é executado em "mobiles" ou telas menores que 1000px
                closeMenuLeft()

                setTimeout(() => {
                    $router.push({ name: "constructions/active" })
                }, 100);

                setTimeout(() => {
                    history.push({ name: "menu_left", fn: store.close });
                    store.open()
                }, 200 );
            }
        }

        function closeMenuLeft(){
            history.remove("menu_left");
            store.close()
        }

        store.setDefault()

        definePreview()
        watch($route, definePreview)


        return {
            isOpen, 
            isExpanded,
            closeMenuLeft,
            toggle: store.expandOrShrink,
            preview,
            navigateTo,
            back,
            user: user.data
        }
    }
}
</script>