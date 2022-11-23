<template>
    <Modal @close-modal="$emit('close-modal')">
        <p class="title">Cadastrar nova obra</p>
        <!-- HR -->
        <hr>

        <wrapper-input id="name" label="Nome da obra:" class="form_spacing_bottom" :error="state.error_title">
            <input type="text" class="input" id="name" v-model="form.name" placeholder="Nome aqui...">
        </wrapper-input>
        

        <wrapper-input label="Membros">
            <input-suggest-list
                url="/users/admin"
                :options="{ key: 'id', displayName: ['? ? - ?', 'first_name', 'last_name', 'title' ], multi_select: true }"
                :url_search="false"
                placeholder="Selecione um usuário"
                v-model="form.members" />
        </wrapper-input>

        <!-- HR -->
        <hr>

        <address-component
            v-model:cep="form.cep"
            v-model:street="form.street"
            v-model:state="form.state"
            v-model:city="form.city"
            v-model:number="form.number"
            v-model:neighborhood="form.neighborhood" />

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

        <form-loading-or-error :isLoading="state.isLoading" :error="state.error" />

        <!-- BTN SAVE ALTERATIONS -->
        <div class="wrapper-buttons">
            <button class="button button-second text-medium" style="margin-right: 16px" @click="$emit('close-modal')">Cancelar</button>
            <button class="button button-primary text-medium" @click="submit">salvar</button>
        </div>
    </Modal>
</template>

<script>
import addressComponent from "@/components/addressComponent.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"

import { reactive } from 'vue';
import axios from '@/services/api';

export default {
    components: { addressComponent, inputSuggestList },
    emits: ["set", "close-modal"],
    setup( _, { emit }){
        const form = reactive({})
        const state = reactive({ error: "", isLoading: false, error_title: "" })

        async function submit(){
            if(!form.name)
                return state.error_title = "Preencha este campo";

            state.isLoading = true;
            state.error = "";

            try {
                await axios.post("/constructions", form)

                emit("close-modal");
                emit("refresh-constructions");
            } catch (error) {
                state.error = error;
            } finally {
                state.isLoading = false;
            }
        }


        return {
            state,
            form,
            // methods
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