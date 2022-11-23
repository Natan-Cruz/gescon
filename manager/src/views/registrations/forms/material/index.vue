<template>
    <form-page linkBack="/main/materials" :config="config">

        <wrapper-input label="Nome do material:" class="form_spacing_bottom" :error="errors.name">
            <input type="text" class="input" :disabled="disabled" v-model="form.name">
        </wrapper-input>

        <wrapper-input label="Descrição" class="form_spacing_bottom">
            <textarea-autosize v-model="form.description" :minHeight="80" placeholder="Descreva aqui...Opcional" :disabled="disabled"/>
        </wrapper-input>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia" 

export default {
    components:{ formPage, },
    setup(){
        const store = useStore();
        store.resetState()
     
        const config = {
            urls: {
                fetch: "/materials/m/?",
                create: "/materials/m",
                edit: "/materials/m",
                delete: "/materials/m"
            },
            rules: {
                name: { required: true },
            }
        }
        
        const { form, errors, editMode } = storeToRefs(store);

        return {
            config,
            disabled: editMode,
            form,
            errors
        }
    }
}
</script>