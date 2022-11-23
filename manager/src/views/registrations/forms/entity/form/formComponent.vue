<template>
    <div>
        <!-- title -->
        <p class="sub-title">Dados gerais</p>

        <div class="form_row margin-bottom">
            <wrapper-input label="Pessoa:" id="person" :error="errors.legal_type" >
                <select class="select input_error" id="person" v-model="form.legal_type" :disabled="disabled" @change="handleChangeLegalPerson">
                    <!-- <option value="foreign_person">Estrangeira</option> -->
                    <option value="legal_person" default>Jurídica</option>
                    <option value="physical_person">Física</option>
                </select>
            </wrapper-input>

            <wrapper-input :label="documentTypeLabel" id="cpf_doc">
                <input type="text" class="input" id="cpf_doc" v-model="form.document_value" :disabled="disabled" v-maska="['###.###.###-##', '##.###.###/####-##']">
            </wrapper-input>
        </div>
        
        <div class="form_row">
            <wrapper-input :label="labelName" id="physical_name" :error="errors.name">
                <input type="text" class="input input_error" id="physical_name" v-model="form.name" :disabled="disabled">
            </wrapper-input>

            <wrapper-input v-show="isLegalPerson" label="Razão social" id="corporate_name">
                <input type="text" class="input" id="corporate_name" v-model="form.corporate_name" :disabled="disabled">
            </wrapper-input>
        </div>

        <div class="form_row row-2">
            <wrapper-input label="Tipo de papel:" :error="errors.roles">
                <div class="form_row row-roles">
                    <checkbox-card class="input_error text_error" label="Cliente" key_value="client" v-model="form.roles" :disabled="disabled" />
                    <checkbox-card class="input_error text_error" label="Forn. de Serviço" key_value="service_provider" v-model="form.roles" :disabled="disabled" />
                    <checkbox-card class="input_error text_error" label="Forn. de Material" key_value="material_provider" v-model="form.roles" :disabled="disabled" />
                </div>
            </wrapper-input>

            <wrapper-input label="Código de cadastro:" id="registration_code">
                <input type="text" class="input" placeholder="Para idenficar com seu antigo sistema" id="registration_code" :disabled="disabled" v-model="form.registration_code">
            </wrapper-input>
        </div>
        
        <wrapper-input label="Observações gerais:" id="note" :error="errors.note">
            <textarea-autosize
                id="note"
                placeholder="Faça sua anotação... 🖊️"
                v-model="form.note"
                :maxHeight="500"
                :maxLength="256"
                :disabled="disabled"
                @set-error="errors.note = $event" />
        </wrapper-input>
    </div>
</template>

<script>
import checkboxCard from "../components/checkboxCard.vue";
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from "@/components/formPage/store.js";
import { storeToRefs } from 'pinia';

export default {
    components: { checkboxCard },
    setup(){
        const store = useStore();
        const { form, errors, editMode } = storeToRefs(store)

        const labelName = ref("Defina a pessoa:")
        
        function defineInfo(){
            switch(form.value.legal_type){
                case "physical_person":
                    form.value.document_type = "CPF"
                    labelName.value = "Nome:"
                    break

                case "legal_person":
                    form.value.document_type = "CNPJ"
                    labelName.value = "Nome fantasia:"
                    break
                default:
                    labelName.value = "Defina a pessoa:"
            }
        }
        watch(() => form.value.legal_type, defineInfo)
        onMounted(defineInfo)

        const documentTypeLabel = computed(() => (form.value.document_type || 'Defina a pessoa') + ':')
        const isLegalPerson = computed(() => form.value.legal_type === 'legal_person')
   
        return {
            documentTypeLabel,
            isLegalPerson,
            disabled: editMode,
            form,
            errors,
            labelName,

        }
    }
}
</script>

<style lang="less" scoped>
    .row-roles{
        grid-template-columns: repeat(3, minmax(140px, 1fr));
        margin-bottom: 0;
    }
    @media screen and (min-width: 700px) {
        .row-2{
            grid-template-columns: 2fr 1fr;
        }
    }
    @media screen and (max-width: 700px) {
        .row-roles{
            display: flex;
            flex-direction: column;
        }
        .row-2{
            display: flex;
            flex-direction: column-reverse;
            margin-bottom: 24px;
        }
    }
</style>