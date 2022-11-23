<template>
    <div class="tree-table">
        <div class="content-tree-table">
            <item-table :data="columns" :numberOfColumns="numberOfColumns"/>
            <ul>
                <item-table v-for="(d,i) of data.children" :key="i" :data="d" :numberOfColumns="numberOfColumns"/>
            </ul>
        </div>
        <div class="detail-gradient"></div>
    </div>
</template>

<script>
import { computed } from 'vue'
import itemTable from "./itemTable.vue"

export default {
    components: { itemTable },
    props: {
        actualCashFlow: Object,
        labels: Array
    },
    setup(props){
        const columns = computed(() => {
            return { name: "", value: props.labels }
        })
        const data = computed(() => {
            return {
                name: "root",
                value: [],
                deep: 0,
                children: [
                    {
                        name: "Entrada",
                        value: props.actualCashFlow.inflows,
                        deep: 1,
                        children: []
                    },
                    {
                        name: "Saida",
                        value: props.actualCashFlow.outflows,
                        deep: 1,
                        children: []
                    }
                    // {
                    //     name: "Saldo final",
                    //     value: this.balances,
                    //     deep: 1,
                    //     children: []
                    // }
                ]
            }
        })
        const numberOfColumns = computed(() => {
            if(columns.value.value)
                return columns.value.value.length
            else
                return 0
        })
        return {
            numberOfColumns,
            columns,
            data
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

    @media screen and (max-width: 1097px){
        // .detail-gradient{
        //     display: block;
        // }
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