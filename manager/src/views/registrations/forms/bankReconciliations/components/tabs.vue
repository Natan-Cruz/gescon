<template>
  <div class="tabs">
    <div class="tabs__header">
        <div
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectTab(index)"
            :class="{'tab__selected': index === selectedIndex}"
            class="tab"
        >
            {{ tab.props.title }}
        </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import {defineComponent, reactive, provide, onMounted, onBeforeMount, toRefs} from "vue";

export default defineComponent({
    name: "Tabs",
    setup(_, {slots}) {
        const state = reactive({
            selectedIndex: 0,
            tabs: [],
            count: 0
        });

        provide("TabsProvider", state);

        const selectTab = i => {
            state.selectedIndex = i;
        };

        onBeforeMount(() => {
            if (slots.default) {
                state.tabs = slots.default().filter((child) => child.type.name === "Tab");
            }
        });

        onMounted(() => {
            selectTab(0);
        });

        return {...toRefs(state), selectTab};
    }
});
</script>

<style lang="less" scoped>
    .tabs__header {
        display: block;
        list-style: none;
        padding: 0;

        border-bottom: solid #f70 1px;

        padding: 0 20px;
    }
    .tab {
        display: inline-block;
        color: black;
        border-radius: 10px;
        font-size: 1.7em;

        background-color: #fff;
        padding: 10px;
    }
    .tab__selected {
        font-weight: bold;
        border-radius: 10px 10px 0 0;
        // border-bottom: 8px solid transparent;
        background-color: #f70;
        color:  #fff;
    }
    :deep(.content-tab){
        padding: 20px;
    }
</style>