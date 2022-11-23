<template>
    <form-page linkBack="/sub-accounts/roles" :config="config">
        
        <wrapper-input label="Nome:" class="form_spacing_bottom" :error="errors.name">
            <input type="text" class="input" id="name" v-model="form.name" :disabled="disabled">
        </wrapper-input>

        <wrapper-input label="Descrição:" class="form_spacing_bottom" :error="errors.description">
            <input type="text" class="input" id="name" v-model="form.description" :disabled="disabled">
        </wrapper-input>

        <wrapper-input class="form_spacing_bottom" label="Permissões">
            <access-control-list-permissions v-model:permissions="form.permissions" :disabled="disabled"/>
        </wrapper-input>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"

import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia";
import accessControlListPermissions from "../../components/accessControlList/accessControlList.vue"

export default {
    components: { formPage, accessControlListPermissions },
    setup(){
        const store = useStore();
        store.resetState()

        const { form, errors, editMode } = storeToRefs(store);
     
        const config = {
            urls: {
                fetch: "/companies/roles/?",
                create: "/companies/roles/",
                edit: "/companies/roles/",
                delete: "/companies/roles/"
            },
            rules: {
                name: { required: true },
                permissions: { type: "Array", required: true },
            }
        }

        function storeDefault(){
            store.$patch( state => state.form.permissions = [])
        }
        storeDefault()

        store.setDefault(storeDefault)

        return {
            config,
            disabled: editMode,
            form,
            errors
        }
    }
}
</script>

<style lang="less" scoped>
    .tree-table{
        width: min-content;
        max-width: 100%;
        overflow-x: auto;
        padding-bottom: 6px;
        border-top: solid 1px #e0e4e9;
    }
    .content-tree-table{
        position: relative;
    }
    .detail-gradient{
        display: none;
        z-index: 2;
        width: 8px;

        position: absolute;
        right: 0;
        top: 0;

        pointer-events: none;
        height: 100%;
        background: linear-gradient(-90deg,rgba(171,181,186,.3),transparent);
    }

    @media screen and (max-width: 1097px){
        // .detail-gradient{
        //     display: block;
        // }
    }
</style>

<style lang="less" scoped>
    // scroll bar em geral
    ::-webkit-scrollbar {
        height: 8px;
    }

    // fundo da scroll bar
    ::-webkit-scrollbar-track {
        background: rgb(235, 235, 235);
        border-radius: 10px;
    }

    // botao da scroll bar
    ::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius:10px;
    }

    // O resto das propriedades disabilita por segunraça
    ::-webkit-scrollbar-button,
    ::-webkit-scrollbar-corner,
    ::-webkit-scrollbar-track-piece,
    ::-webkit-resizer {
        display: none;
    }
</style>