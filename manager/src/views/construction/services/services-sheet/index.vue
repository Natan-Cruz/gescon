<template>
    <div style="width:100%; height: 100%; background-color: #ffff" >

        <header-component :tree_structure_id="tree_structure_id" @set="handleSetTreeStructureId" :isLoading="state.isLoading" :path_name="state.path_name" />

        <loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" @event-retry="fetchServices"></loading-or-error>

        <ul class="body">
            <div v-if="state.msg" class="container-msg">
                <span>{{ state.msg }}</span>
            </div>
            <item-service v-for="service in state.data" :key="service.id" :service="service" @click="selectService(service)" />

            <li class="without-item" v-if="!state.data && !state.data.length">Nenhum item</li>
        </ul>
    </div>
</template>

<script>
import headerComponent from "./header/header.vue"
import itemService from "./itemService.vue"

import axios from "@/services/api"
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from "vue-router"

export default {
    components: { headerComponent, itemService },
    setup(){
        const state = reactive({ data: {}, isLoading: false, errorMsg: "", msg: "" })
        const tree_structure_id = ref("")
        const $router = useRouter();
        const $route = useRoute();

        function selectService(service){
            $router.push({ name: "constuction/service/items", params: { id: service.id }})
        }
      
        async function fetchServices(){
            const presets = localStorage.getItem("service_path")
            if(presets){
                const query = JSON.parse(presets).find( item => item.construction_id === $route.params.constructionID )
                if(query)
                    tree_structure_id.value = query.tree_structure_id;
            }

            if(!tree_structure_id.value) 
                return state.msg = "Defina um \"lugar\" na estrutura para exibir-se os serviços";
            else 
                state.msg = ""

            state.isLoading = true;
            state.errorMsg = ""
            try {
                const [ { data: services }, { data: pathName }] = await Promise.all([
                    axios.get(`/services/c/` + tree_structure_id.value ),
                    axios.get(`/financial/cost-center/full-path/` + tree_structure_id.value )
                ])
                state.data = services;
                state.path_name = pathName
            } catch (error) {
                state.errorMsg = error
            } finally {
                state.isLoading = false
            }
        }

        function handleSetTreeStructureId(tree_structure_id){
            const presets = localStorage.getItem("construction_service_sheet_paths") || []
            const index = presets.find( item => item.construction_id === $route.params.constructionID )
            if(index){
                presets.splice(index, 1, tree_structure_id)
            }else{
                presets.push({ construction_id: $route.params.constructionID, tree_structure_id: tree_structure_id })
            }
            localStorage.setItem("service_path", JSON.stringify(presets));

            fetchServices()
        }

        fetchServices()

        return {
            state,
            tree_structure_id,
            // methods //
            fetchServices,
            selectService,
            handleSetTreeStructureId
        }
    }
}
</script>

<style lang="less" scoped>
    .body{
        height: calc(100% - 56px);
        overflow: hidden auto;
    }
    .container-msg{
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        span{
            font-size: 2em;
            font-weight: bold;
        }
    }
</style>