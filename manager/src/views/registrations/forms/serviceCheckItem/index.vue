<template>
    <form-page linkBack="/main/services-sheet" :config="config">

        <wrapper-input label="Nome" class="form_spacing_bottom" :error="errors.name">
            <input type="text" class="input" v-model="form.name" placeholder="Nome aqui..." :disabled="disabled">
        </wrapper-input>

        <wrapper-input label="Método de checagem" class="form_spacing_bottom" :error="errors.check_method">
            <textarea-autosize v-model="form.check_method" :minHeight="80" placeholder="Descreva o método de checagem aqui..." :disabled="disabled" />
        </wrapper-input>

        <wrapper-input label="Alguma anotação?" class="form_spacing_bottom">
            <textarea-autosize v-model="form.anotations" :minHeight="80" placeholder="A descreva aqui..." :disabled="disabled" />
        </wrapper-input>

        <template v-if="form.problem_description || form.corretive_actions">
            <hr class="hr-form form_spacing_bottom"/>

            <wrapper-input label="Descrição do problema" class="form_spacing_bottom">
                <textarea-autosize v-model="form.problem_description" :minHeight="80" :disabled="disabled" />
            </wrapper-input>
            <wrapper-input label="Ações corretivas" class="form_spacing_bottom">
                <textarea-autosize v-model="form.corretive_actions" :minHeight="80" :disabled="disabled" />
            </wrapper-input>
        </template>

        <hr class="hr-form form_spacing_bottom"/>
    
        <wrapper-attachments v-if="hasData" class="form_spacing_bottom" 
            v-model="form.attachments" 
            :id="$route.params.id" 
            :disabled="disabled"/>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import wrapperAttachments from "@/components/wrapperAttachments/index.vue"

import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia" 
import { useRoute } from "vue-router"

export default {
    components: { formPage, wrapperAttachments },
    setup(){
        const store = useStore();
        store.resetState()
        const $route = useRoute();

        const { form, errors, editMode, hasData } = storeToRefs(store);

        const config = {
            urls: {
                fetch: "/services/check-items/?",
                create: "/services/check-items",
                edit: "/services/check-items",
                delete: ""
            },
            reqHeaders: {
                fileFullPath: "",
                newPathLtree: "",
                rootPathLtree: `${ $route.query.construction_id }._REPORT_`,
                reference_table: "construction_scheme.service_check_item_attachments",
                reference_key: "service_check_item_id",
            },
            rules: {
                name: { required: true },
                check_method: { required: true }
            }
        }

        function storeDefault(){
            store.$patch( state => {
                state.form.service_id = $route.params.service_id;
            })
        }
        storeDefault()

        store.setDefault(storeDefault)

        return {
            disabled: editMode,
            config,
            form,
            errors,
            hasData
        }
    }
}
</script>