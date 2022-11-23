<template>
    <div class="body-component">
        
        <loading-or-error :isLoading="state.isLoading" :error="state.error" @event-retry="fetchMaterialQuotation" style="background-color: rgba(255, 255, 255, .4)"></loading-or-error>

        <template v-if="!state.isLoading && !state.error || state.data.id">
            <div class="sub-header">
                <div class="row">
                    <h2 class="header-title">Cotação #{{ state.data.number }}</h2>
                </div>
                <div class="row">
                    <p class="text-medium">{{ state.data.company_name }}</p>
                </div>

                <button class="button-refresh" @click="fetchMaterialQuotation">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 20q-3.35 0-5.675-2.325Q4 15.35 4 12q0-3.35 2.325-5.675Q8.65 4 12 4q1.725 0 3.3.713 1.575.712 2.7 2.037V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2Q13.625 6 12 6 9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325Q14.75 20 12 20Z"/></svg>
                </button>
            </div>
            
            <div class="content">
                <global-wrapper label="Messagem">
                    <p class="message">{{ state.data.c_message }}</p>
                </global-wrapper>

                <global-wrapper label="Frete de preferência da construtora">
                    <p class="message">{{ state.data.c_type_freight || 'Não definido' }}</p>
                </global-wrapper>

                <global-wrapper label="Endereço de entrega">
                    <p class="message">{{ state.data.delivery_address || 'Não definido' }}</p>
                </global-wrapper>

                <global-wrapper label="Método de pagamento">
                    <p class="message">{{ state.data.c_payment_method || 'Não definido' }}</p>
                </global-wrapper>

                <global-wrapper style="margin-bottom: 24px" label="Data de expiração">
                    <p class="message">{{ expiration_date }}</p>
                </global-wrapper>

                <div class="form_row">
                    <wrapper-input label="Tipo de frete:">
                        <select class="select" v-model="state.form.p_type_freight">
                            <option value=""></option>
                            <option value="FOB">FOB - Free on board</option>
                            <option value="CIF">CIF - Cost, Insurance and Freight</option>
                        </select>
                    </wrapper-input>

                    <wrapper-input label="Valor da frete:" id="cost_of_freight">
                        <input-money class="input" id="cost_of_freight" v-model="state.form.freight_cost"/>
                    </wrapper-input>

                    <wrapper-input label="Tempo de entrega(Em dias):">
                        <input type="number" class="input" v-model="state.form.delivery_time">
                    </wrapper-input>
                </div>

                <div class="form_row">
                    <wrapper-input label="Condições de pagamento">
                        <payment-terms v-model:payment_term_days="state.form.payment_term_days" v-model:payment_terms="state.form.payment_terms"></payment-terms>
                    </wrapper-input>

                    <wrapper-input label="Valor mínimo do pedido:" id="cost_of_freight">
                        <input-money class="input" id="cost_of_freight" v-model="state.form.minimum_value"/>
                    </wrapper-input>

                    <wrapper-input label="Desconto geral:" id="cost_of_freight">
                        <input-money class="input" id="cost_of_freight" v-model="state.form.general_discount"/>
                    </wrapper-input>
                </div>

                <wrapper-input label="Alguma messagem a construtora?" class="form_spacing_bottom" :error="state.errors.p_message">
                    <textarea-autosize 
                        class="input_error"
                        v-model="state.form.p_message"
                        :maxLength="255"
                        :minHeight="50"
                        placeholder="Anote algo aqui..."
                        @set-error="state.errors.p_message = $event">
                    </textarea-autosize>
                </wrapper-input>
            </div>

            <div class="content">
                <p class="header-title">Itens requiridos</p>

                <item 
                    v-for="item in getItems()" :key="item.id" 
                    :item="item" 
                    @done="openModal(item, 'done')" 
                    @decline="handleDecline(item.id)" 
                    @add-item="openModal({id: item.id }, 'decline')"
                    @reset="handleResetItem(item)">
                    <sub-item v-for="sub_item in getSubItems(item.id)" :key="sub_item.id" :item="sub_item"></sub-item>
                </item>
            </div>
            
            <div class="content content-button">
                <button class="button button-primary text-medium" @click="submitQuotation">Salvar e enviar cotação</button>
            </div>

            <modal 
                v-if="state.modalIsShow" 
                :item="state.item" 
                :evt_action="state.evt_action" 
                @close-modal="closeModal"
                @set="handleSet"/>
        </template>
    </div>
</template>

