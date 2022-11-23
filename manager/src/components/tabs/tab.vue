<script>
import {onBeforeMount, ref, inject, watch} from "vue";

export default {
    name: "Tab",
    setup(_, { emit }) {
        const index = ref(0);
        const isActive = ref(false);

        const tabs = inject("TabsProvider");

        watch(
        () => tabs.selectedIndex,
            () => {
                isActive.value = index.value === tabs.selectedIndex;
                if(index.value === tabs.selectedIndex)
                    emit("mounted")
            }
        );

        onBeforeMount(() => {
            index.value = tabs.count;
            tabs.count++;
            isActive.value = index.value === tabs.selectedIndex;
            // if(isActive.value)
            //     emit("mounted")
        });
        return {index, isActive};
    }
}
</script>

<template>
    <div class="content-tab" v-if="isActive">
        <slot></slot>
    </div>
</template>