<template>
    <div>
        <ul>
            <item-contact 
                v-for="(contact, i) in contacts" :key="i" 
                :index="i" 
                :contact="contact"
                :disabled="disabled"
                @event-remove-contact="removeContact"
                @event-edit-contact="editContact"/>
        </ul>
        <button class="text-medium button-add" @click="add" :disabled="disabled">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"/></svg>
            Adicionar contato
        </button>
    </div>
</template>

<script>
import itemContact from "../components/itemContact.vue";

import { computed } from 'vue';
import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from 'pinia';

export default {
    components: { itemContact },
    setup(){
        const store = useStore();
        const { form, editMode } = storeToRefs(store)

        function add(){
            let contact = {
                contactPerson: "",
                email: "",
                commercialPhone: "",
                cellphone: "",
                role: "",
                action: "ADD"
            }
            store.$patch( state => {
                if(form.value.contacts){
                    state.form.contacts.push(contact)
                }else{
                    state.form.contacts = [contact]
                }
            })
        }
        function removeContact({ index, contact }){
            if(contact.id){
                contact.action = "REMOVE"
                store.$patch( state => state.form.contacts.splice(index, 1, contact))
            }else{
                store.$patch( state => state.form.contacts.splice(index, 1))
            }
        }

        function editContact({ index, contact }){
            if(contact.id)
                contact.action = "UPDATE"

            store.$patch( state => state.form.contacts.splice(index, 1, contact))
        }

        const contactsFiltered = computed(() => {
            const contacts = form.value.contacts
            if(contacts)
                return contacts.filter( contact => contact.action !== "REMOVE" )
            else
                return []
        })

        return {
            disabled: editMode,
            contacts: contactsFiltered,
            add,
            removeContact,
            editContact
        }
    }
}
</script>