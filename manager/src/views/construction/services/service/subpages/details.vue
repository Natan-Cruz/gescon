<template>
    <div style="padding-top: 10px">
        <ul class="list-info">
            <li>
                <span class="key text-medium bold">Empreiteiro:</span>
                <span class="value text-medium" :class="{ 'without-information': !data.entity_name }"> {{ data.entity_name || "Não definido"}} </span>
            </li>
            <li>
                <span class="key text-medium bold">Descrição:</span>
                <p class="value text-medium" :class="{ 'without-information': !data.description }"> {{ data.description || "Sem descrição"}} </p>
            </li>
            <li>
                <span class="key text-medium bold">Início previsto:</span>
                <span class="value text-medium" :class="{ 'without-information': !data.expected_start_date }"> {{ formatDate(data.expected_start_date) }} </span>
            </li>
            <li>
                <span class="key text-medium bold">Término previsto:</span>
                <span class="value text-medium" :class="{ 'without-information': !data.expected_end_date }"> {{ formatDate(data.expected_end_date) }} </span>
            </li>
            <li>
                <span class="key text-medium bold">Início do serviço:</span>
                <input type="date" class="input" v-model="form.start_date" :disabled="disabled">
            </li>
            <li>
                <span class="key text-medium bold">Término do serviço:</span>
                <input type="date" class="input" v-model="form.end_date" :disabled="disabled">
            </li>
            <li>
                <span class="key text-medium bold">Anotações:</span>
                <textarea-autosize :minHeight="120" placeholder="Descreva aqui alguma anotação (Opcional)" v-model="form.anotations" :disabled="disabled"/>
            </li>
        </ul>
        <!-- slot error componenet -->
        <slot />

        <div class="wrapper-buttons">
            <template v-if="disabled">
                <button class="button button-primary text-medium" @click="disabled = false">Editar</button>
            </template>
            <template v-else>
                <button class="button button-second text-medium" @click="handleCancel">Cancelar</button>
                <button class="button button-primary text-medium" @click="handleSubmit">salvar</button>
            </template>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs"
import { onMounted, reactive, ref } from 'vue'
import { useStore } from '../store'

export default {
    props: {
        data: Object
    },
    setup(props){
        const storeService = useStore();
        const disabled = ref(false)

        const form = reactive({ start_date: undefined, end_date: undefined, anotations: undefined });

        onMounted(() => {
            form.start_date = props.data.start_date
            form.end_date = props.data.end_date;
            form.anotations = props.data.anotations
            disabled.value = true;
        })
        
        function handleCancel(){
            form.start_date = props.data.start_date
            form.end_date = props.data.end_date;
            form.anotations = props.data.anotations 
            disabled.value = true;
        }

        function handleSubmit(){
            storeService.editService({ id: props.data.id, ...form })            
        }


        return {
            formatDate: date => date ? dayjs(date).format("DD/MM/YYYY") : "Data não especificada",
            form,
            disabled,
            handleSubmit,
            handleCancel
        }
    }
}
</script>

<style lang="less" scoped>
    .list-info{
        li{
            border-bottom: dashed 1px gray;
            padding: 16px 0 ;
        }
        li:first-child{
            padding-top: 0;
        }
        li:last-child{
            border-bottom: none;
        }
    }
    .key{
        color: rgb(44, 44, 44);
        display: block;
        margin-bottom: 12px;
    }
    .value{
        margin-left: 12px;
        display: block;
    }
    .without-information{
        color: #b5b5b5;
    }
</style>