<template>
    <div style="position:relative">
        <form-loading-or-error :isLoading="state.isLoading" :error="state.error"></form-loading-or-error>

        <button class="button-add-weather-data" :disabled="state.isLoading || wasClosed" @click="getWeatherDate">
            <span class="text" v-if="state.isLoading">Carregando...</span>
            <span class="text" v-else>{{ state.text }}</span>        
        </button>

        <textarea-autosize 
            v-model="cmp_anotations" 
            :minHeight="80"
            :maxLength="255"
            placeholder="Anote aqui...." :disabled="wasClosed"/>
            
        <div class="wrapper-buttons" v-show="state.showButton">
            <button class="button button-primary text-medium" @click="save">Salvar</button>
        </div>
    </div>
</template>

<script>
import { computed, reactive, watch } from 'vue';
import axios from "@/services/api"
import { notify } from '@kyvg/vue3-notification';

export default {
    props: {
        anotations: String,
        wasClosed: Boolean,
        construction_id: String,
        report_id: String
    },
    setup(props){
        const state = reactive({ isLoading: false, error: "", text: "+ Adicionar meteorologia", anotations: "", showButton: false })
      
        // computed_anotations
        const cmp_anotations = computed({
            get: () => state.anotations || props.anotations,
            set: anotations => state.anotations = anotations
        })

        async function getWeatherDate(){
            state.isLoading = true;
            state.error = ""

            const url = `/constructions/${ props.construction_id }/occurrences/weather-data`;

            try {
                const { data } = await axios.get(url)
                state.anotations += formatWeatherData(data)
            } catch (error) {
                console.error(error)
                state.error = error;
            }finally{
                state.isLoading = false
            }
        }

        async function save(){
            const url = `/constructions/${ props.construction_id }/reports/${ props.report_id }`
            try {
                await axios.put(url, { anotations: state.anotations })
                notify({
                    title: "Informação salva!!",
                    type: "success",
                    duration: 5000
                })
                state.showButton = false;
            } catch (error) {
                console.error(error)
                notify({
                    title: "Erro ao salver informação, tente novamente!!",
                    type: "error",
                    duration: 5000
                })
            }
        }
      
        function formatWeatherData({ time, description, humidity, wind_speedy }){
            return `Hora: ${ time }; descrição: ${ description }; humidade: ${ humidity }"%"; velocidade do vento: ${ wind_speedy }`
        }

        watch(() => state.anotations, anotations => {
            if((props.anotations === null && anotations === "") || props.anotations === anotations) 
                return state.showButton = false
            else
                state.showButton = true
        })

        return {
            state,
            cmp_anotations,
            getWeatherDate,
            save
        }
    }
}
</script>

<style lang="less" scoped>
    .button-add-weather-data{
        width: auto;
        height: 36px;
        border-radius: 5px;
        padding: 0 10px;
        border: none;
        cursor: pointer;
        margin: 12px 0;
        .text{
            font-size: 1.7em;
        }
    }
</style>