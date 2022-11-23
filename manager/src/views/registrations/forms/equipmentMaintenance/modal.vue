<template>
    <div class="global__modal">
        <div class="global__background-modal" @click="$emit('close-modal')"></div>
        <div class="global__wrapper-modal">

            <wrapper-input id="title" label="Descricao:" class="form_spacing_bottom">
                <textarea-autosize></textarea-autosize>
            </wrapper-input>

            <div class="form_row">
                <wrapper-input label="Data de contratação:">
                    <input type="date" class="input" id="name" :disabled="formDisabled">
                </wrapper-input>
                <wrapper-input label="Data de devolução:">
                    <input type="date" class="input" id="name" :disabled="formDisabled">
                </wrapper-input>
            </div>
            
            <!-- error msg -->
            <div class="container-error" v-show="state.errorMsg">
                <div class="msg">{{ state.errorMsg }}</div>
            </div>
          
            <!-- BTN SAVE ALTERATIONS -->
            <div class="wrapper-buttons">
                <button class="button button-second text-medium" style="margin-right: 16px" @click="$emit('close-modal')">Cancelar</button>
                <button class="button button-primary text-medium" @click="submit">salvar</button>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
    emits: ["close-modal", "set"],
    props: {
        item: Object
    },
    setup(props, { emit }){
        const { item } = toRefs(props)

        const form = reactive({ id: undefined, title: "", description: "", type: "" })
        const state = reactive({ errorMsg: "" })

        form.id = item.value.id
        form.title = item.value.title
        form.description = item.value.description
        form.type = item.value.type

        async function submit(){
            if(!form.title || !form.description)
                return state.errorMsg = "Preencha todos os campos, por favor!!"

            emit("set", { ...form })
            emit("close-modal")
        }

        return {
            state,
            form,
            submit,
        }
    }
}
</script>