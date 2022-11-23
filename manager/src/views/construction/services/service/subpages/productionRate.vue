<template>
    <div>
        <p class="sub-title">Adicionar produção</p>

        <div class="form_row">
            <wrapper-input :label="`Quantidade produzida(${ data.production_unity }):`">
                <input type="nuber" class="input" v-model="form.value" :disabled="disabled"/>
            </wrapper-input>
            <wrapper-input label="Mão de obra alocada:">
                <input type="number" class="input" v-model="form.allocated_labor" :disabled="disabled">
            </wrapper-input>
            <wrapper-input label="Data:">
                <input type="date" class="input" v-model="form.date" :disabled="disabled">
            </wrapper-input>
        </div>

        <ul class="list-info">
            <li>
                <span class="key text-medium bold">Acumulado:</span>
                <span class="text-medium value">{{ acumulate }}{{ data.production_unity }}</span>
            </li>
            <li>
                <span class="key text-medium bold">Unidade:</span>
                <span class="text-medium value">{{ data.production_unity }}</span>
            </li>
            <li>
                <span class="key text-medium bold">Mão de obra alocada esperada:</span>
                <span class="text-medium value">{{ data.allocated_labor }}</span>
            </li>
        </ul>
        <!-- slot error componenet -->
        <slot />

        <button v-show="hasItem" class="button-delete" @click="handleDeleteProduction">Deletar</button>

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
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '../store'
import dayjs from 'dayjs'

export default {
    props: {
        data: Object
    },
    setup(props, { emit }){
        const storeService = useStore()
        const $route = useRoute()
        const form = reactive({ value: "", allocated_labor: "", date: dayjs().format("YYYY-MM-DD") });
        const disabled = ref(false)
        const data = computed(() => {
            const item = props.data.productions.find( item => item.id === $route.params.rate_id)
            return item
        })
        const acumulate = computed(() => {
            if(!data.value) return ""

            if(data.value.productions && data.value.productions.length)
                return data.value.productions[0].acumulate
            else
                return ""
        })

        const hasItem = computed(() => data.value && true)

        if(data.value){
            form.value = data.value.value || ""
            form.allocated_labor = data.value.allocated_labor || "";
            form.date = data.value.date || "";
            disabled.value = true;
        }

        function handleCancel(){
            form.value = data.value.value || ""
            form.allocated_labor = data.value.allocated_labor || "";
            form.date = data.value.date || "";
            disabled.value = true;
        }

        function handleSubmit(){
            const rateId = $route.params.rate_id 
            if(rateId){
                storeService.editProduction({ id: rateId, ...form }, () => disabled.value = true)
            }else{
                // esta em array porque o servidor requisita
                storeService.saveProduction([{ service_id: props.data.id, ...form }], () => emit("event-back"))
            }
        }

        function handleDeleteProduction(){
            storeService.deleteProduction(data.value.id, () => emit("event-back"))
        }

        return {
            form,
            acumulate,
            disabled,
            hasItem,
            // methods
            handleSubmit,
            handleCancel,
            handleDeleteProduction
        }
    }
}
</script>

<style lang="less" scoped>
    .list-info{
        li{
            border-top: dashed 1px gray;
            padding: 16px 0 ;
        }
        li:last-child{
            border-bottom: dashed 1px gray;
        }
    }
    .key{
        color: rgb(104, 104, 104);
        display: inline-block;
    }
    .value{
        margin-left: 12px;
    }
    .without-information{
        color: #b5b5b5;
    }

    .button-delete{
        width: auto;
        height: auto;
        border: none;

        padding: 6px 12px;
        font-size: 1.7em;
        font-weight: bold;
        border-radius: 5px;

        margin-top: 16px;
        color: #fff;
        cursor: pointer;

        &:active{
            transform: scale(.8);
        }
    }
</style>