<template>
    <li class="item-table no_highlights" 
        draggable="true" 
        dropzone="true"
		@dragstart.stop="handleDragStart"
		@dragover.stop.prevent="handleDragOver" 
		@dragenter.stop.prevent="handleDragEnter"
		@dragleave.stop.prevent="$emit('event-drag-leave')"
        @dragend.stop.prevent="$emit('event-drag-end')"
		@drop.stop.prevent="handleDragDrop" :style="data.data.style">

        <div class="row" >
            <!-- button expand or collapse -->
            <div class="content-button" >
                <button v-show="hasChildren" class="button-expand-or-collapse" :class="{ 'is-expanded': isExpanded }"  @click="onClickHandler">
                   <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m12 15-5-5h10Z"/></svg>
                </button>
            </div>

            <div class="wrapper-name has-children" :title="data.data.name" :style="{ 'padding-left': padding_left }">
                <p class="name" :style="data.data.name_style">
                    <span class="retreat-arrow" v-show="showRetreatArrow">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M19 19v-4q0-1.25-.875-2.125T16 12H6.8l3.6 3.6L9 17l-6-6 6-6 1.4 1.4L6.8 10H16q2.075 0 3.538 1.462Q21 12.925 21 15v4Z"/></svg>

                    </span>
                    <span>{{ data.data.name }}</span> 
                    <!-- <span style="font-size: 14px; color: gray; opacity: .7; margin-left: 12px">{{ data.data.newOrder }} - {{ data.data.order }}</span>  -->
                    <!-- <span style="font-size: 14px; color: gray; opacity: .7; margin-left: 12px">{{ data.data.newPath }} - {{ data.data.path }}</span>  -->
                    <span class="type-category" v-if="typeCategory">{{ typeCategory }}</span>
                </p>
            </div>
            <div class="name-buttons">
                <button v-if="!isRoot" class="drag-indicator" title="Arrastar item">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M9 20q-.825 0-1.412-.587Q7 18.825 7 18q0-.825.588-1.413Q8.175 16 9 16t1.413.587Q11 17.175 11 18q0 .825-.587 1.413Q9.825 20 9 20Zm6 0q-.825 0-1.412-.587Q13 18.825 13 18q0-.825.588-1.413Q14.175 16 15 16t1.413.587Q17 17.175 17 18q0 .825-.587 1.413Q15.825 20 15 20Zm-6-6q-.825 0-1.412-.588Q7 12.825 7 12t.588-1.413Q8.175 10 9 10t1.413.587Q11 11.175 11 12q0 .825-.587 1.412Q9.825 14 9 14Zm6 0q-.825 0-1.412-.588Q13 12.825 13 12t.588-1.413Q14.175 10 15 10t1.413.587Q17 11.175 17 12q0 .825-.587 1.412Q15.825 14 15 14ZM9 8q-.825 0-1.412-.588Q7 6.825 7 6t.588-1.412Q8.175 4 9 4t1.413.588Q11 5.175 11 6t-.587 1.412Q9.825 8 9 8Zm6 0q-.825 0-1.412-.588Q13 6.825 13 6t.588-1.412Q14.175 4 15 4t1.413.588Q17 5.175 17 6t-.587 1.412Q15.825 8 15 8Z"/></svg>
                </button>
                <button @click="$emit('create-new-item', { parent_path: data.data.path })" title="Adicionar">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"/></svg>
                </button>
                <button v-if="!isRoot" @click="$emit('edit-item', data.data)" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"/></svg>
                </button>
                <button v-if="data.deep > 1" @click="$emit('remove-item', data.data.id)" class="button-del">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.4 16.5 2.6-2.6 2.6 2.6 1.4-1.4-2.6-2.6L16 9.9l-1.4-1.4-2.6 2.6-2.6-2.6L8 9.9l2.6 2.6L8 15.1ZM7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21ZM17 6H7v13h10ZM7 6v13Z"/></svg>
                </button>
            </div>
        </div>

        <!-- <template v-show="isExpanded" > -->
            <!-- oveflow hidden, esta div é a resposável pela abertura ou fechamento dos items -->
            <!-- é a tal que é animada -->
            <div class="list-tree-container" ref="listTreeContainer">
                <!-- esta div serve para medir tamanho dela e seus item, portanto serve como referencia para div acima -->
                <ul class="list-tree-content" ref="listTreeContent">
                    <item-table 
                        v-for="(d, i) of data.children" :key="i" :data="d"
                        @create-new-item="$emit('create-new-item', $event)"
                        @edit-item="$emit('edit-item', $event)"
                        @remove-item="$emit('remove-item', $event)"
                        @event-drag-start="$emit('event-drag-start', $event)"
                        @event-drag-over="$emit('event-drag-over', $event, $b)"
                        @event-drop="$emit('event-drop', $event)"
                        @event-drag-end="$emit('event-drag-end')"
                        @event-drag-leave="$emit('event-drag-leave')" >
                    </item-table>
                </ul>
            </div>
        <!-- </template> -->
    </li>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
