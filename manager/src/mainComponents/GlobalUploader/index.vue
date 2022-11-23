<template>
    <div class="container-uploader">
        <button-cloud ref="button"
            :wrapperLoadingIsRunning="wrapperLoadingIsRunning" 
            :hasError="hasError"
            @open-popup="openPopup">
        </button-cloud>

        <transition name="fade-popup"> 
            <popup v-if="isOpen" 
                :queueFiles="queueFiles" 
                @close-popup="closePopup"
                @remove-item="removeItem"
                @cancel-upload="cancelUpload">
            </popup>
        </transition>
    </div>
</template>

<script>
import buttonCloud from "./buttons/buttonCloud.vue";
import popup from "./popupComponent.vue";

import { useStore } from "../../store/uploader"
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useStore as useStoreHistory } from "@/store/history"

export default {
    name: "global-uploader",
    components:{
        buttonCloud,
        popup
    },
    setup(){
        const store = useStore();
        const history = useStoreHistory();

        const { queue } = storeToRefs(store);
        const isOpen = ref(false);
        const button = ref(null);

        const wrapperLoadingIsRunning = computed(() => {
            const queueFiles = queue.value.filter( queueFile => {
                if(!(queueFile.done || queueFile.error))
                    return queueFile
            })

            return queueFiles.length ? true : false
        })
        const hasError = computed( () => {
            const queueFiles = queue.value.filter( queueFile => {
                if(queueFile.error)
                    return queueFile
            })

            return queueFiles.length ? true : false
        })

        function openPopup(){
            isOpen.value = true;
            history.push({ name: "global_uploader_popup", fn: closePopup })
        }
        function closePopup(){
            isOpen.value = false;
            history.remove("global_uploader_popup")
        }
        function runAnimationShinkAndExpand(){
            const node = button.value.$el

            const stepOne = 220,
                stepTwo = 400;

            requestAnimationFrame(() => {
                node.style.transform = "scale(1.2)"
            })

            setTimeout(() => {
                requestAnimationFrame(() => {
                    node.style.transform = "scale(.8)"
                })
            }, stepOne);

            setTimeout(() => {
                requestAnimationFrame(() => {
                    node.style.transform = "scale(1)"
                })
            }, stepTwo);
        }

        function removeItem(_uuid){
            store.removeItem(_uuid)
        }
        function cancelUpload(_uuid){
            store.cancelUpload(_uuid)
        }

        watch(queue, runAnimationShinkAndExpand)

        return {
            button,
            queueFiles: queue,
            isOpen,
            wrapperLoadingIsRunning,
            hasError,
            openPopup,
            closePopup,
            runAnimationShinkAndExpand,
            removeItem,
            cancelUpload
        }
    }
}
</script>

<style lang="less" scoped>
    .container-uploader{
        position: relative;
        pointer-events: none;
        z-index: 10;
    }

    .fade-popup-enter-from{
        opacity: 0;
        transition: 100ms ease;
    }
    .fade-popup-enter-to{
        opacity: 1;
        transition: 100ms ease;
    }

    .fade-popup-leave-from{
        opacity: 1;
        transition: 100ms ease;
    }
    .fade-popup-leave-to{
        opacity: 0;
        transition: 100ms ease;
    }

    @media screen and (max-width: 1000px){
        .container-uploader{
            right: 0;
        }
    }
</style>