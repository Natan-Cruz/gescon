<template>
    <page-grid 
        :showFooter="false"
        left_title="Cotações"
        right_title="Produtos selecionados"
        :isLoading="state.isLoading" 
        :error="state.error" 
        @event-retry="fetchMaterialQuotation">

        <template v-slot:left>
            <ul>
                <provider v-for="mQuotation in state.data" :key="mQuotation.id" :mQuotation="mQuotation">
                    <material v-for="item in mQuotation.items" :key="item.id" :item="item" @toggle-check-item="handleToggleChecked"></material>

                    <div v-show="!mQuotation.items.length" class="without-item">Nenhum item</div>
                </provider>
            </ul>
        </template>
        <template v-slot:right>
            <ul>
                <selected-item v-for="mQuotation in teste" :key="mQuotation.id" :mQuotation="mQuotation"></selected-item>
            </ul>

            <div class="wrapper-button" v-if="teste.length">
                <button class="button button-primary text-medium">Salvar pedido</button>
            </div>
        </template>
    </page-grid>
</template>

<script>
import pageGrid from "./pageGrid.vue"
import provider from "./items/provider"
import material from "./items/material"
import selectedItem from "./items/selected.vue"

// scripts
import { computed, reactive, ref } from 'vue'
import axios from "@/services/api"
import { useRoute } from "vue-router";

export default {
    components: { pageGrid, provider, material, selectedItem },
    setup(){
        const $route = useRoute();

        const state = reactive({ isLoading: false, error: "", data: [] })

        const selected = ref([])

        const teste = computed(() => {
            const a = []
            state.data.forEach( quotation => {
                const items = quotation.items.filter( item => {
                    const has = selected.value.findIndex( s_id => s_id === item.id )
                    if(has > -1) return item
                })

                if(items && items.length){
                    const q = {...quotation}
                    q.items = items
                    a.push(q)
                }   
            })

            return a
        })

        async function fetchMaterialQuotation(){
            const url = `/materials/material-quotations/${ $route.params.id }/show`;

            state.isLoading = true;
            state.error = ""
            try {
                const { data } = await axios.get(url);
                state.data = data;
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        function handleToggleChecked({id, isChecked}){
            if(isChecked){
                selected.value.push(id)
            }else{
                const index = selected.value.findIndex(i_id => i_id === id);
                console.log(index)
                selected.value.splice(index, 1)
            }
        }

        fetchMaterialQuotation()

        return {
            state,
            selected,
            teste,
            // methods
            fetchMaterialQuotation,
            handleToggleChecked
        }
    }
}
</script>

<style lang="less" scoped>
    .title{
        font-size: 2em;
        font-weight: bold;
        padding-bottom: 10px;
        border-bottom: solid 1px rgb(218, 218, 218);
        box-shadow: 0 3px 5px -2px #f1f1f1;
    }

    .grouping{
        width: 100%;
        height: calc(100% - 35px);
        overflow: hidden auto;

        padding-top: 12px;
    }

    .wrapper-button{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        .button{
            width: auto;
            height: auto;

            padding: 12px 16px
        }
    }
</style>