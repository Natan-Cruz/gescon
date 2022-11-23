<template>
    <li class="item-contact">
        <div class="content form_row">
            <!-- contact person -->
            <wrapper-input label="Pessoa de contato:" :id="index + 'contact_person'">
                <input type="text" class="input" :id="index + 'contact_person'" v-model="contact_person" :disabled="disabled">
            </wrapper-input>

            <!-- email -->
            <wrapper-input label="Email:" :id="index + 'ctt_email'">
                <input type="email" class="input" :id="index + 'ctt_email'" v-model="email" :disabled="disabled">
            </wrapper-input>

            <!-- commercial phone -->
            <wrapper-input label="Telefone:" :id="index + 'ctt_phone'">
                <input type="text" class="input" :id="index + 'ctt_phone'" v-model="phone" :disabled="disabled" v-maska="['(##) #####-####', '(##) ####-####']">
            </wrapper-input>

            <!-- phone_2 -->
            <wrapper-input label="Telefone:" :id="index + 'phone_2'" >
                <input type="text" class="input" :id="index + 'phone_2'" v-model="phone_2" :disabled="disabled" v-maska="['(##) #####-####', '(##) ####-####']">
            </wrapper-input>

            <!-- role -->
            <wrapper-input label="Cargo ou papel" :id="index + 'ctt_role'">
                <input type="text" class="input" :id="index + 'ctt_role'" v-model="role" :disabled="disabled"> 
            </wrapper-input>
        </div>

        <button class="button-trash" @click="remove" v-show="!disabled">
            <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
    </li>
</template>

<script>
import { computed } from 'vue'
export default {
    name: "item-contact",
    props: {
        index: Number,
        contact: Object,
        disabled: Boolean
    },
    setup(props, { emit }){
        const contact_person = computed({
            get: () => props.contact.contact_person,
            set: contact_person => emit("event-edit-contact", { index: props.index, contact: { ...props.contact, contact_person }})
        })
        const email = computed({
            get: () => props.contact.email,
            set: email => emit("event-edit-contact", { index: props.index, contact: { ...props.contact, email }})
        })
        const phone = computed({
            get: () => props.contact.phone,
            set: phone => emit("event-edit-contact", { index: props.index, contact: { ...props.contact, phone }})
        })
        const phone_2 = computed({
            get: () => props.contact.phone_2,
            set: phone_2 => emit("event-edit-contact", { index: props.index, contact: { ...props.contact, phone_2 }})
        })
        const role = computed({
            get: () => props.contact.role,
            set: role => emit("event-edit-contact", { index: props.index, contact: { ...props.contact, role }})
        })
        const intial_date = computed({
            get: () => props.contact.intial_date,
            set: intial_date => emit("event-edit-contact", { index: props.index, contact: { ...props.contact, intial_date }})
        })

        function remove(){
            emit("event-remove-contact", { index: props.index, contact: props.contact } )
        }

        return {
            contact_person,
            email,
            phone,
            phone_2,
            role,
            intial_date,
            // methods
            remove
        }
    }
}
</script>
<style lang="less" scoped>
    .item-contact{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: "content buttonTrash";
        grid-template-columns: 1fr;
        grid-template-rows: repeat(2, auto);

    }
    .content{
        grid-area: content;

        width: 100%;
        height: auto;
    }
    .spacing-bottom{
        margin-bottom: 12px;
        margin-right: 8px;
    }
    .ctn-input{
        grid-area: input;
        width: 100%;
    }
</style>