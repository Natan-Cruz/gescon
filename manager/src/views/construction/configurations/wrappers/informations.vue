<template>
    <div class="main-wrapper">
        <div class="header" style="max-width: 500px">
            <h2 class="sub-title bold">Infomações da obra:</h2>

            <button class="button button-primary text-medium" @click="$emit('show-modal')">Editar</button>
        </div>

        <p class="input-construction-name">{{ construction.name }}</p>

        <ul class="list-informations">
            <div class="list-item">
                <span class="key bold">Início planejado:</span>
                <span class="value" :class="{ 'gray': !construction.planned_start_date }">{{ formatDate(construction.planned_start_date) || "Não especificada" }}</span>
            </div>
            <div class="list-item">
                <span class="key bold">Término planejado:</span>
                <span class="value" :class="{ 'gray': !construction.planned_end_date }">{{ formatDate(construction.planned_end_date) || "Não especificada" }}</span>
            </div>
            <div class="list-item">
                <span class="key bold">Início real:</span>
                <span class="value" :class="{ 'gray': !construction.start_date }">{{ formatDate(construction.start_date) || "Não especificada" }}</span>
            </div>
            <div class="list-item">
                <span class="key bold">Término real:</span>
                <span class="value" :class="{ 'gray': !construction.end_date }">{{ formatDate(construction.end_date) || "Não especificada" }}</span>
            </div>
            <li class="list-item">
                <p class="key">Endereço:</p>
                <p class="value">{{ construction.street }} - {{ construction.neighborhood }} - {{ construction.number }} - {{ construction.city }} - {{ construction.state }}</p>
            </li>
            <li class="list-item">
                <p class="key" style="vertical-align: top;">Descrição:</p>
                <p class="value">{{ construction.description || "Não especificado"}}</p>
            </li>
        </ul>

        <div style="margin-top: 24px">
            <toggle v-model="enabled" @toggle="handleInput" label="Obra arquivada"/>
        </div>
    </div>
</template>

<script>
import toggle from '@/components/toggle/toggle.vue'
import { formatDate } from "@/Utils/index.js"
import { onMounted, ref } from 'vue'
import axios from '@/services/api';
import { notify } from '@kyvg/vue3-notification';

export default {
    emits: ["show-modal"],
    components: { toggle },
    props:{
        construction: Object,
    },
    setup(props){
        const enabled = ref(false)

        onMounted(() => enabled.value = !props.construction.enabled)

        async function handleInput(isChecked){
            try {
                await axios.put("/constructions", { id: props.construction.id, enabled: !isChecked })
                notify({
                    title: !isChecked ? "Obra desarquivada!" : "Obra arquivada!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                notify({
                    title: "Ocorreu um problema, tente novamente",
                    type: "error",
                    duration: 5000
                })

                enabled.value = !isChecked
            }
        }

        return {
            enabled,
            formatDate,
            handleInput
        }
    }
}
</script>

<style lang="less" scoped >
    .input-construction-name{
        font-size: 2.4em;
        font-weight: bold;
    }

    .list-item{
        border-bottom: 1px dashed #bebebe;
        padding: 10px 0;
        font-size: 1.6em;

        &:last-child{
            border:none;
            padding-bottom: 0;
        }
        p, span{
            font-size: 1em;
        }
        .key{
            font-weight: bold;  
            display: inline-block;
            text-align: right;
            width: 160px;
            margin-right: 12px;
        }
        .value{
            display: inline-block;
            color: #707070;
        }
    }
</style>