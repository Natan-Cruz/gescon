<template>
    <div style="position: relative">
        <div class="wrapper wrapper-climate">
            <div class="background-disabled" v-if="wasClosed"></div>
            <!-- CLIMATES -->
            <ul v-if="state.renderComponent">
                <row-climate title="Manhã" period="climate_morning" :climate="climate_morning" @event-set="handleSetClimate"/>
                <row-climate title="Tarde" period="climate_afternoon" :climate="climate_afternoon" @event-set="handleSetClimate"/>
                <row-climate title="Noite" period="climate_night" :climate="climate_night" @event-set="handleSetClimate"/>
            </ul>
        </div>

        <form-loading-or-error :isLoading="state.isLoading" :error="state.error"></form-loading-or-error>

        <!-- BTN SAVE ALTERATIONS -->
        <div class="wrapper-buttons" v-if="state.showButton">
            <button class="button button-second text-medium" @click="cancel"  :disabled="state.isLoading">Cancelar</button>
            <button class="button button-primary text-medium" @click="saveClimate"  :disabled="state.isLoading">{{ textContentButton }}</button>
        </div>
    </div>
</template>

<script>
import rowClimate from "./rowClimate";

import axios from "@/services/api"
import { notify } from "@kyvg/vue3-notification";
import { computed, nextTick, reactive } from 'vue';

export default {
    name: "wrapper-climate",
    components: { rowClimate },
    props:{
        wasClosed: Boolean,
        construction_id: String,
        report_id: String,
        climate_morning: String,
        climate_afternoon: String,
        climate_night: String,
    },
    setup(props){
        const state = reactive({ alterations: new Map(), showButton: false, renderComponent: true, errorMsg: "", isLoading: false })
        const textContentButton = computed( () => state.isLoading ? "Carregando..." : "Salvar clima" )

        function handleSetClimate({ key ,value }){
            state.alterations.set( key, value );
            state.showButton = state.alterations.size
        }

        async function saveClimate(){
            const url = `/constructions/${ props.construction_id }/reports/${ props.report_id }`,
                body = {}

            for(const [key, value] of state.alterations){
                body[key] = value
            }

            state.isLoading = true;
            state.errorMsg = "";

            try {
                await axios.put(url, body)
                state.alterations.clear()
                state.showButton = state.alterations.size
                notify({
                    title: "Clima salvo com sucesso!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                console.error(error)
                state.errorMsg = error
            }finally{
                state.isLoading = false
            }
        }

        function forceRerender () {
            // remove the my-component component from the DOM
            state.renderComponent = false;
            nextTick(() => {
                // add my-component component in DOM
                state.renderComponent = true;
            });
        }

        function cancel(){
            state.alterations.clear()
            state.showButton = state.alterations.size
            forceRerender()
        }

        return {
            state,
            textContentButton,
            handleSetClimate,
            saveClimate,
            forceRerender,
            cancel
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper-climate{
        position: relative;
        margin-bottom: 12px;
    }

    .wrapper-buttons{
        margin-bottom: 12px;
    }
    .button:first-child{
        margin-right: 24px;
    }
</style>