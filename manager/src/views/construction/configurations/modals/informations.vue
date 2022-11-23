<template>
    <Modal @close-modal="$emit('close-modal')">
        <p class="title">Editar infomações da obra</p>
        <!-- HR -->
        <hr>

        <wrapper-input id="name" label="Nome:" class="form_spacing_bottom">
            <input type="text" class="input" id="name" v-model="form.name" placeholder="Nome aqui...">
        </wrapper-input>

        <wrapper-input id="description" label="Descrição:" class="form_spacing_bottom">
            <textarea-autosize id="description" v-model="form.description" :minHeight="70" placeholder="Opcional..."/>
        </wrapper-input>

        <!-- HR -->
        <hr>

        <div class="container-error" v-show="cepState.error">
            <p class="msg">{{ cepState.error }}</p>
        </div>
        
        <div class="form_row">
            <!-- country -->
            <wrapper-input label="País:" id="country">
                <select id="country" disabled="true" class="select">
                    <option value="BR">Brasil</option>
                </select>
            </wrapper-input>

            <!-- cep -->
            <div>
                <form action="#" @submit.prevent="searchCEP"  class="form_row_flex" style="align-items: flex-end">
                    <!-- cep -->
                    <wrapper-input label="Cep:" id="cep" class="group-input-cep">
                        <input type="text" class="input input-cep" id="cep" v-model="form.cep" v-maska="'##.###-###'"> 
                    </wrapper-input>

                    <button 
                        type="submit"
                        class="button-search-cep text-medium" 
                        :class="{ 'active-loading': cepState.isLoading }"
                        :disabled="cepState.isLoading" >
                        <svg class="button-content" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        <span class="spinner-loading-button"></span>
                    </button>
                </form>
            </div>

            <!-- street -->
            <wrapper-input label="Rua:" id="street">
                <input type="text" class="input" id="street" v-model="form.street">
            </wrapper-input>

            <!-- number -->
            <wrapper-input label="Numero:" id="number">
                <input type="text" class="input" id="number" v-model="form.number">
            </wrapper-input>

            <!-- state -->
            <wrapper-input label="Estado:" id="state">
                <input type="text" class="input" id="state" v-model="form.state">
            </wrapper-input>

            <!-- city -->
            <wrapper-input label="Cidade:" id="city">
                <input type="text" class="input" id="city" v-model="form.city">
            </wrapper-input>

            <!-- neighborhood -->
            <wrapper-input label="Bairro:" id="neighborhood">
                <input type="text" class="input" id="neighborhood" v-model="form.neighborhood">
            </wrapper-input>
        </div>

        <!-- HR -->
        <hr>

        <div class="form_row">
            <wrapper-input id="start_date" label="Data de início planejada:">
                <input type="date" name="start_date" id="" class="input" v-model="form.planned_start_date">
            </wrapper-input>
            <wrapper-input id="end_date" label="Data de término planejada:">
                <input type="date" name="end_date" id="" class="input" v-model="form.planned_end_date">
            </wrapper-input>
        </div>

        <div class="form_row">
            <wrapper-input id="start_date" label="Data de início real:">
                <input type="date" name="start_date" id="" class="input" v-model="form.start_date">
            </wrapper-input>
            <wrapper-input id="end_date" label="Data de término real:">
                <input type="date" name="end_date" id="" class="input" v-model="form.end_date">
            </wrapper-input>
        </div>

        <!-- error msg -->
        <form-loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" />

        <!-- BTN SAVE ALTERATIONS -->
        <div class="wrapper-buttons">
            <button class="button button-second text-medium" style="margin-right: 16px" @click="$emit('close-modal')">Cancelar</button>
            <button class="button button-primary text-medium" @click="submit">salvar</button>
        </div>
    </Modal>
</template>

<script>
import { onMounted, reactive } from 'vue';
import * as cepPromise from 'cep-promise';
import axios from '@/services/api';
import { notify } from '@kyvg/vue3-notification';

export default {
    emits: ["set", "close-modal"],
    props: { construction: Object },
    setup( props, { emit }){
        const cepState = reactive({ isLoading: false, error: "" })
        const form = reactive({ 
            name: "", 
            description: "",
            country: "BR",
            cep: "",
            street: "",
            number: "",
            state: "",
            city: "",
            neighborhood: "",
            complement: "",
            planned_start_date: "",
            planned_end_date: "",
            start_date: "",
            end_date: ""
        })

        onMounted(() => {
            if(props.construction){
                form.id = props.construction.id 
                form.name = props.construction.name 
                form.description = props.construction.description
                form.country = props.construction.country
                form.cep = props.construction.cep
                form.street = props.construction.street
                form.number = props.construction.number
                form.state = props.construction.state
                form.city = props.construction.city
                form.neighborhood = props.construction.neighborhood
                form.complement = props.construction.complement
                form.planned_start_date = props.construction.planned_start_date
                form.planned_end_date = props.construction.planned_end_date
                form.start_date = props.construction.start_date
                form.end_date = props.construction.end_date
            }
        })

        const state = reactive({ errorMsg: "", isLoading: false })

        async function submit(){
            if(!form.name)
                return state.errorMsg = "Nome é obrigatório";

            state.isLoading = true;
            state.errorMsg = "";

            try {
                const { data } = await axios.put("/constructions", form)

                emit("set", data);
                emit("close-modal");

                notify({
                    title: "Alterações realizadas!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                state.errorMsg = error;
            } finally {
                state.isLoading = false;
            }
        }


        function searchCEP(){
            if(!form.cep) return cepState.error = "Cep é necessário"

            cepState.error = ""
            cepState.isLoading = true;

            cepPromise(form.cep)
                .then( response => {
                    form.city = response.city
                    form.neighborhood = response.neighborhood
                    form.state = response.state
                    form.street = response.street
                })
                .catch( error => {
                    console.error(error.message)
                    cepState.error = error.message
                })
                .finally(() => cepState.isLoading = false)
        }

        return {
            cepState,
            searchCEP,
            state,
            form,
            submit
        }
    }
}
</script>
<style lang="less" scoped>
    .title{
        font-size: 2em;
        line-height: 1em;
        font-weight: bold;
        color: rgb(0, 0, 0);
    }
    hr{
        border: none;
        border-bottom: dashed 1px rgb(202, 202, 202);
        margin: 16px 0;
    }

    @padding-left: 8px;
    .group-input-cep{
        width: calc(100% - 42px - @padding-left)
    }
    .button-search-cep{
        width: 42px;
        height: 42px;

        border: none;
        font-size: 1.7em;
        background-color: #f70;

        border-radius: 5px;

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        &:disabled{
            background-color: rgb(197, 133, 76);
        }
    }
    .wrapper-buttons{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-top: 24px;

        .button{
            width: auto;
            min-width: 120px;
            padding: 0 6px;
            height: 40px;
        }
    }
</style>