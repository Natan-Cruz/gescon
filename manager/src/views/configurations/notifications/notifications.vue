<template>
    <div class="wrapper-informations">
        <p class="subtitle-content">Preferências</p>

        <item title="Push notifications" description="Nós te notificaremos quando houver algum acontecimento">
            <template v-slot:icon>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M4 19V17H6V10Q6 7.925 7.25 6.312Q8.5 4.7 10.5 4.2V3.5Q10.5 2.875 10.938 2.438Q11.375 2 12 2Q12.625 2 13.062 2.438Q13.5 2.875 13.5 3.5V4.2Q15.5 4.7 16.75 6.312Q18 7.925 18 10V17H20V19ZM12 11.5Q12 11.5 12 11.5Q12 11.5 12 11.5Q12 11.5 12 11.5Q12 11.5 12 11.5ZM12 22Q11.175 22 10.588 21.413Q10 20.825 10 20H14Q14 20.825 13.413 21.413Q12.825 22 12 22ZM8 17H16V10Q16 8.35 14.825 7.175Q13.65 6 12 6Q10.35 6 9.175 7.175Q8 8.35 8 10Z"/></svg>
            </template>
            <template v-slot:toggle>
                <toggle label="" v-model="pushNotifications" @input="handleToggleInput"></toggle>
            </template>
        </item>

        <wrapper-input label="Duração da sessão" style="font-weight: bold; margin-top: 16px; max-width: 300px">
            <select class="select" v-model="sessionPreference">
                <option :value="1">Não salvar sessão</option>
                <option :value="2">Manter por 1 dia</option>
                <option :value="3">Manter por 1 semana</option>
                <option :value="4">Manter por 1 mês</option>
                <option :value="5">Manter indefinidamente</option>
            </select>
        </wrapper-input>
    </div>
</template>

<script>
import toggle from "@/components/toggle/toggle.vue"
import item from "./item.vue"

import { onMounted, ref, watch } from 'vue';
import Pushy from 'pushy-sdk-web';
import axios from "@/services/api"
import { notify } from "@kyvg/vue3-notification"
import { changeDrive } from "@/auth/Session"
const LOCAL_STORAGE_KEY = "push_notifications"

export default {
    components: { item, toggle },
    setup(){
        const pushNotifications = ref(false);
        const sessionPreference = ref(4)

        const pushNotificationsEnabled = localStorage.getItem(LOCAL_STORAGE_KEY) === "1"
        pushNotifications.value  = pushNotificationsEnabled;

        async function activePushNotifications(){
            try {
                // Register visitor's browser for push notifications
                const deviceToken = await Pushy.register({ appId: '624f1149ca130a4f54f567fa' })
                await axios.post("/users/device-token", { token: deviceToken })
                notify({
                    title: "Notificações ativadas!",
                    type: "success",
                    duration: 5000
                })
                localStorage.setItem(LOCAL_STORAGE_KEY, 1)
            } catch (error) {
                console.error(error)
                notify({
                    title: "Erro ao ativar as notificações!",
                    type: "error",
                    duration: 5000
                }) 
                pushNotifications.value = false
            }
        }

        async function removePushNotifications(){
            try {
                // Register visitor's browser for push notifications
                const deviceToken = await Pushy.register({ appId: '624f1149ca130a4f54f567fa' })
                await axios.put("/users/device-token", { token: deviceToken })
                notify({
                    title: "Notificações desativadas!",
                    type: "success",
                    duration: 5000
                })
                localStorage.setItem(LOCAL_STORAGE_KEY, 0)
            } catch (error) {
                console.error(error)
                notify({
                    title: "Erro ao desativar as notificações!",
                    type: "error",
                    duration: 5000
                }) 
                pushNotifications.value = true
            }
        }

        function handleToggleInput(){
            if(!pushNotifications.value)
                activePushNotifications()
            else
                removePushNotifications()
        }


        onMounted(() => {
            const sessionPref = localStorage.getItem("session_preference")
            if(sessionPref){
                const value = parseInt(sessionPref)
                sessionPreference.value = value
            }
        })

        watch(() => sessionPreference.value, val => {
            window.localStorage.setItem("session_preference", val)
            changeDrive(val)
        })

        return {
            pushNotifications,
            sessionPreference,
            activePushNotifications,
            handleToggleInput
        }
    }
}
</script>

<style lang="less" scoped>

</style>