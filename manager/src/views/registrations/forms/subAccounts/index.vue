<template>
    <form-page linkBack="/main/sub-accounts/users" :config="config">

        <div class="form_row">
            <wrapper-input label="Nome:" id="first_name" :error="errors.first_name">
                <input type="text" id="first-name" class="input" v-model="form.first_name"  :disabled="disabled">
            </wrapper-input>

            <wrapper-input label="Sobrenome:" id="last_name" :error="errors.last_name">
                <input type="text" id="last-name" class="input" v-model="form.last_name" :disabled="disabled" >
            </wrapper-input>
        </div>
        
        <div class="form_row">
            <wrapper-input label="Titulo:" id="jobtitle" :error="errors.title">
                <input type="text" id="jobtitle" class="input" v-model="form.title" :disabled="disabled" >
            </wrapper-input>

            <wrapper-input label="Email:" id="email" :error="errors.email">
                <input type="text" id="email" class="input" v-model="form.email" :disabled="disabled" >
            </wrapper-input>

            <wrapper-input label="Telefone:" id="phone">
                <input type="text" id="phone" class="input" v-model="form.phone" :disabled="disabled" v-maska="['(##) #####-####', '(##) ####-####']">
            </wrapper-input>
        </div>

        <div class="information" v-show="!hasUser">
            <p>A senha padrão de acesso é <span class="sub-text bold">gescon</span></p>
        </div>


        <div class="form_spacing_bottom" >
            <wrapper-input label="Papéis">
                <input-suggest-list
                    url="/companies/roles"
                    :options="{ key: 'id', displayName: 'name', multi_select: true }"
                    placeholder="Selecione os papeis"
                    :disabled="disabled"
                    :showEditButton="true"
                    v-model="form.roles"/>
            </wrapper-input>
            <button-redirect routeName="registrations/form_role">Cadastrar novo papel</button-redirect>
        </div>

        <wrapper-input class="form_spacing_bottom" label="Permissões">
            <access-control-list-permissions v-model:permissions="form.permissions" :disabled="disabled"/>
        </wrapper-input>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import buttonRedirect from "@/components/formPage/buttonRedirect.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList"
import accessControlListPermissions from "../../components/accessControlList/accessControlList.vue"

import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from "pinia"

export default {
    components: {
        formPage,
        buttonRedirect,
        inputSuggestList,
        // 
        accessControlListPermissions
    },
    setup(){
        const store = useStore();
        store.resetState()
        const { form, errors, editMode, hasData } = storeToRefs(store)

        const config = {
            urls: {
                fetch: "/users/admin/?",
                create: "/users/admin",
                edit: "/users/admin",
                delete: ""
            },
            rules: {
                first_name: { required: true },
                title: { required: true },
                email: { required: true },
            }
        }

        function storeDefault(){
            store.$patch( state => {
                state.form.roles = []
                state.form.permissions = []
            })
        }
        storeDefault()

        store.setDefault(storeDefault)

        return {
            config,
            form,
            errors,
            disabled: editMode,
            hasUser: hasData
        }
    }
}
</script>

<style lang="less" scoped>
    .title{
        font-size:2em;
        margin-bottom: 20px;
        color: rgb(70, 70, 70);
    }

    .information{
        font-size: 1.7em;
        background-color: rgb(231, 231, 231);
        padding: 6px 5px 6px 12px;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;

        margin-bottom: 24px;
        p,span{
            font-size: 1em;
        }
        &::before{
            content: "";
            display: block;
            width: 6px;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #f70;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
        }
    }
        
    .button{
        width: 140px;
        height: 42px;
        margin-top: 12px;
    }
</style>