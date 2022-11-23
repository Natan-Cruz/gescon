<template>
    <li class="item-table">
        <div class="content-row">

            <div class="wrapper-cell">
                <div class="wrapper-name">
                    <span style="width: 20%" class="name">{{ data.quantity }}</span>
                    <span style="width: 20%" class="name border_center">{{ data.unity }}</span>
                    <span style="width: 60%; padding: 0 6px" class="name" :title="data.name">{{ data.name }}</span>
                </div>
                
                <div class="gradient"></div>
            </div>

            <div class="cell-value" v-for="n in numberOfColumns" :key="n" :class="{ 'nth-color': n % 2 === 0 }" >
                <div class="content-cell-value">
                    <p>{{ data.value[n - 1] }}</p>
                </div>
            </div>

        </div>
    </li>
</template>

<script>

export default {
    props: {
        data: Object,
        numberOfColumns: Number,
    }
}
</script>

<style lang="less" scoped>
    @nameFontSize: 1.5em;
    @valueFontSize: 1.6em;

    .item-table{
        display: block;
    }
    .content-row{
        display: table-row;
    }
    .wrapper-cell{
        position: -webkit-sticky; /* apenas chrome e webkit nightly */
        position: sticky;
        left: 0;
        border-left: solid 1px #e0e4e9;
        border-bottom: solid 1px #e0e4e9;
        border-right: solid 1px #e0e4e9;
        background-color: #fff;
        text-align: left;
    }
    .wrapper-name{
        width: 600px;
        height: 34px;
        vertical-align: middle;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 100%;
    }
    .name{
        font-size: @nameFontSize;
        vertical-align: middle;
        white-space: nowrap;
        text-align: center;
        hyphens: none;
        padding: 8px 0;

        display: inline-block;
    }
  

    .border_center{
        border-left: solid 1px gray; 
        border-right: solid 1px gray
    }

    .gradient{
        background: linear-gradient(90deg,rgba(171,181,186,.3),transparent);
        height: 100%;
        width: 3px;

        position: absolute;
        left: 100%;
        top: 0;
        pointer-events: none;
        padding-right: 5px;
    }

    // 
    .cell-value{
        text-align: center;
        min-width: 200px;
        display: table-cell;
        padding: 6px 0;
        font-size: @valueFontSize;
        vertical-align: middle;
            background-color: #f0f3f5;

        border-left: solid 1px #e0e4e9;
        border-bottom: solid 1px #e0e4e9;
        border-right: solid 1px #e0e4e9;


        & > .content-cell-value{
            width: 100%;
            font-size: 1em;
            padding: 0 4px;

            display:table;
            table-layout:fixed; /* added, so that width specifications will be honored */
            width:100%; /* needed so that these tables honor width of parent element */
        }
        & > .content-cell-value > p {
            display:table-cell;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            font-size: 1em;
        }
    }
   
    .nth-color{
        background-color: #fff;
    }
</style>