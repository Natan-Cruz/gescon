<template>
    <li class="item-table" :class="{ 'is-selected': arrowsSelect , 'bold': isSelected }">
        <!-- content row -->
        <div class="content-row" @click="onClickHandler">

            <div class="wrapper-name" :title="data.name" :style="{ 'padding-left': padding_left }">

                <!-- button expand or collapse -->
                <button v-if="hasChildren" :aria-label="data.name" class="button-expand-or-collapse" :class="{ 'is-expanded': isExpanded }" >
                    <svg class="" width="16" height="16" viewBox="0 0 48 48" data-icon="caret-down" style="stroke-width: 0; vertical-align: bottom;">
                        <path d="M24.21 33.173l12.727-12.728c.78-.78.78-2.048 0-2.828-.78-.78-2.047-.78-2.828 0l-9.9 9.9-9.9-9.9c-.78-.78-2.047-.78-2.827 0-.78.78-.78 2.047 0 2.828L24.21 33.173z"></path>
                    </svg>
                </button>

                <!-- name row -->
                <span class="name"  :class="{ 'before': !hasChildren }">{{ data.data.name }}</span>

            </div>
        </div>

        <!-- children -->
        <transition name="fadeHeight" mode="out-in">
            <div v-if="isExpanded" >
                <item-table v-for="(data, i) of data.children" :key="i" :data="data" @event-click="$emit('event-click', $event)"/>
            </div>
        </transition>
    </li>
</template>

<script>
import { ref, computed } from 'vue'

export default {
    name: "item-table",
    props: {
        data: Object,
        isSelected: Boolean,
        arrowsSelect: Boolean,
    },
    setup(props, { emit }){
        const isExpanded = ref(false);
        isExpanded.value = props.data.deep < 2

        const padding_left = computed(() => {
            if(props.data.deep > 1)
                return ((props.data.deep - 1) * 20) + "px"
            else
                return "0"
        })

        const hasChildren = computed(() => {
            const { children } = props.data
            return children && children.length > 0
        })

        function onClickHandler(evt){
            if(evt.target.closest(".button-expand-or-collapse"))
                return isExpanded.value = !isExpanded.value

            emit('event-click', props.data.data)
        }

        return {
            isExpanded,
            padding_left,
            hasChildren,
            // METHODS
            onClickHandler
        }
    }
}
</script>

<style lang="less" scoped>
    .fadeHeight-enter-active,
    .fadeHeight-leave-active {
        transition: all 0.2s;
        max-height: 5000px;
    }
    .fadeHeight-enter,
    .fadeHeight-leave-to
    {
        opacity: 0;
        max-height: 0px;
    }
</style>

<style lang="less" scoped>
    @nameFontSize: 1.7em;
    @valueFontSize: 1.7em;

    .item-table{
        display: block;
        position: relative;
    }
    .content-row{
        width: minmax(100%, max-content);
        border-bottom: solid 1px rgb(219, 219, 219);
        cursor: default;
    }
    
    .is-selected{
        background-color: rgba(#FF7900, 0.1);
    }
    .button-expand-or-collapse{
        width: 40px;
        height: 40px;
        vertical-align: middle;
        border: none;
        background-color: transparent;
        transform: rotate(-90deg);

        cursor: pointer;
        transition: 120ms;
    }
    .is-expanded{
        transform: rotate(0deg);
    }
    .name{
        font-size: @nameFontSize;
        vertical-align: middle;
        white-space: nowrap;
        text-align: left;
        hyphens: none;

        display: inline-block;
        width: calc(100% - 40px);
        height: 100%;
        padding: 10px 0;

        &:hover{
            text-decoration: underline;
            cursor: pointer;
        }
    }
</style>