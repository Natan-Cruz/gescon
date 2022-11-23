<template>
    <form-page :linkBack="`/constructions/${ $route.params.constructionID }/occurrences`" :config="config">

        <wrapper-input label="Titulo" class="form_spacing_bottom" :error="errors.title">
            <input type="text" class="input" placeholder="Opcional..." v-model="form.title" :disabled="disabled">
        </wrapper-input>
        <!-- Descricao -->
        <wrapper-input label="Descrição" class="form_spacing_bottom">
            <textarea-autosize
                class="textarea"
                placeholder="Descreva a ocorrência... 🖊️"
                v-model="form.description"
                :min-height="120"
                :max-height="1000"
                :disabled="disabled" />
        </wrapper-input>
        
        <div class="form_row">
            <wrapper-input label="Local" :error="errors.tree_structure_id">
                <input-suggest-tree
                    url="/financial/cost-center"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione um centro de custo"
                    v-model="form.tree_structure_id"
                    :disabled="disabled">
                </input-suggest-tree>
            </wrapper-input>

            <wrapper-input label="Em qual obra?" :error="errors.construction_id">
                <input-suggest-list
                    url="/constructions"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione uma obra" v-model="form.construction_id" :disabled="disabled" >
                </input-suggest-list>
            </wrapper-input>
        </div>

        <wrapper-input label="Dados meteorológicos" class="form_spacing_bottom">
            <wrapper-weather-data v-model:weather_data="form.weather_data" :construction_id="form.construction_id" :disabled="disabled"/>
        </wrapper-input>

        <wrapper-input label="Gravidade da ocorrência" class="form_spacing_bottom">
            <wrapper-severity :severity="form.severity" @event-select-severity-occurrence="form.severity = $event" :disabled="disabled"/>
        </wrapper-input>

        <wrapper-input label="Escopo da ocorrência" class="form_spacing_bottom">
            <wrapper-scope :scope="form.scope" @set="form.scope = $event" :disabled="disabled"/>
        </wrapper-input>

        <wrapper-input v-if="form.scope === 'external'" label="Relacionar com tercerizados" class="form_spacing_bottom" >
            <input-suggest-list-group
                url="/registrations/entities-contacts"
                :options="{ key: 'id', displayName: ['? - ?', 'contact_person', 'email'], multi_select: true }"
                :url_search="false"
                placeholder="Selecione os fornecedores" v-model="form.entities" :disabled="disabled" />
        </wrapper-input>

        <wrapper-attachments class="form_spacing_bottom" 
            v-model="form.attachments" 
            :id="$route.params.id" 
            :disabled="disabled"/>

        <wrapper-status v-if="store.data.status" :status="store.data.status"/>

        <wrapper-actions v-if="store.data.status" :status="store.data.status" :disabled="disabled"/>

    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import { useStore } from "@/components/formPage/store.js"
import inputSuggestTree from "@/components/inputSuggest/inputSuggestTree.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue";
import inputSuggestListGroup from "@/components/inputSuggest/inputSuggestListGroup.vue";

import wrapperWeatherData from "./wrappers/wrapperWeatherData/index.vue";
import wrapperSeverity from "./wrappers/wrapperSeverity/index.vue";
import wrapperAttachments from "@/components/wrapperAttachments/index.vue";
import wrapperStatus from "./wrappers/wrapperStatus/index.vue";
import wrapperActions from "./wrappers/wrapperActions"
import wrapperScope from "./wrappers/wrapperScope/index"

import { storeToRefs } from 'pinia';
import { useRoute } from "vue-router" 
import { computed } from "vue"

export default {
    components:{
        formPage,
        inputSuggestTree,
        inputSuggestList,
        inputSuggestListGroup,
        // 
        wrapperScope,
        wrapperSeverity,
        wrapperAttachments,
        wrapperWeatherData,
        wrapperActions,
        wrapperStatus,
    },
    setup(){
        const store = useStore();
        store.resetState()
        const $route = useRoute()

        const { form, errors, editMode } = storeToRefs(store)

        const config = computed(() => ({
            urls: {
                fetch: "/constructions/occurrences/?",
                create: "/constructions/occurrences",
                edit: "/constructions/occurrences",
                delete: "/constructions/occurrences"
            },
            reqHeaders: {
                newPathLtree: "",
                rootPathLtree: `${ form.value.construction_id }._OCCR_`,
                reference_table: "construction_scheme.occurrence_attachments",
                reference_key: "occurrence_id"
            },
            rules: {
                title: { required: true },
                construction_id: { required:true }
            }
        }))

        function storeDefault(){
            const { construction_id, tree_structure_id } = $route.query;

            store.$patch( state => {
                state.form.construction_id = construction_id || ""
                state.form.tree_structure_id = tree_structure_id || "";
                state.form.attachments = []
                state.form.entities = []
            })
        }
        storeDefault()

        store.setDefault(storeDefault)

        return {
            store,
            form,
            errors,
            config,
            disabled: editMode,
        }
    }
}
</script>