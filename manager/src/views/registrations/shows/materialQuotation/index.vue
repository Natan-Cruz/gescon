<template>
    <form-page-without-script
        contentStyle="max-width: 1200px"
        :showFooter="false"
        :isLoading="state.isLoading" 
        :error="state.error" 
        @event-retry="fetchMaterialQuotation">


        <p class="title">Aceite de produtos</p>
        <material-group v-for="(d,i) of data" :key="i" :title="d.material_name" >
            <material v-for="item of d.items" :key="item.id" :item="item" @select-item="handleSelect" @deselect-item="handleDeselect"></material>
        </material-group>

        <p class="title">Resumo da cotação</p>
        <ul>
            <selected-item v-for="mQuotation in teste" :key="mQuotation.id" :mQuotation="mQuotation"></selected-item>
        </ul>

        <div class="wrapper-button" v-if="teste.length">
            <button class="button button-primary text-medium">Salvar pedido</button>
        </div>

    </form-page-without-script>
</template>

<script>
import formPageWithoutScript from "@/components/formPage/formPageWithoutScript.vue"

import selectedItem from "./items/selected.vue"

import materialGroup from "./items/materialGroup.vue"
import material from "./items/material.vue"

// scripts
import { computed, reactive, ref } from 'vue'
import axios from "@/services/api"
import { useRoute } from "vue-router";

export default {
    components: { formPageWithoutScript, selectedItem, materialGroup, material },
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

        fetchMaterialQuotation()

        const tableHeader = computed(() => ({
            unity: "Unid",
            name: "Descrição",
            quantity: "Qtd", 
            value: state.data.map(({ provider_name }) => provider_name )
        }));

        const data = computed(() => {
            const materialNames = state.data.reduce((acc, cur) => {
                cur.items.forEach( item => {
                    const has = acc.find( itm => itm === item.material_name)

                    if(!has) acc.push(item.material_name)
                })

                return acc
            }, [])


            const map = new Map();
            state.data.forEach( quotation => {
                materialNames.forEach( material_name => {
                    const item = quotation.items.find( itm => itm.material_name === material_name )
                    if(!item) return;

                    const has = map.get(material_name)
                    let obj;
                    if(item){
                        obj = { ...item, provider_name: quotation.provider_name }
                    }
                    if(has){
                        has.push(obj)
                        map.set(material_name, has)
                    }else{
                        map.set(material_name, [obj])
                    }
                })
            })
            return Array.from(map).map(([ key, value ]) => ({ material_name: key, items: value }))
        })
        const numberOfColumns = computed(() => {
            if(tableHeader.value.value)
                return tableHeader.value.value.length
            else
                return 0
        })
        function handleSelect({ id }){
            selected.value.push(id)
        }
        function handleDeselect({ id }){
            const index = selected.value.findIndex(i_id => i_id === id);
            selected.value.splice(index, 1)
        }
        return {
            numberOfColumns,
            tableHeader,
            state,
            selected,
            teste,
            data,
            // methods
            fetchMaterialQuotation,
            handleSelect,
            handleDeselect
        }
    }
}
</script>


<style lang="less" scoped>
    .tree-table{
        width: min-content;
        max-width: 100%;
        overflow-x: auto;
        padding-bottom: 6px;
        border-top: solid 1px #e0e4e9;
    }
    .content-tree-table{
        position: relative;
    }
    .detail-gradient{
        display: none;
        z-index: 2;
        width: 8px;

        position: absolute;
        right: 0;
        top: 0;

        pointer-events: none;
        height: 100%;
        background: linear-gradient(-90deg,rgba(171,181,186,.3),transparent);
    }
</style>

<style lang="less" scoped>
    // scroll bar em geral
    ::-webkit-scrollbar {
        height: 8px;
    }

    // fundo da scroll bar
    ::-webkit-scrollbar-track {
        background: rgb(235, 235, 235);
        border-radius: 10px;
    }

    // botao da scroll bar
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius:10px;
    }

    // O resto das propriedades disabilita por segunraça
    ::-webkit-scrollbar-button,
    ::-webkit-scrollbar-corner,
    ::-webkit-scrollbar-track-piece,
    ::-webkit-resizer {
        display: none;
    }
</style>

<style lang="less" scoped>
    .title{
        font-size: 2em;
        font-weight: bold;
        border-bottom: solid 1px rgb(218, 218, 218);
        box-shadow: 0 3px 5px -2px #f1f1f1;
        padding-bottom: 12px;
        margin-bottom: 12px;
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