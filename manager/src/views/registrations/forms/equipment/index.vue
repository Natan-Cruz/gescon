<template>
    <form-page linkBack="/main/equipments" :config="config">
        <div class="form_row">
            <wrapper-input id="name" label="Nome:">
                <input type="text" class="input" id="name" :disabled="disabled" v-model="form.name" placeholder="Nome do equipamento ou ferramenta...">
            </wrapper-input>
            <template v-if="!hasData">
                <wrapper-input label="Quantidade:">
                    <input type="number" class="input" id="fullname" :disabled="disabled" v-model="form.quantity">
                </wrapper-input>
                <div class="container-alert" v-show="(form.quantity > 1)">
                    <p class="msg">Será adicinado {{ form.quantity }} equipamentos, porém estarão agrupados</p>
                </div>
            </template>
        </div>

        <hr class="hr-form">

        <div class="form_spacing_bottom">
            <toggle label="É alugado?" :value="form.origin === 'rented'" @toggle="form.origin = $event ?  'rented' : 'own' " ></toggle>
        </div>

        <template v-if="form.origin === 'rented'">
            <wrapper-input label="Fornecedor(Opcional):" style="margin-bottom: 6px">
                <input-suggest-list
                    url="/registrations/service-provider"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione um fornecedor" v-model="entity_id" :disabled="disabled" />
            </wrapper-input>
            <router-link :to="{ name: 'registrations/material_sheet_form', query: { previous: $route.fullPath }}" class="button button-tertiary text-medium form_spacing_bottom">Cadastrar novo fornecedor</router-link>

            <div class="form_row">
                <wrapper-input label="Data de contratação:">
                    <input type="date" class="input" id="name" :disabled="disabled">
                </wrapper-input>
                <wrapper-input label="Data de devolução:">
                    <input type="date" class="input" id="name" :disabled="disabled">
                </wrapper-input>
            </div>

            <hr class="hr-form">
        </template>

        <wrapper-input :label="`Em qual obra o equipamento Nº${i} está alocado? (Opcional)`" class="form_spacing_bottom" v-for="i in form.quantity" :key="i">
            <input-suggest-list
                url="/constructions"
                :options="{ key: 'id', displayName: 'name'}"
                placeholder="Selecione uma obra" v-model="form.construction_id[i - 1]" :disabled="disabled" />
        </wrapper-input>

        <wrapper-attachments class="form_spacing_bottom" 
            v-model="attachments" 
            :id="$route.params.id" 
            :disabled="disabled"/>
            
        <hr class="hr-form">

        <wrapper-maintenance v-if="hasData" :maintenances="form.maintenances" :disabled="disabled" @select-item="handleAddMaintenance"></wrapper-maintenance>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import { useStore } from "@/components/formPage/store.js"

import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import toggle from "@/components/toggle/toggle.vue"

import wrapperAttachments from "@/components/wrapperAttachments/index.vue"
import wrapperMaintenance from "./wrapperMaintenance/index.vue"

import { storeToRefs } from "pinia";
import { ref, computed, toRef } from 'vue';
import { useRoute, useRouter } from "vue-router"

export default {
    components: { formPage, wrapperAttachments, wrapperMaintenance, inputSuggestList, toggle },
    setup(){
        const store = useStore();
        store.resetState()
        const $route = useRoute();
        const $router = useRouter();
        const isRented = ref(true);

        const construction_id = toRef(store.form, "construction_id")
        const config = computed(() => ({
            urls: {
                fetch: "/registrations/equipments/e/?",
                create: "/registrations/equipments",
                edit: "/registrations/equipments",
                delete: "/registrations/equipments"
            },
            reqHeaders: {
                rootPathLtree: `${ construction_id.value }._EQUIP_`,
                reference_table: "equipment_scheme.equipment_attachments",
                reference_key: "equipment_id",
            }
        }))

        store.$patch( state => {
            state.form.origin = "own"
            state.form.quantity = 1;
            state.form.construction_id = []
        })

        const { editMode, hasData } = storeToRefs(store);

        function handleAddMaintenance(id){
            $router.push({ 
                name: "registrations/form_equipment_maintenance", 
                params: { 
                    equipment_id: $route.params.id, id 
                }, 
                query: { 
                    previous: $route.fullPath, 
                    forceBack: true 
                }
            })
        }

        return {
            config,
            disabled: editMode,
            hasData,
            isRented,
            form: store.form,
            // methods
            handleAddMaintenance
        }
    }
}
</script>

<style lang="less" scoped>
    .button{
        width: 180px;
        height: 42px;
    }
    .without-item{
        font-size: 1.7em;
        padding: 16px 0;
        margin: 10px 0;
        color: rgb(78, 78, 78);
    }

    .button-tertiary{
        width: max-content;
        height: 30px;
    }

    .container-alert{
        width: 100%;
        height: auto;
        background-color: #fce74a;
        padding: 10px;
        margin-top: 8px;
        .msg{
            font-size: 1.7em;
            color: #746600
        }
    }
    :deep(.button-add){
        width: auto;
        height: auto;
        margin-bottom: 16px;

        padding: 12px;
    }
    :deep(.title_2){
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 12px;
    }
     :deep(.without-item){
        font-size: 1.7em;
        padding: 16px 0;
        margin: 10px 0;
        color: rgb(78, 78, 78);
        text-align: center;
    }
</style>