const KEY = "COST_CENTER_PRESETS"
import switchTypeCategory from "./switchTypeCategory.js"
export default {
    name: "item-table",
    emits: [
        "edit-item", 
        "remove-item", 
        "create-new-item", 
        "event-drag-start", 
        "event-drag-end", 
        "event-drag-over", 
        "event-drop", 
        "event-drag-enter", 
        "event-drag-leave"
    ],
    props: { data: Object },
    setup(props, { emit }){
        const isExpanded = ref(false);
        const listTreeContainer = ref(null)
        const listTreeContent = ref(null)

        const padding_left = computed( () => {
            if(props.data.deep > 1)
                return ((props.data.deep - 1) * 18) + 10 + "px"
            else
                return "10px"
        })
        const typeCategory = computed(() => switchTypeCategory(props.data.data.type_category))
        const showRetreatArrow = computed(() => props.data.deep > 1)
        const hasChildren = computed(() => {
            const { children } = props.data
            return children && children.length
        })
        const isRoot = computed(() => props.data.deep === 1)

        function onClickHandler(){
            const bool = !isExpanded.value;
            const local = localStorage.getItem(KEY)
            const presets = local ? local.split(",") : [];

            if(bool){
                presets.push(props.data.data.id)
                localStorage.setItem(KEY, presets.join(","))

                listTreeContainer.value.style.height = listTreeContent.value.clientHeight + "px"
                setTimeout(() => {
                    listTreeContainer.value.style.height = "auto"
                }, 150)
            }else{
                const index = presets.findIndex( treeId => treeId === props.data.data.id)
                if(index > -1){
                    presets.splice(index, 1)
                    localStorage.setItem(KEY, presets.join(","))
                }

                setTimeout(() => {
                    listTreeContainer.value.style.height = 0
                }, 100)
                listTreeContainer.value.style.height = listTreeContent.value.clientHeight + "px"
            }

            isExpanded.value = !isExpanded.value
        }

        onMounted(() => {
            const local = localStorage.getItem(KEY)
            if(local){
                const presets = local.split(",")
                const index = presets.findIndex( treeId => treeId === props.data.data.id)
                isExpanded.value = index > -1
                if(index > -1){
                    listTreeContainer.value.style.height = "auto"
                }
            }else{
                isExpanded.value =  props.data.deep === 1
            }
        })
        

        function handleDragStart(evt){
            evt.dataTransfer.effectAllowed = "copyMove";
            evt.dataTransfer.setDragImage(evt.target, window.outerWidth, window.outerHeight);
            emit('event-drag-start', props.data)
        }
        function handleDragEnter(evt){
            evt.dataTransfer.dropEffect = "copy";
            emit('event-drag-enter', props.data)
        }

        function handleDragOver(evt){
            emit("event-drag-over", defineCoordenates(evt))
        }

        function handleDragDrop(evt){
            emit("event-drop", defineCoordenates(evt))
        }


        function defineCoordenates(evt){
            let position;

            const { pageY } = evt;
            const element = evt.target.closest(".item-table")
            const { top, height } = element.getBoundingClientRect();

            const onePart = height * 0.5;

            if(pageY >= top && pageY <= top + onePart){
                position = "top"
            }else
                position = "bottom";

            return { data: props.data.data, position: position }
        }


        return {
            showRetreatArrow,
            hasChildren,
            isExpanded,
            typeCategory,
            padding_left,
            isRoot,
            // refs
            listTreeContainer,
            listTreeContent,
            // methods
            onClickHandler,
            handleDragOver,
            handleDragDrop,
            handleDragStart,
            handleDragEnter
        }
    }
}
</script>

<style lang="less" scoped>
    @nameFontSize: 1.5em;
    @valueFontSize: 1.5em;
    @fillColorSvg: rgb(175, 175, 175);

    .item-table{
        display: block;
        position: relative;
    }
    .row{
        width: 100%;
        height: 46px;
        cursor: default;
        display: flex;
        flex-direction: row;
        align-items: center;

        border-bottom: solid 1px rgb(199, 199, 199);
    }

    // button expand or collapse
    .content-button{
        width: 46px;
        height: 46px;
        background-color: rgb(235, 235, 235);
        position: relative;

        border: solid 1px rgb(197, 197, 197);
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .button-expand-or-collapse{
        width: 28px;
        height: 28px;
        
        border-radius: 50%;
        position: absolute;
        top: 9px;
        left: 9px;
        border: solid 1px rgb(206, 206, 206);
        transition: 120ms ease-in;
        transform: rotate(270deg);


        &:hover{
            background-color: #f70;
            border-color: #f70;
            fill: #fff;
            cursor: pointer;
        }
    }
    .is-expanded{
        transform: rotate(0deg);
    }

    // name
    .retreat-arrow{
        transform: rotate(180deg) scale(.8);
        display: inline-block;
        fill: @fillColorSvg;
        margin-right: 6px;

    }
    .drag-and-drop{
        transform: scale(.8);
        display: inline-block;
        fill: @fillColorSvg;
        margin-right: 6px;
    }
    .has-children{
        cursor: pointer;
    }
    .wrapper-name{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    @type-category-color: rgb(250, 150, 62);
    .name{
        vertical-align: middle;
        white-space: nowrap;
        text-align: left;
        hyphens: none;

        display: inline-block;
        width: calc(100% - 28px);
        height: 100%;
        padding: 6px 0;

        span{
            font-size: @nameFontSize;
        }

        .type-category{
            color: @type-category-color;
            opacity: .7;
            margin-left: 16px;
            position: relative;

            &::before{
                content: "";
                display: block;

                width: 4px;
                height: 4px;

                position: absolute;
                left: -10px;
                top: 8px;

                border-radius: 50%;
                background-color: @type-category-color;
            }
        }
    }

    .name-buttons{
        font-size: 1.3em;

        position: absolute;
        right: 12px;
        top: 12px;
        
        button{
            background-color: #fff;
            fill: gray;
            cursor: pointer;
            border: none;
            background-color: transparent;
            color: rgb(104, 104, 104);

            &:nth-child(2), &:nth-child(3){
                margin: 0 6px;
            }
        }
        
        .button-del{
            background-color: #b93636;
            fill: rgb(226, 226, 226);
            border-radius: 5px;
            padding: 1px;

            svg{
                transform: scale(.8);
            }
        }
    }


    .list-tree-container {
        width: 100%;
        height: 0;
        overflow: hidden;
        position: relative;
        transition: 120ms ease-out;
    }

</style>