<template>
    <div class="global__modal">
        <div class="global__background-modal" @click="$emit('close-modal')"></div>
        <div class="global__wrapper-modal" style="overflow: auto; min-height: 40vh; overflow: auto auto;">

            <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetch" />

            <item-tree v-for="(item, i) in state.data" :key=i :data="item" @event-click="handleSelectItem" />
        </div>
    </div>
</template>

<script>
import itemTree from "@/components/inputSuggest/items/itemTree.vue"

import axios from "@/services/api"
import { reactive } from 'vue';

export default {
    emits: ["close-modal", "set"],
    components: { itemTree },
    props: {
        construction_id: String
    },
    setup(props, { emit }){
        const state = reactive({ data: [], isLoading: false, error: "" })

        async function fetch(){
            state.isLoading = true;
            state.error = "";

            try {
                const { data } = await axios.get("/financial/cost-center&construction_id=" + props.construction_id)
                state.data = data;
            } catch (error) {
                state.error = error;
            } finally {
                state.isLoading = false;
            }
        }
        fetch()

        function handleSelectItem(item){
            emit("set", item.path)
            emit("close-modal")
        }

        return {
            state,
            // methods
            fetch,
            handleSelectItem
        }
    }
}
</script>