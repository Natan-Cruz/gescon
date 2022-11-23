<template>
    <div class="header no_highlights">
        <template v-if="isLoading">
            <span class="skeleton-text" style="width: 210px; height: 26px; align-self: center;"></span>
            <span class="skeleton-text button" style="height: 36px; align-self: center;"></span>
        </template>
        <template v-else>
            <ul class="list-paths">
                <li v-for="(path, i) in pathName" :key="path" >
                    <span class="path" @click="handleSelectPath(i)" :class="{ 'text-underline': (i + 1) === pathName.length } "> {{ path }} </span>
                    <span class="arrow" v-if="(i + 1 < pathName.length)"> > </span>
                </li>
            </ul>
            <button class="button button-primary text-medium" @click="handleOpen">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#fff"><path d="M15 21V18H11V8H9V11H2V3H9V6H15V3H22V11H15V8H13V16H15V13H22V21ZM4 5V9ZM17 15V19ZM17 5V9ZM17 9H20V5H17ZM17 19H20V15H17ZM4 9H7V5H4Z"/></svg>            
                <span>Abrir</span>
            </button>
        </template>

        <modal-tree-structure v-if="isShow" @close-modal="handleClose" @set="$emit('set', $event)" :construction_id="$route.params.constructionID" />
    </div>
</template>

<script>
import modalTreeStructure from "./modalTreeStructure.vue"

import { useStore as useStoreHistory } from "@/store/history";
import { computed, ref, watch } from 'vue';

export default {
    emits: ["set"],
    components: { modalTreeStructure },
    props:{
        tree_structure_id: String,
        path_name: String,
        isLoading: Boolean
    },
    setup( props, { emit }){
        const history = useStoreHistory();
        const isShow = ref(false)

        const pathName = computed(() => {
            if(!props.path_name) return []

            return props.path_name.split("/")
        })

        function handleSelectPath(index){
            const path = props.tree_structure_id.split(".").slice(0, index + 1 ).join(".")
            emit("set", path)
        }

        function handleOpen(){
            history.push({ name: "modal_tree_structure", fn: handleClose })
            isShow.value = true
        }

        function handleClose(){
            history.remove("modal_tree_structure")
            isShow.value = false
        }   

        watch(() => props.path_name, scrollPathNameToRight) 

        function scrollPathNameToRight(){
            setTimeout(() => {
                const listPaths = document.querySelector(".list-paths")
                if(!listPaths) return;

                const { clientWidth, children } = listPaths
                let sum = 0
                Array.from(children).forEach( elem => {
                    sum += elem.clientWidth
                })
                const scrollX = sum - clientWidth
                listPaths.scrollTo(scrollX <= 0 ? 0 : scrollX + 24, 0)
            }, 100);
        }
        

        return { 
            isShow,
            pathName,
            // methods
            handleSelectPath,
            handleOpen,
            handleClose
        }
    }
}
</script>

<style lang="less" scoped>
	.header{
        width: 100%;
        padding: 0 20px;
        box-shadow: rgba(114, 114, 114, 0.3) 0px 8px 16px -8px;
        position: relative;

        column-gap: 20px;

        display: grid;
        grid-template-areas: "path button";
        grid-template-columns: 1fr 110px;
        grid-template-rows: 56px;
	}

    .list-paths{
        grid-area: path;
        display: flex;
        align-items: center;
        align-self: center;
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;

        box-shadow: inset -2px 0 3px rgba(150, 150, 150, 0.2);
        padding-right: 24px;
        span{
            font-size: 1.8em;
            color: #6b6b6b;
            white-space: nowrap; 
        }
    }
    .path{
        border-radius: 12px;
        cursor: pointer;
        padding: 4px;
        transition: 120ms;
        &:hover{
            background-color: rgb(224, 224, 224);
        }
        &:active{
            transform: scale(.8);
        }
    }
    .arrow{
        margin-right: 4px;
    }
    
    .text-underline{
        text-decoration: underline;
    }

    .button{
        height: 36px;
        grid-area: button;
        align-self: center;

        span{
            font-size: 1em;
            color: inherit;
            margin-left: 12px;
            display: inline-block;
        }
    }

    @media screen and (max-width: 500px ){
        .header{
            grid-template-columns: 1fr 36px;
            padding: 0 10px;
            column-gap: 10px;
        }
        .button span{
            display: none;
        }
    }

</style>