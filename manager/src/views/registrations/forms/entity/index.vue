<template>
    <form-page linkBack="/main/constructions/active" :config="config" >
        <form-third-party-company class="wrapper" />

        <expandable-content class="wrapper" title="Informações adicionais" :defaultOpen="true" >
            <additional-information />
        </expandable-content>

        <expandable-content class="wrapper" title="Endereço" :defaultOpen="true" >
            <address-component />
        </expandable-content>

        <expandable-content class="wrapper" title="Outros contatos" :defaultOpen="true" >
            <other-contacts />
        </expandable-content>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import expandableContent from "../../components/expandableContent.vue"
import formThirdPartyCompany from "./form/formComponent.vue";
import additionalInformation from "./form/additionalInformation"
import addressComponent from "./form/addressComponent"
import otherContacts from "./form/otherContacts.vue"

import { useStore } from "@/components/formPage/store.js"
import { useRoute } from "vue-router"

export default {
    components:{
        formPage,
        additionalInformation,
        formThirdPartyCompany,
        expandableContent,
        addressComponent,
        otherContacts,
    },
    setup(){
        const store = useStore();
        const $route = useRoute();
        store.resetState();

        const config = {
            urls: {
                fetch: "/registrations/entities/?",
                create: "/registrations/entities",
                edit: "/registrations/entities",
                delete: "/registrations/entities",
            },
            rules: {
                legal_type: { required: true },
                document_type: { required: true },
                name: { required: true },
                roles: { type: "Array", required: true, msg: "Escolha ao menos uma opção!" },
                note: { maxLength: 256 }
            }
        }
        
        function storeDefault(){
            const { role } = $route.query;
            store.$patch( state => {
                state.form.roles = []
                if(role) state.form.roles.push(role)
                state.form.legal_type = "legal_person";
                state.form.contacts = [];
                state.form.main_contact = {};
            })
        }
        storeDefault()

        store.setDefault(storeDefault)

        return { config }
    }
}
</script>

<style lang="less" scoped>
    .wrapper{
        border-bottom: dashed 1px rgb(177, 177, 177);
        padding-bottom: 24px;
        margin-bottom: 24px;
    }
    :deep(.sub-title){
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 12px;
    }

    :deep(.button-add){
        @color: #f70;

        width: auto;
        height: auto;
        justify-self: left;
        z-index: 1000;

        padding: 6px;

        border: dashed 1px @color;
        color: @color;
        fill: @color;
        background-color: #fff;
        
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.6em;
        transition: 200ms;

        display: flex;
        align-items: center;

        &:active{
            transform: scale(.8);
        }

        svg{
            margin-right: 8px;
        }

        &:disabled{
            opacity: .7
        }
    }
    :deep(.button-trash){
        grid-area: buttonTrash;
        align-self: center;

        width: 42px;
        height: 42px;

        border: none;
        background-color: #fff;
        border-radius: 50%;

        cursor: pointer;

        transition: 80ms ease-in;

        &:hover{
            background-color: rgb(206, 206, 206);
        }

        &:active{
            background-color: rgb(179, 179, 179);
            transform: scale(.96);
        }
    }
</style>