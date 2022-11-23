<template>
    <Modal @close-modal="$emit('close-modal')" @submit="submit" :maxWidth="500">
        <wrapper-input id="short_description" label="Descrição curta (opcional):" style="margin-bottom:16px" :error="state.errors.short_description">
            <input type="text" class="input" id="short_description" v-model="form.short_description" ref="input" placeholder="Abreviação ou sigla">
        </wrapper-input>

        <wrapper-input id="long_description" label="Descrição longa:" style="margin-bottom:16px" :error="state.errors.long_description">
            <textarea-autosize 
                id="long_description"
                v-model="form.long_description"
                :minHeight="60" 
                :maxLength="255"
                placeholder="Adicione aqui o nome..."
                @set-error="state.errors.long_description = $event" />
        </wrapper-input>

        <form-loading-or-error :isLoading="state.isLoading" :error="state.error"></form-loading-or-error>
        
        <div class="wrapper-buttons">
            <button class="button button-second text-medium" @click="$emit('close-modal')">Cancelar</button>
            <button class="button button-primary text-medium" @click="submit">Salvar</button>
        </div>
    </Modal>
</template>

<script>
import axios from "@/services/api"
import { onMounted, reactive, ref } from 'vue'
import { notify } from "@kyvg/vue3-notification";
import Rules from "@/components/formPage/Rules.js"

export default {
    emits: ["close-modal", "set"],
    props: {
        item: {
            type: Object,
            required: false
        },
        account_type: String
    },
    setup(props, { emit }){
        const input = ref(null)
        const form = reactive({ id: undefined, short_description: "",  long_description: "" })
        const state = reactive({ isLoading: false, error: "", errors: {} });

        const rules = {
            short_description: { maxLength: 128 },
            long_description: { required: true, maxLength: 255 }            
        }

        onMounted(() => {
            input.value.focus();

            const { id, short_description, long_description } = props.item;
            form.id = id || ""
            form.short_description = short_description || ""
            form.long_description = long_description || ""
        })

        async function submit(){
            const url = "/financial/chart-accounts";
            let method, successulMessage, eventName;

            if(props.item.id){
                method = "put";
                successulMessage = "Item editado com sucesso!!";
                eventName = "edit-item";
            }else{
                method = "post";
                successulMessage = "Item criado com sucesso!!";
                eventName = "push-item";
            }

            state.errors = {}
            state.errors = Rules(form, rules);

            if(Object.entries(state.errors).length)
                throw new Error("Preencha os campos obrigatórios")

            state.isLoading = true;
            state.error = ""
            try {
                const { data } = await axios({
                    url,
                    method,
                    data: { ...form, type: props.account_type }
                })
                notify({
                    title: successulMessage,
                    type: "success",
                    duration: 5000
                })
                emit("close-modal")
                emit(eventName, data)
            } catch (error) {
                state.error = error
            } finally {
                state.isLoading = false
            }
        }

        return {
            state,
            form,
            submit,
            input
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper-buttons{
        display: flex;
        justify-content: right;
        align-items: center;

        margin-top: 12px;
    }

    .button{
        width: 90px;
        height: 34px;
        &:first-child{
            margin-right: 12px;
        }
    }

    .container-message{
        width: 100%;
        height: auto;
        background-color: #fcd9d1;
        padding: 10px;
        margin: 20px 0;
        .message{
            font-size: 1.7em;
            color: #5a1709
        }
    }    
</style>