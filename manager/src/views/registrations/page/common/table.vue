<template>
    <ul class="content-grid">
        <table>
            <thead>
                <tr class="fixed">
                    <template v-for="(col, i) of cols" :key="col">
                        <td class="column-name" @click="handleSort(cells[i])">
                            {{ col }}
                            <div class="arrows" :class="setClass(cells[i])">
                                <!-- <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m7 14 5-5 5 5Z"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m12 15-5-5h10Z"/></svg> -->
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9 18-6-6 6-6 1.4 1.4L6.8 11H21v2H6.8l3.6 3.6Z"/></svg>
                            </div>
                        </td>
                        <td v-if="i + 1 < cols.length"></td>
                    </template>
                </tr>
            </thead>
            <tbody >
                <tr v-for="(row, i) of rows" :key="i" @click="$emit('event-select-item', row.id)">
                    <template v-for="(col, i) of cols" :key="i">
                        <td :style="`max-width: ${ 100 / cols.length }%; width: 100%`">{{ row.values && row.values[i] }}</td>
                        <td v-if="i + 1 < cols.length"></td>
                    </template>
                </tr>
            </tbody>
        </table>

        <li class="without" v-show="!rows.length">Nenhum item</li>
    </ul>
</template>

<script>
export default {
    name: "grid",
    props: {
        cols: Array,
        rows: Array,
        cells: Array,
        sortPreferences: Object
    },
    setup(props, { emit }){

        function handleSort(columnName){
            columnName = Array.isArray(columnName) ? columnName[0] : columnName
            emit("event-sort-column", columnName)
        }
        function setClass(columnName){
            columnName = Array.isArray(columnName) ? columnName[0] : columnName
            if(props.sortPreferences.columnName === columnName){
                if(props.sortPreferences.sortOrder === 1) return "arrow-up"
                if(props.sortPreferences.sortOrder === -1) return "arrow-down"
            }

        }

        return {
            handleSort,
            setClass
        }
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
        padding-bottom: 70px;
    }
    .column-name{
        cursor: pointer;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;

        &:hover{
            background-color: rgb(240, 240, 240);
        }
    }
    .arrows{
        display: flex;
        flex-direction: column;

        svg{
            fill: gray;
            opacity: 0;
            transition: transform 120ms;
        }
    }
    // 90 deg to bottom
    // -90 deg to top

    .arrow-up{
        svg:first-child{
            opacity: 1;
            transform: rotate(-90deg);
        }
    }
    .arrow-down{
        svg:last-child{
            opacity: 1;
            transform: rotate(90deg);
        }
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
            cursor: pointer;
        }
    }
    td{
        min-width: 200px;
        font-size: 1.7em;
        padding: 13px 10px;
    }
    td:empty {
        width: 24px !important;
        min-width: 20px;
    }
    .without{
        margin-top: 20px;
        text-align: center;
        font-size: 1.7em;
    }
</style>