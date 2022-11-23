<template>

    <div class="container-error" v-show="cepState.error">
        <p class="msg">{{ cepState.error }}</p>
    </div>

    <div class="form_row">
        <wrapper-input label="País:" id="country">
            <select id="country" disabled="true" class="select">
                <option value="BR">Brasil</option>
            </select>
        </wrapper-input>

        <!-- cep -->
        <div>
            <form action="#" @submit.prevent="searchCEP"  class="form_row_flex" style="align-items: flex-end">

                <wrapper-input label="Cep:" :id="uuid + 'cep'" class="group-input-cep" :error="error_cep" :class="{ 'group-input-cep-disabled': disabled }">
                    <input type="text" class="input input-cep" :id="uuid + 'cep'" :value="cep" @input="$emit('update:cep', $event.target.value)" v-maska="'##.###-###'" :disabled="disabled"> 
                </wrapper-input>

                <button 
                    v-show="!disabled"
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
        <wrapper-input label="Rua:" :id="uuid + 'street'" :error="error_street">
            <input type="text" class="input" :id="uuid + 'street'" :value="street" @input="$emit('update:street', $event.target.value)" :disabled="disabled">
        </wrapper-input>

        <!-- number -->
        <wrapper-input v-if="show_number" label="Numero:" :id="uuid + 'number'" :error="error_number">
            <input type="text" class="input" :id="uuid + 'number'" :value="number" @input="$emit('update:number', $event.target.value)" :disabled="disabled">
        </wrapper-input>

        <!-- state -->
        <wrapper-input label="Estado:" :id="uuid + 'state'" :error="error_state">
            <input type="text" class="input" :id="uuid + 'state'" :value="state" @input="$emit('update:state', $event.target.value)" :disabled="disabled">
        </wrapper-input>

        <!-- city -->
        <wrapper-input label="Cidade:" :id="uuid + 'city'" :error="error_city">
            <input type="text" class="input" :id="uuid + 'city'" :value="city" @input="$emit('update:city', $event.target.value)" :disabled="disabled">
        </wrapper-input>

        <!-- neighborhood -->
        <wrapper-input label="Bairro:" :id="uuid + 'neighborhood'" :error="error_neighborhood">
            <input type="text" class="input" :id="uuid + 'neighborhood'" :value="neighborhood" @input="$emit('update:neighborhood', $event.target.value)" :disabled="disabled">
        </wrapper-input>

        <!-- complement -->
        <wrapper-input v-if="show_complement" label="Complemento:" :id="uuid + 'complement'" :error="error_complement">
            <input type="text" class="input" :id="uuid + 'complement'" :value="complement" @input="$emit('update:complement', $event.target.value)" :disabled="disabled">
        </wrapper-input>
    </div>
</template>

<script>
import * as cepPromise from 'cep-promise';
import { reactive } from 'vue';

export default {
    emits: [ "update", "update:cep", "update:street", "update:number", "update:state", "update:city", "update:neighborhood", "update:complement"],
    props: {
        show_number: { type: Boolean, required: false, default: () => true },
        show_complement: { type: Boolean, required: false, default: () => true },
        error_cep: { type: String, required: false, default: "" },
        error_street: { type: String, required: false, default: "" },
        error_state: { type: String, required: false, default: "" },
        error_city: { type: String, required: false, default: "" },
        error_number: { type: String, required: false, default: "" },
        error_neighborhood: { type: String, required: false, default: "" },
        error_complement: { type: String, required: false, default: "" },
        cep: { type: String },
        street: { type: String },
        number: { type: String },
        state: { type: String },
        city: { type: String },
        neighborhood: { type: String },
        complement: { type: String },
        disabled: { type: Boolean, required: false, default: () => false }
    },
    setup(props, { emit }){
        const cepState = reactive({ isLoading: false, error: "" });
        const uuid = Math.trunc(Math.random() * 1000)

        function searchCEP(){
            if(!props.cep) return cepState.error = "Cep é necessário"

            cepState.error = ""
            cepState.isLoading = true;

            cepPromise(props.cep)
                .then( response => {
                    emit("update:city", response.city)
                    emit("update:neighborhood", response.neighborhood)
                    emit("update:state", response.state)
                    emit("update:street", response.street)
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
            uuid
        }
    }
}
</script>

<style lang="less" scoped>
    @padding-left: 8px;
    .group-input-cep{
        width: calc(100% - 42px - @padding-left)
    }
    .group-input-cep-disabled{
        width: 100%;
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
</style>