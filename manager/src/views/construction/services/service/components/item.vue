<template>
    <li class="item-check">
        <span class="detail" :style="'background-color:' + style"></span>
        <div class="content" @click="handleSelectItem">
            <p class="text-medium name bold" style="margin-bottom: 4px">{{ item.name }}</p>
            <see-more-component class="check_method" style="font-size: 1.5em">
                {{ item.check_method }}
            </see-more-component>
        </div>

        <check-buttons class="buttons" :item="item" @edit-item="handleCheckedStatus"></check-buttons>

        <div class="attachments">
            <slot />
        </div>
    </li>
</template>

<script>
import checkButtons from "@/components/buttonsCheckItem/buttonCheckItemAxios.vue"
import seeMoreComponent from "@/components/seeMoreComponent.vue"

import { computed } from 'vue'

export default {
    components: { checkButtons, seeMoreComponent },
    emits: ["select-item", "decline-check"],
    props: {
        item: Object
    },
    setup(props, { emit }){
        const style = computed(() => {
            if(props.item.checked === false) return '#F51720'
            if(props.item.checked === true && !props.item.reinspected_at) return '#287928'
            if(props.item.checked === true && props.item.reinspected_at) return "#FFA500";
            return 'gray'
        })

        function handleSelectItem(evt){
            const target = evt.target.closest(".button-see-more");
            if(target) return;

            emit("select-item", props.item.id)
        }

        function handleCheckedStatus({ id, checked }){
            emit("decline-check", { id, checked })
            if(checked === false) emit("select-item", id)
        }
      
        return {
            style,
            handleSelectItem,
            handleCheckedStatus
        }
    }
}
</script>

<style lang="less" scoped>
    .item-check{
        border: solid 1px rgb(168, 168, 168);
        border-radius: 5px;
        margin-bottom: 12px;

        // overflow: hidden;
        position: relative;

        display: grid;
        grid-template-areas: "content buttons" "attachments buttons";
        grid-template-rows: auto;
        grid-template-columns: 1fr 40px;
        row-gap: 10px;
        column-gap: 18px;

        padding: 10px 10px 10px 16px;
    }
    .content{
        grid-area: content;
        width: 100%;
        position: relative;
    }
    .detail{
        display: block;
        width: 6px;
        height: 100%;
        
        position: absolute;
        left: 0;
        top: 0;

        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    // 
    .buttons{
        grid-area: buttons;
        align-self: center;
        position: relative;
    }
    .attachments{
        grid-area: attachments;
    }
</style>