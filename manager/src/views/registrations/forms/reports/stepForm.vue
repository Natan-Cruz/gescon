<template>
    <div class="container-step-form">
        <div class="content-step-form">
            <li class="item" @click="$emit('select-item', 'anotations')">
                <span class="circle">1</span>
                <span class="text">Clima e condição</span>            
            </li>
            <li class="item" @click="$emit('select-item', 'labors')">
                <span class="circle">2</span>
                <span class="text">Mão de obra</span>            
            </li>
            <span class="detail-background"></span>
            <span class="detail" ref="detail"></span>
        </div>

    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
export default {
    emits: ["select-item"],
    setup(){
        const $route = useRoute();
        const ctn_links = ref(null);
        const detail = ref(null)

        function isActive(path){
            const pathname = $route.path;
            if(pathname.indexOf(path) > 0)
                return true;
            else
                return false
        }


        function setDetail(){
            const listPaths = document.querySelector(".content-step-form")
            if(!listPaths) return;
            const { children } = listPaths
            const { index } = $route.meta
            Array.from(children).forEach(elem => elem.classList.remove("selected"))
            Array.from(children).forEach( (elem, i) => {
                if((i + 1) <= index){
                    elem.classList.add("selected")
                }

                const selected = elem.classList.contains("selected") && elem
                if(selected){
                    const itemWidth = selected.clientWidth, columnGap = 20
                    detail.value.style.width = (i * itemWidth) + ( i * columnGap ) + ( itemWidth / 2) + "px";
                    
                    const containerStepForm = document.querySelector(".container-step-form") 
                    containerStepForm.scroll({ left: elem.offsetLeft, behavior: "smooth"})
                }
            })
        }

        watch($route, setDetail) 
        onMounted(setDetail)

        return {
            ctn_links,
            detail,
            isActive
        }
    }
}
</script>
<style lang="less" scoped>
    ::-webkit-scrollbar {
        width: 6px;
        height: 10px;
    }
    ::-webkit-scrollbar-button {
        width: 0px;
        height: 0px;
    }
    ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border: 0px none #ffffff;
        border-radius: 50px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border: 0px none #ffffff;
    }
    ::-webkit-scrollbar-corner {
        background: transparent;
    }
</style>
<style lang="less" scoped>
    .container-step-form{
        width: 100%;
        height: auto;

        overflow-x: auto;
        overflow-y: hidden;
        position: relative;

        border-bottom: solid rgb(187, 187, 187) 1px;
        padding-bottom: 8px;
    }
    .content-step-form{
        width: 100%;

        display: grid;
        grid-template-columns: repeat(2, minmax(95px, 50%));
        grid-template-rows: auto;
        column-gap: 20px;

        position: relative;

        margin-bottom: 10px;
        white-space: nowrap;
    }

    .detail-background{
        display: block;

        width: 100%;
        height: 4px;

        position: absolute;
        top: 24px;
        left: 0;

        background-color: rgb(255, 203, 158);
        z-index: 0;
        transition: 240ms;
    }

    .detail{
        display: block;

        width: 50%;
        height: 4px;

        position: absolute;
        top: 24px;
        left: 0;

        background-color: rgb(243, 123, 18);;
        z-index: 1;

        transition: 240ms;
    }

   

    .item{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
        
        &:first-child::before{
            content: "";
            display: block;
            width: 50%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background-color: #fff;
            z-index: -1;
        }

        &:nth-child(2)::before{
            content: "";
            display: block;
            width: 50%;
            height: 100%;
            position: absolute;
            right: 0;
            background-color: #fff;
            z-index: -1;
        }
        
        .text{
            font-size: 1.7em;
            display: block;
            color: rgb(136, 136, 136);
            margin-top: 10px;
        }
        z-index: 2;
    }

    .circle{
        display: block;

        width: 45px;
        height: 45px;

        border-radius: 50%;

        background-color: rgb(255, 174, 103);
        border: solid 1px #f70;

        font-size: 2em;
        color: #fff;
        font-weight: bold;
        padding: 9px 15px;

        cursor: pointer;
    }

    .selected{
        .circle{
            background-color: #f70;
        }
        .text{
            color: rgb(0, 0, 0);
        }
    }
</style>