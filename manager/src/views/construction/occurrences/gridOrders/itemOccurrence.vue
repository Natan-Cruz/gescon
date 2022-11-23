<template>
    <li class="wrapper-occurrence">
        <div class="item-occurrence" @click="$emit('select-item', item.id)">
            <div class="handle-background"></div>
            <!--  -->
            <span class="detail-risk" :style="{ backgroundColor: severityColor }"> </span>
            <!--  -->
            <div class="container-description">
                <div class="content-description">
                    <p class="bold title" :class="{ 'without-title': !item.title }"> {{ item.title || "Sem titulo" }} </p>
                    <p class="text-15 bold scope"> {{ item.scope === "internal" ? "Interno" : "Externo" }} </p>
                    <p class="text-15 description"> {{ item.description }} </p>
                </div>
            </div>

            <span class="text-15" style="text-align:center; color: #777"> {{ item.created_at }} </span>
        </div>

        <div class="wrapper-actions">
            <button class="icon" @click="$emit('change-status-item', { ...item, status: 4 })">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M8.025 22 6.25 20.225 14.475 12 6.25 3.775 8.025 2 18.025 12Z"/></svg>
            </button>
            <button class="icon" @click="$emit('delete-item', item.id)">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7 21Q6.175 21 5.588 20.413Q5 19.825 5 19V6H4V4H9V3H15V4H20V6H19V19Q19 19.825 18.413 20.413Q17.825 21 17 21ZM17 6H7V19Q7 19 7 19Q7 19 7 19H17Q17 19 17 19Q17 19 17 19ZM9 17H11V8H9ZM13 17H15V8H13ZM7 6V19Q7 19 7 19Q7 19 7 19Q7 19 7 19Q7 19 7 19Z"/></svg>
            </button>
        </div>
    </li>
</template>

<script>
import { computed } from 'vue';

export default {
    name:"item-order",
    props:{
        item: Object
    },
    setup(props){
        const severityColor = computed(() => {
            let color;
            switch(props.item.severity){
                case 1: color = "#00ac46"; break // Muito baixo
                case 2: color = "#fdc500"; break // Baixo
                case 3: color = "#fd8c00"; break // Moderado
                case 4: color = "#dc0000"; break // Alto
                case 5: color = "#780000"; break // Muito alto
                default: color = "#808080"; // default
            }
            return color
        })

        return {
            severityColor
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper-occurrence{
        display: flex;
        justify-content: space-between;
        align-content: center;
        margin-top: 20px;
    }
    .item-occurrence {
        width: calc(100% - 40px);
        height: 70px;
        min-height: 70px;
        border-radius: 5px;
        cursor: pointer;
        display:flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        box-shadow: 1px 1px 7px -4px rgba(0, 0, 0, .6);
        position: relative;
        overflow: hidden;
        transition: height 230ms;

        padding-right: 6px;
    }

    .wrapper-actions{
        width: 40px;
        height: 100%;
        padding-left: 6px;
    }

    .handle-background{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        cursor: pointer;
        &:hover{
            background-color: rgba(221, 221, 221, 0.205);
        }
    }

    .detail-risk{
        width: 12px;
        height: 100%;
        border-radius: 5px;
        display: block;
    }

    .container-description{
        width: 100%;
        height: 100%;
        padding: 10px 0;
        margin: 0 6px;
        overflow: hidden;
    }

    .content-description{
        width: 100%;
        height: auto;
    }
    
    .text-15{
        font-size: 1.5em;
        line-height:1em;
		cursor: default;
    }
    .title{
        font-size: 1.6em;
    }
    .without-title{
        color: gray;
        text-decoration: line-through;
    }

    @scope-color: rgb(112, 112, 112);
    .scope{
        color: @scope-color;
        position: relative;
        padding-left: 10px;
        margin: 3px 0;
        &::before{
            content:"";
            display: block;
            width: 6px;
            height: 6px;
            background-color: @scope-color;
            border-radius: 50%;
            position: absolute;
            top: 3px;
            left: 0;
            z-index: 1;
        }
    }

    // btn icon
    .icon{
        width: 34px;
        height: 34px;
        background-color: #fff;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: 120ms ease;

        &:first-child{
            margin-bottom: 2px;
        }

        &:hover{
            background-color: rgb(235, 235, 235);
        }

        &:active{
            background-color: gray;
            transform: scale(.8);
        }
    }
</style>