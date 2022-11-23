<template>
    <div style="width: 100%">
        <ul class="list-constructions" v-if="constructionsFiltered.length">
            <card-construction v-for="constr in constructionsFiltered" :key="constr.id" :construction="constr" style="opacity: .8"/>
        </ul>
        <p class="without-item" v-else>Nenhum item</p>
    </div>
</template>

<script>
import cardConstruction from "../components/cardConstruction.vue";

export default {
    components: { cardConstruction },
    props: {
        constructions: Array
    },
    setup(props){
        function filter( constr ){
            if(!constr.enabled) return constr
        }

        return {
            constructionsFiltered: props.constructions.filter(filter)
        }
    }
}
</script>