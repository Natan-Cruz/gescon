<template>
    <div class="wrapper-informations">
        <p class="subtitle-content">Perfil</p>

        <div class="content-settings-profile">
            <!--  -->
            <user-photo-component :photo_file_url="user.photo_file_url" @open-modal="openModalPhoto" @delete-image="handleDeletePhoto"/>

            <!--  -->
            <div class="ctn-profile-informations">
                <form-loading-or-error :isLoading="state.isLoading" :error="state.error" />

                <!-- name and last name -->
                <wrapper @submit="saveInformations">
                    <template v-slot="{ disabled }">
                        <user-name-component 
                            :disabled="disabled"
                            v-model:first_name="form.first_name"
                            v-model:last_name="form.last_name" />
                    </template>
                </wrapper>

                <!-- email -->
                <wrapper @submit="saveInformations">
                    <template v-slot="{ disabled }">
                        <user-email-component
                            :disabled="disabled"
                            :confirmed_email="user.confirmed_email"
                            v-model:email="form.email"
                            @send-confirmation-email="sendConfirmationEmail" />
                    </template>
                </wrapper>

                <!-- titulo -->
                <wrapper @submit="saveInformations">
                    <template v-slot="{ disabled }">
                        <user-title-component
                            :disabled="disabled"
                            v-model:title="form.title" />
                    </template>
                </wrapper>

                <!-- phone -->
                <wrapper @submit="saveInformations">
                    <template v-slot="{ disabled }">
                        <user-phone-component
                            v-model:phone="user.phone"
                            :disabled="disabled" />
                    </template>
                </wrapper>

                <button class="button-alterate-password" @click="openModalPassword">Editar senha</button>

                <div class="wrapper-informations">
                    <button class="btn-logout" @click="logout">Sair</button>
                </div>
            </div>
        </div>
        <!--  -->
        <modal-photo v-if="state.modal.photo" @close-modal="closeModalPhoto" @set="handleSetPhoto"></modal-photo>
        <modal-password v-if="state.modal.password" @close-modal="closeModalPassword"></modal-password>
    </div>
</template>

<script>
import wrapper from "./wrapper.vue"
import userPhotoComponent from "./userPhoto.vue";
import userNameComponent from "./userName.vue";
import userEmailComponent from "./userEmail.vue";
import userPhoneComponent from "./userPhone.vue";
import userTitleComponent from "./userTitle.vue";

import modalPhoto from "../modal/cropPhoto.vue"
import modalPassword from "../modal/changePassword.vue"

import { onMounted, reactive } from 'vue';
import axios from "@/services/api";
import { notify } from "@kyvg/vue3-notification"
import { useRouter } from "vue-router"
import { deleteImage } from "../utils/uploader"

import { useStore as useStoreUser } from "@/store/user.js"
import { useStore as useStoreHistory } from "@/store/history.js"
import { useStore as useAccessControllStore } from '@/store/accessControl'

