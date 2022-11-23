<template>
    <li class="item">
        <span class="ball-detail"></span>
        <div class="wrapper-item ">
            <p class="detail-bottom">Foi produzido <b>{{ item.value }} {{ item.unity }}</b> no dia <b>{{ item.date }}</b></p>
            <p class="detail-bottom">O acumulado é <b>{{ item.acumulate }} {{ item.unity }}</b> de um total de <b>{{ item.total }} {{ item.unity }}</b></p>
            <p>A mão de obra alocada foi <b>{{ item.allocated_labor }}</b> de <b>{{ item.service_allocated_labor }}</b> previamente definidos</p>
        </div>
    </li>
</template>

<script>
export default {
    props: {
        item: Object
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;
        margin-bottom: 12px;
        position: relative;
    }
    .wrapper-item{
        width: calc(50%);
        margin-left: 36px;
        
        padding: 10px 16px;
        border: solid 1px rgb(168, 168, 168);
        border-radius: 5px;

        &:hover{
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            cursor: pointer;
        }

        span{
            font-size: 1.7em;
        }
        font-size: 1.7em;
        p, b{
            font-size: 1em;
        }
    }
    .ball-detail{
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #fff;
        border: solid 1px #f70;
        display: block;
        position: absolute;
        top: 10px;
        left: 0
    }

    .key{
        width: 90px;
        margin-right: 12px;
        text-align: right;
        display: inline-block;
    }
    .value{
        color: rgb(78, 78, 78);
    }
    .display_flex{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .detail-bottom{
        border-bottom: dashed 1px #e3e3e3; 
        padding-bottom: 4px; 
        margin-bottom: 4px
    }

    @media screen and (max-width: 700px) {
        .wrapper-item{
            width: calc(100% - 26px);
            margin-left: 26px;
        }
    }
</style>