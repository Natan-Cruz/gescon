<template>
    <div class="grid-system" :class="{ 'is-expanded': isExpanded }">

        <div class="header"  >
            <slot name="header" />
        </div>
        <div class="menu-left">
            <slot name="menu-left" />
        </div>

        <div class="content">
            <slot name="content" />
        </div>
    </div>
</template>

<script>
import { useStore } from "@/store/menuLeft"
import { storeToRefs } from "pinia"
export default {
    name: 'grid-system-component',
    setup(){
        const store = useStore()
        const { isOpen, isExpanded } = storeToRefs(store);

        return {
            isOpen,
            isExpanded
        }
    }
}
</script>

<style lang="less" scoped>
    @transition: 120ms ease-in;
    
    .grid-system{
        width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-areas: "menuLeft header" "menuLeft content";
        grid-template-columns: 70px calc(100% - 70px);
        grid-template-rows: 48px calc(100vh - 48px);
        overflow: hidden;
    }

    .is-expanded{
        grid-template-columns: 300px calc(100% - 300px);
    }
    .header{
        grid-area: header;
        transition: @transition;
    }
    .menu-left{
        grid-area: menuLeft;
        width: 100%;
    }
    .content{
        grid-area: content;
        padding: 20px 30px;
        overflow: hidden auto;
    }

    @media screen and (max-width: 1000px) {
        .grid-system{
            grid-template-areas: "header header" "content content";
            grid-template-columns: 50% 50%;
            grid-template-rows: 54px calc(100vh - 54px);
            overflow: hidden;
        }
        .header{
            grid-area: header;
        }
        .content{
            padding: 10px;
        }

        // For content
        .content-is-open{
            transform: translate(30px)
        }
    }
</style>