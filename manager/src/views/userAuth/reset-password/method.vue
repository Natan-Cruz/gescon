<template>
    <div class="group-input">
        <label for="input-email" class="label-input">Email:</label>

        <input type="email" id="input-email" class="input" placeholder="seu@email.com" 
            v-model.trim="email" 
            @keydown="enterKey">  

        <slot />

        <router-link to="/auth/login/identifier" class="to-login text-medium">Voltar para login</router-link>

        <div class="container-button">
            <button class="button button-primary text-medium" @click="sendEmail">Enviar email</button>
        </div>

        <div class="email-was-sent" v-show="emailWasSent">
            <p>Link para a recuperação enviado para seu email </p>
            <p class="bold">{{ email }}</p>
            <button class="button button-second text-medium button-resend-email" @click="sendEmail">Re-enviar email</button>
        </div>
    </div>
</template>

<script>
import { useStore } from '../store/store'
import { ref, toRef } from 'vue';
import axios from "@/services/api"

export default {
    name: "reset-password",
    setup(){
        const store = useStore();
        const emailWasSent = ref(false)

        const email = toRef(store.user, "email");

        function enterKey(evt){
            if(evt.keyCode === 13)
                sendEmail()
        }

        async function sendEmail(){
            store.errorMsg = ""

            if(!email.value)
                return store.errorMsg = "Email requirido"
        
            // Email foi digitado, e será testado
            const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            if(!regex.test(email.value))
                return store.errorMsg = "Email invalido"

            store.isLoading = true;

            const url = "/users/reset-password/send-token"

            try {
                await axios.post(url, { email: email.value })      
                emailWasSent.value = true;
            } catch (error) {
                store.errorMsg = error;
                console.error(error)
            } finally {
                store.isLoading = false
            }
        }

        return {
            email,
            emailWasSent,
            enterKey,
            sendEmail
        }
    }
}
</script>

<style lang="less" scoped src="../components/form.style.less"></style>
<style lang="less" scoped>
    .to-login{
        display: inline-block;
        cursor: pointer;
        margin-top: 16px;
        color: #f70;
        cursor: pointer;
    }

    .email-was-sent{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;        

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        text-align: center;

        p{
            font-size: 1.7em;
            margin-bottom: 16px;
        }
    }

    .button-resend-email{
        width: 160px;
        height: 46px;
    }
</style>