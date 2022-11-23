<template>
    <form-page linkBack="/main/equipments" :config="config" @loaded="onLoaded">
    
        <wrapper-input id="fullname" label="Nome completo:" class="form_spacing_bottom" :error="errors.fullname">
            <input type="text" class="input input_error" id="fullname" v-model="form.fullname" placeholder="Nome completo..." :disabled="disabled">
        </wrapper-input>

        <checkbox class="form_spacing_bottom" v-model="isOutsourced" label="É terceirizado?" :disabled="disabled"/>

        <div class="form_row form_spacing_bottom">
            <wrapper-input id="role" label="Função do funcionário:" :error="errors.role">
                <input type="text" class="input input_error" id="role" v-model="form.role" placeholder="Função do funcionário" :disabled="disabled">
            </wrapper-input>

            <wrapper-input v-show="isOutsourced" label="Empresa terceirizada:" :error="errors.entity_id">
                <input-suggest-list
                    url="/registrations/service-provider?minimal=true"
                    :options="{ key: 'id', displayName: 'name' }"
                    placeholder="Selecione a empresa"
                    v-model="form.entity_id" :disabled="disabled">
                </input-suggest-list>
            </wrapper-input>

            <wrapper-input id="type" label="Tipo de contrato:" :error="errors.type_employment_contract">
                <select class="select" v-model="form.type_employment_contract" :disabled="disabled">
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="Outro">Outro</option>
                </select>
            </wrapper-input>
        </div>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"

import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia";
import { ref } from 'vue'

export default {
    components: { formPage, inputSuggestList },
    setup(){
        const store = useStore();
        store.resetState()
        const isOutsourced = ref(false)
     
        const { form, errors, editMode } = storeToRefs(store);

        const config = {
            urls: {
                fetch: "/registrations/employees/?",
                create: "/registrations/employees",
                edit: "/registrations/employees",
                delete: "/registrations/employees"
            },
            rules: {
                fullname: { required: true },
                role: { required: true },
                type_employment_contract: { required: true }
            }
        }

        function onLoaded(){
            isOutsourced.value = form.value.entity_id ? true : false;
        }

        return {
            config,
            disabled: editMode,
            isOutsourced,
            // form
            form,
            errors,
            // methods
            onLoaded
        }
    }
}
</script>