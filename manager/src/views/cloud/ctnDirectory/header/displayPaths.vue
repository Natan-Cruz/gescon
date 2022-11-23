<template>
    <span class="list-paths skeleton" v-if="is_loading"></span>
    
    <ul class="list-paths" v-else>

        <template v-if="path_tree.length > 1">
            <li v-for="(path, i) in path_name" :key="path" >
                <span class="path" @click="navigateToFolder(i)" > {{ path === 'root' ? "Início": path }} </span>
                <span class="arrow" v-if="(i + 1 < path_name.length)"> > </span>
            </li>
        </template>
        
        <li class="title" v-else>Pastas e arquivos</li>
    </ul>
</template>

<script>
import { watch } from 'vue';

/* eslint-disable */
export default {
    emits: ["enter-folder"],
    props: {
        path_tree: Array,
        path_name: Array,
        is_loading: Boolean
    },
    setup(props, { emit }){
        watch(() => props.path_name, scrollPathNameToRight) 
        
        function navigateToFolder(index){
            const pathLtree = props.path_tree
                .slice()
                .splice(0, index + 1)
                .join('.');

            emit("enter-folder", pathLtree)
        }

        function scrollPathNameToRight(){
            setTimeout(() => {
                const listPaths = document.querySelector(".list-paths")
                const { clientWidth, children } = listPaths
                let sum = 0
                Array.from(children).forEach( elem => {
                    sum += elem.clientWidth
                })
                const scrollX = sum - clientWidth
                listPaths.scrollTo(scrollX <= 0 ? 0 : scrollX, 0)
            }, 100);
        }

        return {
            navigateToFolder
        }
    }
}
</script>

<style lang="less" scoped>
    // PATH OF FOLDER
    .list-paths{
        grid-area: path;
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        align-self: center;
        overflow: auto hidden;

        span{
            font-size: 1.8em;
            color: #6b6b6b;
            white-space: nowrap; 
            margin-right: 4px;
        }
    }
    
    .skeleton{
        max-width: 180px;
        height: 26px;
        overflow: hidden;
        margin-left: 20px;
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

    .title{
        font-size: 1.9em;
		text-align: center;
        font-weight: bold;
        color: #000;
        white-space: nowrap;
        margin-left: 20px;
    }
</style>