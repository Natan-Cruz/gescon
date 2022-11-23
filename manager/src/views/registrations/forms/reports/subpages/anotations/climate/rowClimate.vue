<template>
    <li class="row-climate">
        <p class="row-climate-title">{{ title }}</p>
        <!-- sunny -->
        <div class="ctn-input ctn-sunny">
            <input type="radio" :name="name" :id="`${period}-sunny`" value="sunny" v-model="modelValueClimate">
            <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125">
                    <path d="M50 29.5c-11.3 0-20.5 9.2-20.5 20.5S38.7 70.5 50 70.5 70.5 61.3 70.5 50 61.3 29.5 50 29.5zm0 31.1c-5.8 0-10.6-4.7-10.6-10.6S44.2 39.4 50 39.4 60.6 44.2 60.6 50 55.8 60.6 50 60.6zM50 23.2c2.7 0 4.9-2.2 4.9-4.9V7.4c0-2.7-2.2-4.9-4.9-4.9s-4.9 2.2-4.9 4.9v10.8c0 2.8 2.2 5 4.9 5zM24.1 31.1c1 1 2.2 1.4 3.5 1.4 1.3 0 2.5-.5 3.5-1.4 1.9-1.9 1.9-5.1 0-7l-7.7-7.7c-1.9-1.9-5.1-1.9-7 0-1.9 1.9-1.9 5.1 0 7l7.7 7.7zM23.2 50c0-2.7-2.2-4.9-4.9-4.9H7.4c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9h10.8c2.8 0 5-2.2 5-4.9zM24.1 68.9l-7.7 7.7c-1.9 1.9-1.9 5.1 0 7 1 1 2.2 1.4 3.5 1.4 1.3 0 2.5-.5 3.5-1.4l7.7-7.7c1.9-1.9 1.9-5.1 0-7-2-1.9-5.1-1.9-7 0zM50 76.8c-2.7 0-4.9 2.2-4.9 4.9v10.8c0 2.7 2.2 4.9 4.9 4.9s4.9-2.2 4.9-4.9V81.7c0-2.7-2.2-4.9-4.9-4.9zM75.9 68.9c-1.9-1.9-5.1-1.9-7 0-1.9 1.9-1.9 5.1 0 7l7.7 7.7c1 1 2.2 1.4 3.5 1.4s2.5-.5 3.5-1.4c1.9-1.9 1.9-5.1 0-7l-7.7-7.7zM92.6 45.1H81.7c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9h10.8c2.7 0 4.9-2.2 4.9-4.9s-2.1-4.9-4.8-4.9zM72.4 32.5c1.3 0 2.5-.5 3.5-1.4l7.7-7.7c1.9-1.9 1.9-5.1 0-7-1.9-1.9-5.1-1.9-7 0l-7.7 7.7c-1.9 1.9-1.9 5.1 0 7 1 .9 2.3 1.4 3.5 1.4z"/>
                </svg>
            </span>
            <label :for="`${period}-sunny`" class="label">Aberto</label>
        </div>
        <!-- cloudy -->
        <div class="ctn-input ctn-cloudy">
            <input type="radio" :name="name" :id="`${period}-cloudy`" value="cloudy" v-model="modelValueClimate">
            <span class="icon" style="padding:2px">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40">
                    <path d="M28 17a4.987 4.987 0 00-5.26-4.99 7.99 7.99 0 00-15.56.34A4.996 4.996 0 009 22h1.03a3 3 0 00-.03.43A3.572 3.572 0 0013.57 26h9a3.572 3.572 0 003.57-3.57 3.342 3.342 0 00-.27-1.34A4.979 4.979 0 0028 17zm-3.86 5.43A1.573 1.573 0 0122.57 24h-9A1.58 1.58 0 0112 22.43a1.541 1.541 0 01.06-.43 1.578 1.578 0 011.51-1.14 1.834 1.834 0 01.42.06.996.996 0 00.82-.13.976.976 0 00.43-.71c0-.03.01-.05.01-.08a3.495 3.495 0 016.92 0c0 .02.01.04.01.06a1.015 1.015 0 00.76.85 1.538 1.538 0 011.1.98 1.401 1.401 0 01.1.54zm.49-2.91a2.595 2.595 0 00-.58-.34 5.494 5.494 0 00-10.58-.32 3.517 3.517 0 00-2.5 1.14H9a2.996 2.996 0 01-.7-5.91.98.98 0 00.75-.84 5.995 5.995 0 0111.9.03 1.02 1.02 0 00.44.71.99.99 0 00.82.13A3.097 3.097 0 0123 14a3.001 3.001 0 011.63 5.52z"/>
                </svg>
            </span>
            <label :for="`${period}-cloudy`" class="label">Nublado</label>
        </div>
        <!-- rainy -->
        <div class="ctn-input ctn-rainy">
            <input type="radio" :name="name" :id="`${period}-rainy`" value="rainy" v-model="modelValueClimate">
            <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125">
                    <path d="M46.114 19.696c3.304 0 6.696 1.151 9.637 3.701 5.284 4.583 5.569 13.541 5.531 13.892l-.005.005.002.006c.002 0 .003-.004.003-.011 3.145-2.979 6.805-7.75 12.999-7.976.148-.006.298-.008.447-.008 6.688 0 13.148 5.442 12.646 13.692-.315 5.171-4.499 10.489-9.709 11.443-2.297.421-4.891.534-7.576.534-3.147 0-6.42-.156-9.48-.156-6.331 0-13.979-.036-21.803-.036-7.204 0-14.557.03-21.171.146-.204.004-.404.005-.598.005-2.805 0-4.365-.445-4.438-3.186-.057-2.242 1.816-3.28 4.693-3.28.454 0 .932.026 1.431.077-.228-5.831 3.269-8.818 7.94-8.818 1.66 0 3.469.377 5.312 1.138-3.524-12.342 4.98-21.169 14.139-21.168m.001-7.599h-.004c-6.961 0-13.65 3.357-17.892 8.981-2.517 3.335-4.029 7.179-4.505 11.297-3.261.557-6.159 2.044-8.353 4.324a14.764 14.764 0 00-3.141 4.972c-2.004.702-3.393 1.755-4.313 2.7-1.947 1.997-2.978 4.686-2.905 7.572.138 5.293 3.1 7.865 4.854 8.927 2.423 1.466 4.989 1.664 7.181 1.664.237 0 .481-.002.732-.006 5.64-.099 12.325-.146 21.036-.146 4.114 0 8.178.009 12.027.02 3.474.008 6.772.016 9.775.016 1.427 0 2.914.037 4.488.075 1.63.04 3.314.081 4.992.081 3.699 0 6.458-.203 8.944-.658 8.395-1.538 15.389-9.645 15.925-18.456.355-5.803-1.568-11.251-5.416-15.341a20.414 20.414 0 00-15.537-6.399c-3.282.12-6.057.996-8.418 2.219-1.176-2.263-2.75-4.456-4.856-6.282-4.19-3.637-9.245-5.559-14.614-5.56M20.923 87.903a4.147 4.147 0 01-3.642-6.121l6.909-12.748a4.146 4.146 0 017.289 3.95L24.57 85.732a4.142 4.142 0 01-3.647 2.171M43.088 87.903a4.145 4.145 0 01-3.642-6.12l6.909-12.748a4.145 4.145 0 117.289 3.949l-6.909 12.748a4.142 4.142 0 01-3.647 2.171M65.253 87.903a4.144 4.144 0 01-3.642-6.121l6.909-12.748a4.146 4.146 0 017.289 3.95L68.9 85.732a4.144 4.144 0 01-3.647 2.171"/>
                </svg>
            </span>
            <label :for="`${period}-rainy`" class="label">Chuvoso</label>
        </div>
    </li>
