<template>
    <div style="width: 100%">
        <ul class="list-constructions">
            <card-construction v-for="constr in constructions.filter(filter)" :key="constr.id" :construction="constr" />
        </ul>
        <button-circle @click="openModal"></button-circle>
        
        <modal-create-construction v-if="isShow" @close-modal="closeModal" @refresh-constructions="$emit('refresh-constructions')"></modal-create-construction>    
    </div>
</template>

<script>
import cardConstruction from "../components/cardConstruction.vue";
import buttonCircle from "@/components/buttons/buttonCircle.vue"
import modalCreateConstruction from "../components/modalCreateConstruction.vue"

import { ref } from 'vue';
import { useStore as useStoreHistory } from "@/store/history"

export default {
    components: { cardConstruction, buttonCircle, modalCreateConstruction },
    emits: ["refresh-constructions"],
    props: {
        constructions: Array
    },
    setup(){
        const history = useStoreHistory();
        const isShow = ref(false)

        function filter( constr ){
            if(constr.enabled) return constr
        }

        function openModal(){
            history.push({ name: "modal_create_construction", fn: closeModal });
            isShow.value = true;
        }

        function closeModal(){
            history.remove("modal_create_construction");
            isShow.value = false;
        }

        return {
            isShow,
            filter,
            openModal,
            closeModal
        }
    }
}
</script>