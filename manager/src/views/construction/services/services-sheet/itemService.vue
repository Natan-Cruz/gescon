<template>
    <li class="item">
        <p class="bold" >{{ service.name }}</p>
        <p class="service-detail" >{{ pathName }}</p>
        <p class="service-detail" v-if="service.entity_name">{{ service.entity_name }}</p>
    </li>
</template>

<script>
import axios from "@/services/api"
import { ref } from 'vue'

export default {
    props: {
        service: Object
    },
    setup(props){
        const pathName = ref("")

        async function getServicePathName(){
            const { data } = await axios.get("/financial/cost-center/full-path/" + props.service.path )  
            pathName.value = data.replace("/" + props.service.name, "")
        }
        getServicePathName()

        return {
            pathName
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        font-size: 1.5em;
        padding: 16px 20px;
        border-bottom: solid 1px rgb(182, 182, 182);
        cursor: pointer;

        &:hover{
            background-color: rgb(247, 247, 247);
        }

        p{
            font-size: 1em;
        }
    }

    .service-detail{
        @color: rgb(109, 109, 109);
        color: @color;
        position: relative;
        padding-left: 10px;
        margin-top: 4px;

        &::after{
            content: "";
            display: block;

            width: 5px;
            height: 5px;
            border-radius: 50%;

            background-color: @color;

            position: absolute;
            left: 0;
            top: calc(50% - 2px);
        }
    }
</style>