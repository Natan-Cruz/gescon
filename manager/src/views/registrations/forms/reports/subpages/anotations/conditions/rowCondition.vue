<template>
    <li class="row-condition">
        <p class="row-condition-title">{{ title }}</p>
        <!-- practicable -->
        <div class="ctn-input ctn-practicable">
            <input type="radio" :name="name" :id="`${ period }-practicable`" value="practicable" v-model="modelValueCondition">
            <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125">
                    <path d="M50 29.5c-11.3 0-20.5 9.2-20.5 20.5S38.7 70.5 50 70.5 70.5 61.3 70.5 50 61.3 29.5 50 29.5zm0 31.1c-5.8 0-10.6-4.7-10.6-10.6S44.2 39.4 50 39.4 60.6 44.2 60.6 50 55.8 60.6 50 60.6zM50 23.2c2.7 0 4.9-2.2 4.9-4.9V7.4c0-2.7-2.2-4.9-4.9-4.9s-4.9 2.2-4.9 4.9v10.8c0 2.8 2.2 5 4.9 5zM24.1 31.1c1 1 2.2 1.4 3.5 1.4 1.3 0 2.5-.5 3.5-1.4 1.9-1.9 1.9-5.1 0-7l-7.7-7.7c-1.9-1.9-5.1-1.9-7 0-1.9 1.9-1.9 5.1 0 7l7.7 7.7zM23.2 50c0-2.7-2.2-4.9-4.9-4.9H7.4c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9h10.8c2.8 0 5-2.2 5-4.9zM24.1 68.9l-7.7 7.7c-1.9 1.9-1.9 5.1 0 7 1 1 2.2 1.4 3.5 1.4 1.3 0 2.5-.5 3.5-1.4l7.7-7.7c1.9-1.9 1.9-5.1 0-7-2-1.9-5.1-1.9-7 0zM50 76.8c-2.7 0-4.9 2.2-4.9 4.9v10.8c0 2.7 2.2 4.9 4.9 4.9s4.9-2.2 4.9-4.9V81.7c0-2.7-2.2-4.9-4.9-4.9zM75.9 68.9c-1.9-1.9-5.1-1.9-7 0-1.9 1.9-1.9 5.1 0 7l7.7 7.7c1 1 2.2 1.4 3.5 1.4s2.5-.5 3.5-1.4c1.9-1.9 1.9-5.1 0-7l-7.7-7.7zM92.6 45.1H81.7c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9h10.8c2.7 0 4.9-2.2 4.9-4.9s-2.1-4.9-4.8-4.9zM72.4 32.5c1.3 0 2.5-.5 3.5-1.4l7.7-7.7c1.9-1.9 1.9-5.1 0-7-1.9-1.9-5.1-1.9-7 0l-7.7 7.7c-1.9 1.9-1.9 5.1 0 7 1 .9 2.3 1.4 3.5 1.4z"/>
                </svg>
            </span>
            <label :for="`${ period }-practicable`" class="label">Praticável</label>
        </div>
        <!-- not_practicable -->
        <div class="ctn-input ctn-not_practicable">
            <input type="radio" :name="name" :id="`${ period }-not_practicable`" value="not_practicable" v-model="modelValueCondition">
            <span class="icon" style="padding:2px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40">
                    <path d="M28 17a4.987 4.987 0 00-5.26-4.99 7.99 7.99 0 00-15.56.34A4.996 4.996 0 009 22h1.03a3 3 0 00-.03.43A3.572 3.572 0 0013.57 26h9a3.572 3.572 0 003.57-3.57 3.342 3.342 0 00-.27-1.34A4.979 4.979 0 0028 17zm-3.86 5.43A1.573 1.573 0 0122.57 24h-9A1.58 1.58 0 0112 22.43a1.541 1.541 0 01.06-.43 1.578 1.578 0 011.51-1.14 1.834 1.834 0 01.42.06.996.996 0 00.82-.13.976.976 0 00.43-.71c0-.03.01-.05.01-.08a3.495 3.495 0 016.92 0c0 .02.01.04.01.06a1.015 1.015 0 00.76.85 1.538 1.538 0 011.1.98 1.401 1.401 0 01.1.54zm.49-2.91a2.595 2.595 0 00-.58-.34 5.494 5.494 0 00-10.58-.32 3.517 3.517 0 00-2.5 1.14H9a2.996 2.996 0 01-.7-5.91.98.98 0 00.75-.84 5.995 5.995 0 0111.9.03 1.02 1.02 0 00.44.71.99.99 0 00.82.13A3.097 3.097 0 0123 14a3.001 3.001 0 011.63 5.52z"/>
                </svg>
            </span>
            <label :for="`${period}-not_practicable`" class="label">Não-praticável</label>
        </div>
    </li>
</template>

<script>
import { computed } from 'vue'
import { randomID } from "@/Utils/index.js"

export default {
    name: 'row-condition',
    emits: ["event-set"],
    props:{
        title: String,
        period: String,
        condition: String
    },
    setup(props, { emit }){
        const modelValueCondition = computed({
            get:() => {
                return props.condition
            },
            set: value => {
                emit("event-set", { key: props.period, value })
            }
        })
        const name = `${ props.period }_${ randomID() }`
        return {
            modelValueCondition,
            name
        }
    }
}
</script>

<style lang="less" scoped>
    .row-condition{
        display: grid;
        grid-template-areas: "condition practicable not_practicable";
        grid-template-columns: repeat(3,1fr);
        grid-template-rows: auto;
        column-gap: 20px;
        padding: 10px 20px;
        border-bottom: 1px dashed rgb(187, 187, 187);
        &:last-child{
            border:none;
        }
    } 

    .row-condition-title{
        grid-area: condition;
        width: 55px;
        font-size: 1.7em;
        align-self: center;
    }
    .ctn-practicable{
        grid-area: practicable;
    }
    .ctn-not_practicable{
        grid-area: not_practicable;
    }
    .ctn-rainy{
        grid-area: rainy;
    }

    .ctn-input{
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .icon{
        width: 32px;
        height: 32px;
        display: inline-block;
        margin: 0 4px;
        padding: 5px;
    }

    .label{
        font-size: 1.7em;
    }

    @media screen and (min-width: 450px) and (max-width: 540px) {
        .row-condition{
            grid-template-areas: 
                "condition condition condition"
                "practicable not_practicable rainy";
            row-gap: 8px;
        } 
    }
    @media screen and (max-width: 450px) {
        .row-condition{
            grid-template-areas: 
                "condition practicable"
                "condition not_practicable"
                "climaet rainy";

            grid-template-columns: auto 1fr     ;
        } 
    }
</style>