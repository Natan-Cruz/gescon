<template>
    <div class="wrapper-weather-data">

        <div class="container-error" v-if="state.hasError">
            <p class="msg">Occoreu um problema, por favor tente novamente!</p>
        </div>

        <button v-if="!weather_data" class="button-add-weather-data" @click="getWeatherData" :disabled="disabled">
            <span class="text" >{{ state.isLoading ? "Carregando..." : "+ Adicionar" }}</span>
        </button>

        <div class="_ctn_" v-else>

            <p class="weather-data-text">{{ weather_data }}</p>

            <button class="btn-remove" @click="handleResetData" v-show="!disabled">
                <svg xmlns="http://www.w3.org/2000/svg" width="14.258" height="14.258" viewBox="0 0 14.258 14.258">
                    <path d="M21.758,8.936,20.322,7.5l-5.693,5.693L8.936,7.5,7.5,8.936l5.693,5.693L7.5,20.322l1.436,1.436,5.693-5.693,5.693,5.693,1.436-1.436-5.693-5.693Z" transform="translate(-7.5 -7.5)">
                    </path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
import { reactive, computed } from 'vue'
import axios from "@/services/api"

export default {
    emits: ["update:weather_data"],
    name: "wrapper-wheather-data",
    props: {
        weather_data: String,
        construction_id: String,
        disabled: Boolean
    },
    setup(props, { emit }){
        const state = reactive({ isLoading: false, hasError: false })
        const mWeatherData = computed({
            get: () => props.weather_data,
            set: weather_data => emit("update:weather_data", weather_data)
        })

        async function getWeatherData(){
            state.isLoading = true;
            state.hasError = false

            const url = `/constructions/${ props.construction_id }/occurrences/weather-data`;

            try {
                const { data } = await axios.get(url);
                const weatherDataFormated = formatWeatherData(data);
                mWeatherData.value = weatherDataFormated;
            } catch (error) {
                state.hasError = true;
                state.text = "Tentar novamente";
            } finally {
                state.isLoading = false;
            }
        }
        function handleResetData(){
            mWeatherData.value = ""
        }
        function formatWeatherData({ time, description, humidity, wind_speedy }){
            return `Hora: ${ time }; descrição: ${ description }; humidade: ${ humidity }"%"; velocidade do vento: ${ wind_speedy }`
        }

        return {
            state,
            // methods //
            getWeatherData,
            handleResetData
        }
    }
}

</script>

<style lang="less" scoped>
    ._ctn_{
        width: 100%;
        height: auto;
        border: 1px solid rgba(165, 165, 165, 0.5);
        border-radius: 5px;
        padding: 10px;
        position: relative;
    }
    .button-add-weather-data{
        width: auto;
        height: auto;
        padding: 8px 16px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        .text{
            font-size: 1.7em;
        }
    }

    .weather-data-text{
        font-size: 1.8em;
        color: rgb(92, 92, 92);
    }

    .btn-remove{
        width: 30px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background-color: #fff;
        border-radius: 50%;
        padding: 7px;
        cursor: pointer;
        border: none;
        svg{
            width: 16px;
            height: 16px;
        }
    }
</style>