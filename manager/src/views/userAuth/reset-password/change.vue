<template>
    <div>
        <loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" @event-retry="checkIfTokenIsValid" ></loading-or-error>

        <form v-show="state.token && state.tokenIsValid" @submit.prevent="changePassword">
            <div class="ctn-user-email">
                <p>{{ state.email }}</p>
            </div>

            <wrapper-input-password class="margin-bottom" v-model="state.password" label="Senha:" autocomplete="new-password"/>

            <wrapper-input-password v-model="state.repeatedPassword" @press-enter="changePassword" label="Repita a senha" autocomplete="new-password"/>

            <slot />

            <div class="container-button">
                <button type="submit" class="button button-primary text-medium">Mudar senha</button>
            </div>
        </form>

        <template v-if="!state.tokenIsValid">
            <p class="invalid-token">
                {{ state.msg }}
            </p>
            <router-link :to="{ path: '/auth/login/identifier' }" class="text-link text-medium">Voltar para login</router-link>
        </template>
    </div>
</template>

<script>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import wrapperInputPassword from '../../../components/wrapperInputPassword.vue'
import { useStore } from '../store/store';
import axios from "@/services/api";

import { useStore as useStoreUser } from '@/store/user';
import { useStore as useAccessControllStore } from '@/store/accessControl'
import { startSession } from "@/auth/Session"

export default {
    name: "container-form",
    components: { wrapperInputPassword },
    setup(){
        const $route = useRoute();
        const $router = useRouter();
        const store = useStore()
        const userStore = useStoreUser()
        const accessControlStore = useAccessControllStore()

        const state = reactive({
            tokenIsValid: undefined,
            token: undefined,
            email: "",
            password: "",
            repeatedPassword: "",
            isLoading: false,
            errorMsg: "",
            msg: ""
        })

        const { token } = $route.params;
        state.token = token
        checkIfTokenIsValid()

        async function checkIfTokenIsValid(){
            state.isLoading = true
            state.errorMsg = ""

            const url = "/users/reset-password/verify-token";

            try {
                const { data } = await axios.post(url, { token: state.token })  
                const { tokenIsValid, user, msg } = data;
                state.tokenIsValid = tokenIsValid

                if(tokenIsValid){
                    state.email = user.email
                }else{
                    state.msg = msg
                }
            } catch (error) {
                state.errorMsg = error
            } finally {
                state.isLoading = false
            }
        }

        async function changePassword(){
            store.errorMsg = ""

            if(!state.password) 
                return store.errorMsg = "Senha é necessária"

            if(!state.repeatedPassword) 
                return store.errorMsg = "Senha é necessária"

            if(state.password !== state.repeatedPassword)
                return store.errorMsg = "As senhas devem ser iguais"

            const url = "/users/reset-password",
                body = {
                    token: state.token,
                    password: state.password,
                    repeatedPassword: state.repeatedPassword
                } 
            store.isLoading = true;
            try {
                const { data } = await axios.post(url, body)   

                startSession(data.user);
                userStore.startSession(data.user);
                accessControlStore.set(data.access_control)
                localStorage.setItem("email_login", data.user.email)
                
                $router.push({ name: "constructions/active" });
            } catch (error) {
                store.errorMsg = error
            } finally {
                store.isLoading = false
            }
        }

        return {
            state,
            changePassword,
            checkIfTokenIsValid
        }
    }
}
</script>

<style lang="less" scoped>
    .container-loading{
        background-color: #fff;
    }
    .margin-bottom{
        margin-bottom: 26px;
    }

    .ctn-user-email{
        text-align: center;
        margin-bottom: 16px;
        p{
            display: inline-block;
            font-size: 1.8em;
            font-weight: bold;
            border-radius: 16px;
            border: 1px solid gray;
            padding: 4px 8px;
            color: gray;
        }
    }

    .container-button{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row-reverse;
        margin-top: 26px;
    }

    .button{
        width: 126px;
        height: 46px;
    }

    .invalid-token{
        font-size: 1.7em;
        text-align: center;

        color: #ffffff;
        background-color: #b82e24;
        padding: 12px 0;
        font-weight: bold;
    }
</style>