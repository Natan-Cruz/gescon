<template>
    <li class="item" @click="handleSelectService">
        <div class="ctn-service-informations" @click="$emit('select-service', item.id)">
            <p class="name">{{ item.name }}</p>
            <p class="path">{{ item.entity_name }}</p>
            <p class="path">{{ pathName }}</p>
        </div>

        <ul>
            <slot />
        </ul>
    </li>
</template>

<script>
import { ref } from 'vue'
import axios from "@/services/api"

export default {
    emits: [ "select-service" ],
    props: {
        item: Object
    },
    setup(props){
        const pathName = ref();
         getServicePathName();

        async function getServicePathName(){
            const { data } = await axios.get("/financial/cost-center/full-path/" + props.item.path )  
            pathName.value = data
        }
        
        return {
            pathName
        }
    }
}
</script>
<style lang="less" scoped>
    .item{
        border: solid 1px gray;
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 16px;

        &:last-child{
            margin-bottom: 0;
        }
    }
    .ctn-service-informations{
        width: 100%;
        height: auto;

        &:hover{
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .name, .path{
        font-size: 1.7em;
    }
    .name{
        font-weight: bold;
        color: #f51720;
    }
    .path{
        color: gray
    }

    ul{
        margin-top: 16px;
    }
</style>