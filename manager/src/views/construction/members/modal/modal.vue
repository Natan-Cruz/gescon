<template>
    <Modal :maxWidth="400" @close-modal="$emit('close-modal')" >

        <p class="title">{{ item.id ? "Editar membro": "Adicionar membro(s)" }}</p>

        <wrapper-input label="Membros" :error="state.errors.members">
            <input-suggest-list
                :url="urlUsers"
                :options="{ key: 'id', displayName: ['? ? - ?', 'first_name', 'last_name', 'title' ], multi_select: true }"
                :url_search="false"
                :disabled="inputDisabled"
                placeholder="Selecione um usuário"
                v-model="state.members" />
        </wrapper-input>
            
        <button class="button button-tertiary text-medium" style="height: auto; margin: 6px 0">Adicionar novo usuário</button>

        <p class="sub-title">Permissões</p>

        <checkbox label="Home" key_value="home" v-model="state.permissions" :defaultChecked="true" :disabled="true"/>
        <checkbox label="Ocorrências" key_value="occurrences" v-model="state.permissions"/>
        <checkbox label="Serviços" key_value="services" v-model="state.permissions"/>
        <checkbox label="Pedidos e materiais" key_value="materials" v-model="state.permissions"/>
        <checkbox label="Progress Tracker" key_value="progress_tracker" v-model="state.permissions"/>
        <checkbox label="Visitas" key_value="progress_tracker" v-model="state.permissions"/>
        <checkbox label="Efetivo" key_value="progress_tracker" v-model="state.permissions"/>
        <checkbox label="Nuvem" key_value="cloud" v-model="state.permissions"/>
        <checkbox label="Membros" key_value="members" v-model="state.permissions" />
        <checkbox label="Configurações" key_value="configurations" v-model="state.permissions" />

        <form-loading-or-error :isLoading="state.isLoading" :error="state.error" />

          <!-- BTN SAVE ALTERATIONS -->
        <div class="wrapper-buttons">
            <button class="button button-second text-medium" style="margin-right: 16px" @click="$emit('close-modal')">Cancelar</button>
            <button class="button button-primary text-medium" @click="handleSubmit">salvar</button>
        </div>
    </Modal>
</template>

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import checkboxComponent from "./checkboxComponent.vue"

import { computed, onMounted, reactive, ref } from 'vue'
import { notify } from '@kyvg/vue3-notification';
import { useRoute } from 'vue-router';
import axios from "@/services/api";
import Rules from "@/components/formPage/Rules.js"

export default {
    components: { inputSuggestList, checkbox: checkboxComponent },
    emits: ["close-modal", "submit"],
    props: { item: Object },
    setup( props, { emit }){
        const state = reactive({ members: [], permissions: [], isLoading: false, error: "", errors: {} })
        const inputDisabled = ref(false)
        const $route = useRoute();
        const urlUsers = computed(() => `/constructions/${ $route.params.constructionID }/non-members`)

        const rules = {
            members: { type: "Array" },
            permissions: { required: true }
        }

        onMounted(() => {
            const { id, user_id, permissions } = props.item
            state.members = user_id ? [user_id] : []
            state.permissions = permissions || []
            inputDisabled.value = id ? true : false
        })

        async function handleSubmit(){

            const body = {
                construction_id: $route.params.constructionID,
                members: state.members,
                permissions: state.permissions
            }
            state.errors = {}
            state.errors = Rules(body, rules)
            if(Object.entries(state.errors).length) 
                return notify({
                    title: "Preencha os campos obrigatorios",
                    type: "warn",
                    duration: 5000
                })

            state.isLoading = true;
            state.error = ""

            const url = "constructions/members"
            try {
                let title;
                if(props.item.id){
                    const { data } = await axios.put(url, body)
                    emit("set-edit", data);
                    title = "Membro editado!"
                }else{
                    const { data } = await axios.post(url, body)
                    emit("set", data);
                    title = "Membro adicionado!"
                }
                notify({ title, type: "success", duration: 5000 })
                emit("close-modal")
            } catch (error) {
                state.error = error;
            } finally {
                state.isLoading = false;
            }
        }

        return {
            state,
            urlUsers,
            inputDisabled,
            handleSubmit
        }
    }
}
</script>
<style lang="less" scoped>
    .title{
        font-size: 1.8em;
        font-weight: bold;
        margin-bottom: 24px;
        text-align: center;
    }
    .sub-title{
        font-size: 1.7em;
        font-weight: bold;
        margin: 24px 0 16px 0;
    }

    .wrapper-buttons{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-top: 24px;

        .button{
            width: auto;
            min-width: 120px;
            padding: 0 6px;
            height: 40px;
        }
    }
</style>