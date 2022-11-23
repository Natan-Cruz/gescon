<template>
    <Modal :maxWidth="400" @close-modal="$emit('close-modal')">
        <form action="#" @submit.prevent="submit">
            <!-- current password -->
            <wrapper-input label="Sua atual senha:" id="current-password" class="form_spacing_bottom">
                <wrapper-input-password ref="input" v-model="state.currentPassword"/>
            </wrapper-input>
            <!-- new password -->
            <wrapper-input label="Sua nova senha:" id="new-password" class="form_spacing_bottom">
                <wrapper-input-password v-model="state.newPassword"/>
            </wrapper-input>

            <!-- error -->
            <form-loading-or-error :isLoading="state.isLoading" :error="state.error"/>

            <!-- buttons -->
            <div class="wrapper-buttons">
                <button type="button" class="button button-second text-medium" @click="$emit('close-modal')">Cancelar</button>
                <button type="submit" class="button button-primary text-medium" >Alterar senha</button>
            </div>
        </form>
    </Modal>
</template>

<script>
import wrapperInputPassword  from "@/components/wrapperInputPassword.vue" 
import { nextTick, onMounted, reactive, ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import axios from "@/services/api"

export default {
    name:"modal-change-password",
    components: { wrapperInputPassword },
    setup(_, { emit }){
        const input = ref(null)
        const state = reactive({
            currentPassword: "",
            newPassword: "",
            isLoading: false,
            error: ""
        })

        onMounted(() => {
            nextTick(() => input.value.setFocus() )
        })
        
        async function submit(){
            state.error = "";

            if(!state.currentPassword || !state.newPassword)
                return state.error = "Ambos os campos devem ser preenchidos";

            const url = "/users/change-password",
                body = {
                    currentPassword: state.currentPassword,
                    newPassword: state.newPassword
                };

            state.isLoading = true;
            try {
                await axios.put(url, body)
                emit("close-modal")
                notify({
                    title: "Senha alterada!", 
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        return {
            state,
            input,
            // 
            submit
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper-buttons{
        display: flex;
        justify-content: right;
        align-items: center;

        margin-top: 24px;
    }

    .button{
        width: 130px;
        height: 42px;
        &:first-child{
            margin-right: 12px;
        }
    }
</style>