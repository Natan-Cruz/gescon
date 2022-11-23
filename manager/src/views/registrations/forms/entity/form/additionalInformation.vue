<template>
    <div class="form_row">
        <!-- email -->
        <wrapper-input label="Email:" id="email">
            <input type="email" class="input" id="email" v-model="email" :disabled="disabled">
        </wrapper-input>

        <!-- commercial phone -->
        <wrapper-input label="Telefone:" id="commercial_phone">
            <input type="text" class="input" id="commercial_phone" v-model="phone" :disabled="disabled" v-maska="['(##) #####-####', '(##) ####-####']">
        </wrapper-input>

        <!-- cellphone -->
        <wrapper-input label="Telefone:" id="cellphone" >
            <input type="text" class="input" id="cellphone" v-model="phone_2" :disabled="disabled" v-maska="['(##) #####-####', '(##) ####-####']">
        </wrapper-input>

        <!-- initiation date -->
        <wrapper-input :label="initiationDateText" id="initiation_date" >
            <input type="date" name="" id="initiation_date" class="input" :disabled="disabled" v-model="initial_date">
        </wrapper-input>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from 'pinia';

export default {
    setup(){
        const store = useStore()
        const { form, editMode } = storeToRefs(store);
        
        const email = computed({
            get: () => form.value.main_contact.email,
            set: email => {
                form.value.main_contact.email = email
                form.value.main_contact.action = "UPDATE"
            }
        })

        const phone = computed({
            get: () => form.value.main_contact.phone,
            set: phone => {
                form.value.main_contact.phone = phone
                form.value.main_contact.action = "UPDATE"
            }
        })

        const phone_2 = computed({
            get: () => form.value.main_contact.phone_2,
            set: phone_2 => {
                form.value.main_contact.phone_2 = phone_2
                form.value.main_contact.action = "UPDATE"
            }
        })

        const initial_date = computed({
            get: () => form.value.main_contact.initial_date,
            set: initial_date => {
                form.value.main_contact.initial_date = initial_date
                form.value.main_contact.action = "UPDATE"
            }
        })

        const initiationDateText = computed(() => {
            const legal_type = store.form.legal_type

            if(legal_type === "legal_person")
                return "Data de cadastro"
            else
                return "Data de nascimento"
        })

        return {
            disabled: editMode,
            form,
            initiationDateText,

            email,
            phone,
            phone_2,
            initial_date
        }
    }
}
</script>
