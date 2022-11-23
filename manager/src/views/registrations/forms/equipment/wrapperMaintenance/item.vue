<template>
    <div class="item" >
        <span class="ball-detail"></span>
        <div class="wrapper-item ">
            <p class="text-medium" style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: dashed 1px gray">{{ maintenance.description }}</p>
            <div class="row">
                <span class="key">Inicio:</span>
                <span class="value">{{ startDate || "Não especificada" }}</span>
            </div>
            <div class="row">
                <span class="key">Fim:</span>
                <span class="value">{{ endDate || "Não especificada" }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs"
export default {
    props: {
        maintenance: Object
    },
    setup(props){
        const startDate = props.maintenance.start_date ? dayjs(props.maintenance.start_date).format("DD/MM/YY") : ""
        const endDate = props.maintenance.end_date ? dayjs(props.maintenance.end_date).format("DD/MM/YY") : ""
        return {
            startDate,
            endDate 
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;
        margin-bottom: 30px;
        position: relative;
    }
   
    .wrapper-item{
        width: calc(50%);

        margin-left: 36px;
        
        padding: 10px 16px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        border-radius: 6px;
        &:hover{
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            cursor: pointer;
        }
    }
    
    .ball-detail{
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #f70;
        display: block;
        position: absolute;
        top: 10px;
        left: 0
    }

     .row{
        margin: 5px 0;
    }
    .key, .value{
        font-size: 1.5em;
    }
    
    .value{
        margin-left: 10px;
        color: gray
    }
   

    @media screen and (max-width: 700px) {
        .wrapper-item{
            width: calc(100% - 26px);
            margin-left: 26px;
        }
    }
</style>