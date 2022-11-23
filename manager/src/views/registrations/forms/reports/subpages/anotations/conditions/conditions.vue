<template>
    <div style="position: relative">
        <div class="wrapper wrapper-climate">
            <div class="background-disabled" v-if="wasClosed"></div>
            <!-- CLIMATES -->
            <ul v-if="state.renderComponent">
                <row-condition title="Manhã" period="condition_morning" :condition="condition_morning" @event-set="handleSetCondition"/>
                <row-condition title="Tarde" period="condition_afternoon" :condition="condition_afternoon" @event-set="handleSetCondition"/>
                <row-condition title="Noite" period="condition_night" :condition="condition_night" @event-set="handleSetCondition"/>
            </ul>
        </div>

        <form-loading-or-error :isLoading="state.isLoading" :error="state.error"></form-loading-or-error>

        <!-- BTN SAVE ALTERATIONS -->
        <div class="wrapper-buttons" v-if="state.showButton">
            <button class="button button-second text-medium" @click="cancel"  :disabled="state.isLoading">Cancelar</button>
            <button class="button button-primary text-medium" @click="saveConditions"  :disabled="state.isLoading">{{ textContentButton }}</button>
        </div>
    </div>
</template>

<script>
import rowCondition from "./rowCondition.vue";

import axios from "@/services/api"
import { notify } from "@kyvg/vue3-notification";
import { computed, nextTick, reactive } from 'vue';

export default {
    name: "wrapper-climate",
    components: { rowCondition },
    props:{
        wasClosed: Boolean,
        construction_id: String,
        report_id: String,
        condition_morning: String,
        condition_afternoon: String,
        condition_night: String
    },
    setup(props){
        const state = reactive({ alterations: new Map(), showButton: false, renderComponent: true, error: "", isLoading: false })
        const textContentButton = computed( () => state.isLoading ? "Carregando..." : "Salvar condições" )

        function handleSetCondition({ key ,value }){
            state.alterations.set( key, value );
            state.showButton = state.alterations.size
        }

        async function saveConditions(){
            const url = `/constructions/${ props.construction_id }/reports/${ props.report_id }`,
                body = {}

            for(const [key, value] of state.alterations){
                body[key] = value
            }

            state.isLoading = true;
            state.error = "";

            try {
                await axios.put(url, body)
                state.alterations.clear()
                state.showButton = state.alterations.size
                notify({
                    title: "Condições salvo com sucesso!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                console.error(error)
                state.error = error
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
            handleSetCondition,
            saveConditions,
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