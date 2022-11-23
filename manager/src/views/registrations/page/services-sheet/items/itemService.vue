<template>
    <li class="item">
        <div class="service-header">
            <!--  -->
            <div class="content" @click="$emit('select-item', item.id)">
                <p class="text-medium bold service-name" style="margin-bottom: 8px">{{ item.name }}</p>
                <div class="display_flex">
                    <div>
                        <span class="bold">Planejado: </span>                    
                        <span style="white-space: nowrap" v-if="(item.expected_start_date || item.expected_end_date)">{{ formatDate(item.expected_start_date) || "--"  }} à {{ formatDate(item.expected_end_date) || "--"}}</span>
                        <span  v-else>Não especificada</span>
                    </div>
                    <div>
                        <span class="bold">Realizado: </span>                    
                        <span style="white-space: nowrap" v-if="(item.start_date || item.end_date)">{{ formatDate(item.start_date) || "--" }} à {{ formatDate(item.end_date) || "--" }}</span>
                        <span  v-else>Não especificada</span>
                    </div>
                    
                    <span>{{ item.entity_name }}</span>
                </div>
            </div>
            <p class="path">{{ pathName }}</p>

            <div class="status">
                <svg v-if="item.approved_in" xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#008000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/></svg>
                <p :style="item.approved_in ? 'color: #287928' : 'color: gray'">{{ item.approved_in ? 'Aprovado' : 'Não aprovado' }}</p>
                <p style="color: #287928">{{ formatDate(item.approved_in) }}</p>
            </div>

            <label :for="item.id" class="arrow no_highlights" :class="{ 'is-open': isOpen }">
                <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
            </label>

        </div>

        <input type="checkbox" :id="item.id" style="display: none" v-model="isOpen">
        <ul v-if="isOpen" class="content-expand">
            <slot />
        </ul>
    </li>
</template>

<script>
import dayjs from 'dayjs';
import { ref } from 'vue';
import axios from "@/services/api";


export default {
    emits: ["select-service"],
    props: {
        item: Object
    },
    setup(props, { emit }){
        const isOpen = ref(false)
        const pathName = ref("")
        
        function handleSelectService(evt){
            if(!evt.target.closest(".check_icon"))
                emit('select-service', props.item.id)
        }

        async function getServicePathName(){
            const { data } = await axios.get("/financial/cost-center/full-path/" + props.item.path )  
            pathName.value = data
        }
        getServicePathName()

        return {
            handleSelectService,
            formatDate: date => date ? dayjs(date).format("DD/MM/YY") : "",
            isOpen,
            pathName
        }
    }
}
</script>
<style lang="less" scoped>

    .service-header{
        display: grid;
        grid-template-areas: "content status arrow" "path status arrow";
        grid-template-columns: 1fr 100px 30px;
        grid-template-rows: auto;
        column-gap: 10px;
        row-gap: 10px;

        background-color: rgb(231, 231, 231);
        padding: 10px 20px;

        border-bottom: solid 1px gray;
    }
    .content{
        grid-area: content;
        align-self: center;
        cursor: pointer;

        &:hover{
            text-decoration: underline;
        }
    }
    .display_flex{
        flex-wrap: wrap;
        display: flex;
        row-gap: 4px;
        column-gap: 16px;

        span{
            font-size: 1.4em;
            color: rgb(56, 56, 56);
        }
    }
    .status{
        grid-area:status;
        align-self: center;

        display: flex;
        align-items: center;
        flex-direction: column;

        p{
            font-size: 1.5em;
            line-height: 1em;
            font-weight: bold;
            margin-bottom: 4px;

            &:last-child{
                margin-bottom: 0;
            }
        }
    }
    .arrow{
        grid-area:arrow;
        align-self: center;

        border: none;
        background-color: transparent;
        cursor: pointer;
        transform: rotate(-180deg);
        transition: 120ms;
    }
    .is-open{
        transform: rotate(0) translateX(-6px);
    }

    .name, .path{
        font-size: 1.7em;
        margin-bottom: 6px;
    }
    .name{
        font-weight: bold;
        color: #f51720;
    }
    .path{
        grid-area: path;
        width: 100%;

        color: rgb(75, 75, 75);
        white-space: nowrap;

        overflow: auto hidden;
        padding-bottom: 12px;
        margin-bottom: 0;
    }
    

    @media screen and (max-width: 700px) {
        .service-header{
            grid-template-areas: "content arrow" "path path";
            grid-template-columns: 1fr 30px;
            column-gap: 3px;
            row-gap: 10px;

            padding: 10px;
        }
        .path{
            grid-area: path;
            font-size: 1.5em;
        }
        .status{
            display: none;
        }
    }   
</style>