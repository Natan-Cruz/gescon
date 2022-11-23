<template>
    <form-page title="Voltar" linkBack="/main/services-sheet" :config="config">

        <wrapper-input label="Nome:" class="form_spacing_bottom" :error="errors.name">
            <input type="text" class="input" v-model="form.name" placeholder="Nome aqui..." :disabled="disabled">
        </wrapper-input>

        <wrapper-input label="Descricão do serviço(Opcional):" class="form_spacing_bottom" :error="errors.description">
            <textarea-autosize v-model="form.description" :minHeight="80" placeholder="Descricao aqui..." :disabled="disabled" />
        </wrapper-input>


        <div class="form_row">
            <wrapper-input label="Quem irá fornecer o serviço?">
                <input-suggest-list
                    url="/registrations/service-provider"
                    :options="{ key: 'id', displayName: 'name'}"
                    placeholder="Selecione um fornecedor" v-model="form.entity_id" :disabled="disabled">
                </input-suggest-list>
            </wrapper-input>

            <wrapper-input label="Em qual obra?" :error="errors.construction_id" >
                <input-suggest-list
                    url="/constructions"
                    :options="{ key: 'id', displayName: 'name', default: true}"
                    placeholder="Selecione uma obra" v-model="form.construction_id" :disabled="disabled">
                </input-suggest-list>
            </wrapper-input>
        </div>

        <template v-if="hasData">
            <hr class="hr-form">

            <div class="form_row form_spacing_bottom">
                <wrapper-input label="Data de início esperada:">
                    <input type="date" class="input" v-model="form.expected_start_date" :disabled="disabled">
                </wrapper-input>
                <wrapper-input label="Data de término esperada:">
                    <input type="date" class="input" v-model="form.expected_end_date" :disabled="disabled">
                </wrapper-input>
            </div>

            <div class="form_row form_spacing_bottom">
                <wrapper-input label="Data de início real:">
                    <input type="date" class="input" v-model="form.start_date" :disabled="disabled">
                </wrapper-input>
                <wrapper-input label="Data de término real:">
                    <input type="date" class="input" v-model="form.end_date" :disabled="disabled">
                </wrapper-input>
            </div>
        </template>


        <hr class="hr-form">
        <p class="sub-title">Produção</p>
        <div class="form_row form_spacing_bottom">
            <wrapper-input label="Em qual unidade?">
                <input type="text" class="input" v-model="form.production_unity" :disabled="disabled">
            </wrapper-input>
            <wrapper-input label="Total:">
                <input type="text" class="input" v-model="form.production_total" :disabled="disabled">
            </wrapper-input>
             <wrapper-input label="Mão de obra alocada:">
                <input type="number" class="input" v-model="form.allocated_labor" :disabled="disabled">
            </wrapper-input>
        </div>

        <hr class="hr-form">
        
        <wrapper-input label="Quais local serão executados os serviços" class="form_spacing_bottom" :error="errors.locals">
            <input-suggest-tree
                url="/financial/cost-center"
                :options="{ key: 'path', displayName: 'name', multi_select: true }"
                placeholder="Selecione um centro de custo"
                v-model="form.locals" :disabled="disabled" >
            </input-suggest-tree>
        </wrapper-input>


        <hr class="hr-form">
        <p class="sub-title">Itens de verificações</p>
        <check-items v-model:check_items="form.check_items" :disabled="disabled" @select-item="handleAddCheckItem"/>
    </form-page>
    <modal v-if="modalIsShow" :item="item" @close-modal="closeModal" @set="handleSet"></modal>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import inputSuggestTree from "@/components/inputSuggest/inputSuggestTree.vue"
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import checkItems from "./checkItems/checkItems.vue"
import modal from "./modal.vue"

import { useStore } from "@/components/formPage/store.js";
import { useStore as useStoreHistory } from "@/store/history";
import { storeToRefs } from "pinia" 
import { useRoute, useRouter } from "vue-router"
import { ref } from 'vue'

export default {
    components:{
        formPage, inputSuggestTree, inputSuggestList,
        checkItems, modal
    },
    setup(){
        const store = useStore();
        store.resetState()
        
        const history = useStoreHistory()
        const $route = useRoute();
        const $router = useRouter();
        const modalIsShow = ref(false)
        const item = ref({})

        const { form, errors, editMode, hasData } = storeToRefs(store);

        const config = {
            urls: {
                fetch: "/services/s/?",
                create: "/services/s",
                edit: "/services/s",
                delete: ""
            },
            rules: {
                name: { required: true },
                description: { required: true },
                construction_id: { required: true },
                locals: { required: true }
            }
        }

        function handleAddCheckItem(id){
            if(hasData.value)
                $router.push({ 
                    name: "registrations/form_service_sheet_check_item", 
                    params: { 
                        service_id: $route.params.id, 
                        id: id 
                    }, 
                    query: { 
                        previous: $route.fullPath, 
                        forceBack: true,
                        construction_id: form.value.construction_id
                    }
                })
            else{
                item.value = form.value.check_items ? form.value.check_items.find( item => item.id === id) : {}
                openModal()
            }
        }

        function openModal(){
            history.push({ name: "modal"})
            modalIsShow.value = true;
        }

        function closeModal(){
            history.remove("modal")
            modalIsShow.value = false;
        }

        function handleSet({ id, item }){
            if(id){
                form.value.check_items = form.value.check_items.map( itm => {
                    if(itm.id === id) 
                        itm = item;

                    return itm
                })
            } else {
                store.$patch( state => {
                    if(state.form.check_items)
                        state.form.check_items.push(item)
                    else
                        state.form.check_items = [item]
                })
            }
        }

        return {
            config,
            disabled: editMode,
            form,
            errors,
            hasData,
            // modal
            item,
            modalIsShow,
            //methods
            handleAddCheckItem,
            openModal,
            closeModal,
            handleSet
        }
    }
}
</script>
<style lang="less" scoped>
    .sub-title{
        font-size: 1.8em;
        color: rgb(53, 53, 53);
        font-weight: bold;
        margin-bottom: 24px;
    }
</style>