<template>
    <div class="modal" >
        <div class="background" @click="$emit('close-modal')"></div>
        <div class="wrapper-modal">
            <wrapper-input label="Nome" class="form_spacing_bottom">
                <input type="text" class="input" v-model="form.name" placeholder="Nome aqui..." ref="input">
            </wrapper-input>

            <wrapper-input label="Método de checagem" class="form_spacing_bottom">
                <textarea-autosize v-model="form.check_method" :minHeight="80" placeholder="Descreva o método de checagem aqui..."></textarea-autosize>
            </wrapper-input>
<!-- 
            <wrapper-input label="Alguma anotação?" class="form_spacing_bottom">
                <textarea-autosize v-model="form.anotations" :minHeight="80" placeholder="A descreva aqui..."></textarea-autosize>
            </wrapper-input> -->
         
            <div class="wrapper-buttons">
                <button class="button button-second text-medium" @click="$emit('close-modal')">Cancelar</button>
                <button class="button button-primary text-medium" @click="$emit('set', { id: item.id, item: form }); $emit('close-modal')">salvar</button>
            </div>
        </div>  
    </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { randomID } from "@/Utils/index.js"

export default {
    emits: ["close-modal", "set"],
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    setup(props){
        const { item } = toRefs(props)
        const input = ref(null)

        const form = reactive({ name: "", check_method: "" })

        form.id = randomID()
        form.name = item.value.name || "" ;
        form.check_method = item.value.check_method || ""
        // form.anotations = item.value.anotations || ""

        onMounted(() => {
            input.value.focus()
        })

        return{
            form,
            input
        }
    }
}
</script>

<style lang="less" scoped>
    .modal{
        width: 100%;
        height: 100vh;

        display: flex;
        align-items: center;
        justify-content: center;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
    }
    .background{
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .2);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }
    .wrapper-modal{
        width: 80%;
        max-width: 400px;
        height: auto;

        background-color: #fff;
        border-radius: 5px;

        padding: 20px;
    }

    .wrapper-buttons{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 16px;
    }
    .button{
        width: 120px;
        height: 36px;
        &:first-child{
            margin-right: 24px;
        }
    }
    hr{
        border: none;
        border-bottom: dashed 1px rgb(170, 170, 170);
        margin: 12px 0
    }
    .button-delete{
        background-color: #C70000;
    }
</style>