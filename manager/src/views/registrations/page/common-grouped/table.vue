<template>
    <div class="content-grid">
        <table>
            <thead>
                <tr class="fixed">
                    <template v-for="col of cols" :key="col">
                        <td>{{ col }}</td>
                        <td></td>
                    </template>
                </tr>
            </thead>
            <tbody>
                <template v-for="( row, i) in rows" :key="i">
                    <!-- :title="row.title" -->
                    <expandable-content style="padding: 0" :colspan="4 * cols.length" :title="row.title" :defaultOpen="false">
                        <li class="item" v-for="(item, i) of row.items" :key="i" @click="$emit('event-select-item', item.id)">
                            <p v-for="(col, i) of cols" :key="i">{{ item.values && item.values[i] }}</p>
                        </li>
                    </expandable-content>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import expandableContent from "./expandableContentItem.vue"

export default {
    name: "grid",
    components: { expandableContent },
    props: {
        cols: Array,
        rows: Array,
        withoutMessage: String
    }
}
</script>

<style lang="less" scoped>
    @border-color: rgb(194, 194, 194) ;

    .content-grid{
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: auto;
    }
    table{
        min-width: 100%;
        border-collapse: collapse;
        border-spacing: 10px 0;
    }
    .fixed{
        width: 100%;
        height: 50px;
        font-weight: bold;
        position: sticky;
        top: 0;
        left: 0;
        background-color: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .4);
    }
    tbody{
        padding-top: 70px;
        tr{
            height: 70px;
            border-bottom: solid 1px @border-color;
        }
    }
    td{
        min-width: 200px;
        font-size: 1.7em;
        padding: 10px 0;
        &:first-child{
            padding-left: 12px;
        }
        &:last-child{
            padding-right: 12px;
        }
    }
    td:empty {
        width: 24px !important;
        min-width: 20px;
    }

    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-columns: repeat( auto-fit, minmax(0, 1fr) );
        grid-template-rows: auto;
        column-gap: 10px;

        border-bottom: solid 1px @border-color;

        padding: 24px;
        cursor: pointer;

        &:hover{
            background-color: #f3f4f6;
        }
        p{
            font-size: 1.7em;
            align-self: center;
            &:first-child{
                padding-left: 24px;
            }
            &:last-child{
                padding-right: 24px;
            }
        }
        &:last-child{
            border-bottom: none;
        }
    }

    .without{
        margin-top: 20px;
        text-align: center;
        font-size: 1.7em;
    }

   
</style>