<script>
import globalWrapper from "../wrapper.vue";
import item from "./components/item.vue";
import subItem from "./components/subItem.vue";
import modal from "./modal/modal.vue";
// 
import paymentTerms from "../paymentTerms.vue"
import inputMoney from "@/components/inputMoney/inputMoney.vue"

import axios from "@/services/api"
import { computed, reactive } from 'vue';
import { useRoute } from "vue-router"
import { useStore as useStoreHistory } from '@/store/history';
import { nanoid } from "nanoid"
import { notify } from '@kyvg/vue3-notification';
import dayjs from "dayjs"

export default {
    components:{
        globalWrapper,
        item,
        subItem,
        modal,
        paymentTerms,
        // 
        inputMoney
    },
    setup(){
        const state = reactive({ isLoading: false, error: "", data: {}, form: {}, errors: {}, modalIsShow: false, item: {}, evt_action: "" })
        const $route = useRoute();
        const history = useStoreHistory();

        const expiration_date = computed(() => {
            if(!state.data.expiration_date) return 'Não definido';
            
            const date = dayjs(state.data.expiration_date);

            const dateFormated = date.format("DD/MM/YYYY"),    
                daysRemaining = date.diff(dayjs().format("YYYY-MM-DD"), "day") 
            let daysRemainingMessage;

            if(daysRemaining > 0){
                daysRemainingMessage = daysRemaining + " restante(s)"
            }else{
                daysRemainingMessage = "Vence hoje"
            }

            return `${ dateFormated } - ${ daysRemainingMessage }`
        })

        async function fetchMaterialQuotation(){
            state.isLoading = true;
            state.error = "";
            const url = `/materials/material-quotations/${ $route.params.id }/public`;
            try {
                const { data } = await axios.get(url)
                state.data = data
                state.form = JSON.parse(JSON.stringify(data))
            } catch (error) {
                state.error = error
            }finally{   
                state.isLoading = false
            }
        }
        fetchMaterialQuotation()

        async function submitQuotation(){
            state.isLoading = true;
            state.error = "";

            const url = `/materials/material-quotations/public`;
            try {
                await axios.post(url, { id: $route.params.id, ...state.form })
                notify({
                    title: "Sucesso ao salvar!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                notify({
                    title: "Erro ao salvar!",
                    type: "error",
                    duration: 5000
                })
            }finally{   
                state.isLoading = false
            }
        }

        function openModal(item = {}, evt_action){
            state.item = item
            state.evt_action = evt_action
            state.modalIsShow = true;
            history.push({ name: "modal", fn: closeModal });
        }
        function closeModal(){
            history.remove("modal");
            state.modalIsShow = false;
        }
        function handleSet(item){
            if(item.answer === "done"){
                const index = state.form.items.findIndex( itm => itm.id === item.id)
                const itm = state.form.items.find( itm => itm.id === item.id)
    
                if(index > -1){
                    state.form.items.splice(index, 1, { ...itm, ...item })
                }
            }else{
                state.form.items.push({
                    _id: nanoid(),
                    parent_id: item.id,
                    material_name: item.material_name,
                    unity: item.unity,
                    total: item.total,
                    discount: item.discount,
                    quantity: item.quantity,
                    anotation: item.anotation,
                    unitary_value: item.unitary_value
                })
            }
        }
        function handleResetItem({ id }){
            const index = state.form.items.findIndex( itm => itm.id === id)
            const itm = state.data.items.find( itm => itm.id === id)
            if(index > -1){
                state.form.items.splice(index, 1, { ...itm })
                state.form.items = state.form.items.filter( item => item.parent_id !== id )
            }
        }

        function handleDecline(id){
            const index = state.form.items.findIndex( itm => itm.id === id)
            const itm = state.form.items.find( itm => itm.id === id)

            if(index > -1){
                state.form.items.splice(index, 1, { ...itm, answer: "decline" })
            }
        }

        function getItems(){
            return state.form.items.filter( item => !item.parent_id)

        }
        function getSubItems(item_id){
            return state.form.items.filter( item => item.parent_id === item_id)
        }

        return {
            state,
            expiration_date,
            // methods
            fetchMaterialQuotation,
            // modal
            openModal,
            closeModal,
            handleSet,
            handleResetItem,
            handleDecline,
            // 
            getItems,
            getSubItems,
            // 
            submitQuotation
        }
    }
}
</script>

<style lang="less" scoped src="../style.less"></style>
<style lang="less" scoped>
    .message{
        font-size: 1.6em;
        color: rgb(80, 80, 80);
    }
    .content-button{
        display: flex;
        justify-content: flex-end;
    }
    .button-primary{
        width: 220px;
        // height: auto;
        padding: 6px 12px;
    }
   
</style>