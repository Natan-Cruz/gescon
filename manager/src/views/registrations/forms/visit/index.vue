<template>
    <form-page linkBack="/main/visits" :config="config">

        <div class="form_row">
            <wrapper-input id="name" label="Nome:" :error="errors.name">
                <input type="text" class="input input_error" id="name" v-model="form.name" placeholder="Nome aqui..." :disabled="disabled">
            </wrapper-input>

            <wrapper-input id="company" label="Empresa:">
                <input type="text" class="input" id="company" v-model="form.company" placeholder="Empresa aqui...(Opcional)" :disabled="disabled">
            </wrapper-input>
        </div>

        <wrapper-input id="reasons" label="Motivos:" class="form_spacing_bottom">
            <textarea-autosize v-model="form.reasons" :minHeight="70" placeholder="Motivo da visita aqui..." :disabled="disabled"/>
        </wrapper-input>

        <div class="form_row">
            <wrapper-input id="period" label="Período:" :error="errors.period">
                <select class="select input_error" v-model="form.period" :disabled="disabled">
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                </select>
            </wrapper-input>

            <wrapper-input id="date" label="Data da visita:" :error="errors.date">
                <input type="date" class="input input_error" id="date" v-model="form.date" :disabled="disabled">
            </wrapper-input>

            <wrapper-input label="Em qual obra?" :error="errors.construction_id">
                <input-suggest-list
                    url="/constructions"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione uma obra" v-model="form.construction_id" :disabled="disabled" >
                </input-suggest-list>
            </wrapper-input>
        </div>

        <hr class="hr-form">

        <wrapper-attachments class="form_spacing_bottom" 
            v-model="form.attachments" 
            :id="$route.params.id" 
            :disabled="disabled"/>
       
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue";
import { useStore } from "@/components/formPage/store.js";

import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue";
import wrapperAttachments from "@/components/wrapperAttachments/index.vue";

import { storeToRefs } from "pinia";
import { computed } from 'vue';
import { useRoute } from "vue-router";
import dayjs from "dayjs";

export default {
    components: { formPage, wrapperAttachments, inputSuggestList },
    setup(){
        const store = useStore();
        store.resetState()
        const $route = useRoute();

        const { form, errors, editMode } = storeToRefs(store);

        const config = computed(() => ({
            urls: {
                fetch: "/registrations/visits/?",
                create: "/registrations/visits",
                edit: "/registrations/visits",
                delete: "",
            },
            reqHeaders: {
                fileFullPath: "",
                newPathLtree: "",
                rootPathLtree: `${ form.value.constructionId }._EQUIP_`,
                reference_table: "construction_scheme.visit_attachments",
                reference_key: "visit_id",
            },
            rules: {
                name: { required: true },
                period: { required: true },
                date: { required: true },
                construction_id: { required: true },
            }
        }))

        function storeDefault(){
            store.$patch( state => {
                state.form.construction_id = $route.query.construction_id || "";
                state.form.period = "Manhã";
                state.form.date = dayjs().format("YYYY-MM-DD")
            })  
        }
        storeDefault()
        store.setDefault(storeDefault)
        
        return {
            config,
            form,
            errors,
            disabled: editMode,
        }
    }
}
</script>