export default {
    name: "profile-component",
    components:{
        wrapper, 
        // 
        userPhotoComponent,
        userNameComponent,
        userEmailComponent,
        userPhoneComponent,
        userTitleComponent,
        // 
        modalPhoto,
        modalPassword
    },
    setup(){
        const state = reactive({ isLoading: false, error: "", form: {}, modal: { photo: false, password: false } });
        const form = reactive({ });

        const storeUser = useStoreUser()
        const history = useStoreHistory()
        const accessControllStore = useAccessControllStore()    
        const $router = useRouter();

        function logout(){
            storeUser.closeSession()
            $router.push({ name: "auth/login/identifier" })
            accessControllStore.$reset()
        }

        onMounted(() => {
            const { first_name, last_name, email, phone, title } = storeUser.data;

            form.first_name = first_name
            form.last_name = last_name
            form.email = email
            form.phone = phone
            form.title = title
        })

        async function saveInformations(){
            
            const body = Object.entries(form).filter( keyValue => {
                const [ key, value ] = keyValue;

                if(storeUser.data[key] !== value) return keyValue
            }).reduce((acc, cur) => {
                const [ key, value ] = cur
                acc[key] = value
                return acc
            }, {})

            body.id = storeUser.data.id
            state.error = "";
            state.isLoading = true

            try {
                await axios.put("/users/edit", body)
                if(body.email)  
                    body.confirmed_email = false;

                storeUser.updateUser(body)
                notify({
                    title: "Dados alterados!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                state.error = error                 
            } finally {
                state.isLoading = false
            }
        }

        function handleDeletePhoto(){
            deleteImage()
                .then(() => {
                    storeUser.updateUser({ photoFileName: "", photoFilePath: "", photo_file_url: "" })
                    notify({
                        title: "Imagem deletada",
                        type: "success",
                        duration: 5000
                    })
                })
                .catch( () => {
                    notify({
                        title: "Erro ao deletar imagem",
                        type: "error",
                        duration: 5000
                    })
                })
        }

        async function sendConfirmationEmail(){
            state.error = "";
            state.isLoading = true

            try {
                const { data } = await axios.post("/users/send-confimation-email", {})
                if(data.confirmed_email){
                    storeUser.updateUser({ confirmed_email: true })
                    notify({
                        title: "Email confirmado!",
                        type: "success",
                        duration: 5000
                    })
                }else{
                    notify({
                        title: "Email de confirmação enviado!",
                        type: "success",
                        duration: 5000
                    })
                }
            } catch (error) {
                notify({
                    title: "Ocorreu um problema, tente novamente!",
                    type: "error",
                    duration: 5000
                })
            } finally {
                state.isLoading = false
            }
        }   
        

        function openModalPhoto(){
            state.modal.photo = true;
            history.push({ name: "modal_user_photo", fn: closeModalPhoto })
        }
        function closeModalPhoto(){
            state.modal.photo = false;
            history.remove("modal_user_photo")
        }
        function handleSetPhoto(informations){
            storeUser.updateUser(informations)
        }

        // password
        function openModalPassword(){
            state.modal.password = true;
            history.push({ name: "modal_user_password ", fn: closeModalPassword })
        }
        function closeModalPassword(){
            state.modal.password = false;
            history.remove("modal_user_password")
        }

        return {
            state,
            form,
            user: storeUser.data,
            // methods
            saveInformations,
            logout,
            // photo
            openModalPhoto,
            closeModalPhoto,
            handleSetPhoto,
            handleDeletePhoto,
            // password
            openModalPassword,
            closeModalPassword,
            // 
            sendConfirmationEmail
        }
    },
}
</script>

<style lang="less" scoped>
    .content-settings-profile {
        width: 100%;
        display: grid;
        grid-template-areas: "picture informations";
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: auto;
    }

    .ctn-person-picture{
        grid-area: picture;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .ctn-profile-informations{
        grid-area: informations;
        width: 100%;
        position: relative;
    }

    @media screen and (max-width:1000px) {
        .content-settings-profile{
            grid-template-areas: "picture picture" "informations informations";
            row-gap: 30px;
        }
    }

    // :deep(.label){
    //     font-weight: bold;
    //     color: #383838;
    // }

    .button-alterate-password{
        width: auto;
        height: auto;
        padding: 8px;

        font-size: 1.8em;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        background-color:#5b2c92;

        &:hover {
            color: rgb(207, 207, 207);
            opacity: 0.95;
        }
        &:active {
            transform: scale(0.95);
        }
    }

    .btn-logout {
        width: 100%;
        height: auto;
        padding: 10px 0;

        font-size: 2em;
        font-weight: bold;
        color: #fff;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        margin-top: 20px;
        background-color:#B23B3B;

        &:hover {
            color: rgb(207, 207, 207);
            opacity: 0.95;
        }
        &:active {
            transform: scale(0.95);
        }
    }
</style>