</template>

<script>
import { computed } from 'vue'
import { randomID } from "@/Utils/index.js"

export default {
    name: 'row-climate',
    props:{
        title: String,
        period: String,
        climate: String
    },
    setup(props, { emit }){
        const modelValueClimate = computed({
            get: () => {
                return props.climate
            },
            set: value => {
                emit("event-set", { key: props.period, value })
            }
        })

        const name = `${ props.period }_${ randomID() }`

        return {
            modelValueClimate,
            name
        }
    }
}
</script>

<style lang="less" scoped>
    .row-climate{
        display: grid;
        grid-template-areas: "climate sunny cloudy rainy";
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto;
        column-gap: 20px;
        padding: 10px 20px;
        border-bottom: 1px dashed rgb(187, 187, 187);
        &:last-child{
            border:none;
        }
    } 

    .row-climate-title{
        grid-area: climate;
        width: 55px;
        font-size: 1.7em;
        align-self: center;
    }
    .ctn-sunny{
        grid-area: sunny;
    }
    .ctn-cloudy{
        grid-area: cloudy;
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
        .row-climate{
            grid-template-areas: 
                "climate climate climate"
                "sunny cloudy rainy";
            row-gap: 8px;
        } 
    }
    @media screen and (max-width: 450px) {
        .row-climate{
            grid-template-areas: 
                "climate sunny"
                "climate cloudy"
                "climaet rainy";

            grid-template-columns: auto 1fr     ;
        } 
    }
</style>