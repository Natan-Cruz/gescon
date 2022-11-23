<template>
    <div class="group-input">
        <tabs>
            <tab title="Email" @mounted="handleChange('email')">
                <label for="input-email" class="label-input">Seu email:</label>
                <input 
                    type="email" 
                    id="input-email" 
                    class="input" 
                    placeholder="seu@email.com" 
                    v-model.trim="identifier" 
                    @keydown="enterKey">
                <slot />
            </tab>

            <tab title="Telefone" @mounted="handleChange('phone')">
                <label for="input-phone" class="label-input">Seu telefone:</label>
                <input 
                    type="text" 
                    id="input-phone" 
                    class="input" 
                    placeholder="(xx) xxxxx-xxxx" 
                    v-model.trim="identifier"
                    v-maska="['(##) #####-####', '(##) ####-####']"
                    @keydown="enterKey">
                <slot />
            </tab>
        </tabs>

        <div class="container-button">
            <button class="button button-primary text-medium" @click="next">Próxima</button>
        </div>
    </div>
</template>

<script>
import { useStore } from "../store/store"
import { toRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import tab from "../../../components/tabs/tab.vue"
import tabs from "../../../components/tabs/tabs.vue"

export default {
    components: { tab, tabs },
    setup(){
        const store = useStore()
        const $router = useRouter();
        const $route = useRoute();

        const type = toRef(store.user, "type")
        const identifier = toRef(store.user, "identifier")
    
        let email = localStorage.getItem("email_login") 
        if(email && !identifier.value){
            type.value = "email"
            identifier.value = email
            next()
        }

        if(!type.value){
            type.value = "email"
        }

        function enterKey(evt){
            if(evt.keyCode === 13)
                next()
        }
        function next(){
            store.errorMsg = ""

            if(type.value === "email"){
                if(!identifier.value)
                    return store.errorMsg = `Email requirido`;

                // Email foi digitado, e será testado
                const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                if(!regex.test(identifier.value))
                    return store.errorMsg = "Email inválido"
            }

            if(type.value === "phone"){
                if(!identifier.value)
                    return store.errorMsg = `Telefone requirido`;

                const regex = /\([1-9]\d\)\s9?\d{4}-\d{4}/
                if(!regex.test(identifier.value))
                    return store.errorMsg = "Telefone inválido"
            }

            $router.push({ name: "auth/login/challenge", query: $route.query })
        }

        function handleChange(t){
            identifier.value = ""
            type.value = t;
        }

        return {
            identifier,
            type,
            enterKey,
            next,
            handleChange
        }
    }
}
</script>

<style lang="less" scoped src="../components/form.style.less"></style>
<style lang="less" scoped>
    .container-button{
        margin-top: 10px;
    }
</style>