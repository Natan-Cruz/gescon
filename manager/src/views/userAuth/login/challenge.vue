<template>
    <div class="group-input">
        <div class="ctn-user-identifier">
            <p>{{ identifier }}</p>
        </div>
        
        <wrapper-input-password 
            v-model="password" 
            @press-enter="authenticate" 
            label="Senha:" 
            ref="input"/>

        <slot/>

        <router-link :to="{ path: '/auth/reset-password/method', query: { e: $route.query.e } }" class="text-link text-medium">Esqueceu a senha?</router-link>

        <div class="container-button">
            <button class="button button-primary text-medium" @click="authenticate">Próxima</button>
            <button class="button button-tertiary text-medium" @click="prev">Voltar</button>
        </div>
    </div>
</template>

<script>
import wrapperInputPassword from "../../../components/wrapperInputPassword.vue"

import { useStore } from "../store/store"
import { useStore as useStoreUser } from "@/store/user"
import { useStore as useAccessControllStore } from '@/store/accessControl'
import { toRef, ref, onMounted } from 'vue';
import { useRouter, useRoute } from "vue-router"
import { startSession } from "@/auth/Session"

export default {
    name: "wrapper-password",
    components: { wrapperInputPassword },
    setup(){
        const store = useStore();
        const userStore = useStoreUser();
        const accessControlStore = useAccessControllStore()
        const $router = useRouter()
        const $route = useRoute()
        const input = ref(null)

        const identifier = toRef(store.user, "identifier")
        const password = toRef(store.user, "password")

        onMounted(() => {
            input.value.setFocus()
            if(!identifier.value)
                $router.replace({ name: "auth/login/identifier" })
        })

        function prev(){
            $router.replace({ name: "auth/login/identifier" })
        }

        function authenticate(){
            store.authenticate( data => {
                startSession(data.user);
                userStore.startSession(data.user);
                accessControlStore.set(data.access_control)
                localStorage.setItem("email_login", data.user.email)

                const { redirect } = $route.query;
                if(redirect){
                    $router.push(redirect);
                }else{
                    $router.push({ name: "constructions/active" })
                }
            })
        }

        return {
            identifier,
            password,
            input,
            prev,
            authenticate
        }
    },
}
</script>

<style lang="less" scoped src="../components/form.style.less"></style>
<style lang="less" scoped>
    .ctn-user-identifier{
        text-align: center;
        margin-bottom: 16px;
        cursor: pointer;
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
        margin-top: 10px;
    }
</style>