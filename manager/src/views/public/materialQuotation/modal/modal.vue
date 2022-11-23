<template>
    <Modal @close-modal="$emit('close-modal')" :maxWidth="700">

        <div v-show="isDecline" class="form_row">
            <wrapper-input label="Nome do material:" id="material_name" :error="errors.material_name">
                <input type="text" class="input" id="material_name" v-model="form.material_name" ref="input_name"/>
            </wrapper-input>


            <!-- <wrapper-input label="Marca do material:" id="brand_material">
                <input type="text" class="input" id="brand_material" v-model="form.brand_material" />
            </wrapper-input> -->
        </div>

        <div class="form_row">
            <wrapper-input label="Valor unitário" id="unitary_value" :error="errors.unitary_value">
                <input-money class="input" id="unitary_value" v-model="form.unitary_value" @input="calcTotal" ref="input_price"/>
            </wrapper-input>

            <wrapper-input v-show="isDecline" label="Unidade" id="unity" :error="errors.unity">
                <input class="input" id="unity" v-model="form.unity"/>
            </wrapper-input>

            <wrapper-input  label="Quantidade" id="unity" :error="errors.quantity">
                <input class="input" id="unity" v-model="form.quantity" :disabled="!isDecline" @input="calcTotal"/>
            </wrapper-input>
        </div>

        {{ form }}

        <!-- <p class="text-medium form_spacing_bottom"><span class="sub-text bold">Quantidade: </span> {{ item.quantity }}</p> -->

        <div class="form_row">
            <wrapper-input label="Desconto" id="discount">
                <input-money class="input" id="discount" v-model="form.discount" @input="calcTotal"/>
            </wrapper-input>

            <wrapper-input label="Total" id="total">
                <input-money class="input" id="total" v-model="form.total"/>
            </wrapper-input>
        </div>

        <div class="wrapper-buttons">
            <button class="button button-second text-medium" @click="$emit('close-modal')">Cancelar</button>
            <button class="button button-primary text-medium" @click="submit">Ok</button>
        </div>
    </Modal>
</template>

<script>
/* eslint-disable */
import { computed, onMounted, reactive, ref } from 'vue'
import inputMoney from "@/components/inputMoney/inputMoney.vue"
import Rules from "@/components/formPage/Rules.js"
import { notify } from "@kyvg/vue3-notification";

export default {
    emits: ["close-modal", "set"],
    components: { inputMoney },
    props: {
        item: {
            type: Object,
            required: false
        },
        evt_action: String
    },
    setup(props, { emit }){
        const form = reactive({ id: undefined, material_name: undefined, unitary_value: undefined, discount: undefined, total: undefined })
        const input_name = ref(null)
        const input_price = ref(null) 
        const errors = ref({})

        const declineRules = {
            material_name: { required: true },
            unitary_value: { required: true },
            unity: { required: true },
            total: { required: true },
        }
        const doneRules = {
            unitary_value: { required: true },
            total: { required: true },
        }

        const isDecline = computed(() => props.evt_action === "decline")

        onMounted(() => {
            const { id, material_name, unitary_value, discount, total, quantity } = props.item;
            form.id = id || ""
            form.material_name = material_name || undefined
            form.unitary_value = unitary_value || undefined
            form.discount = discount || undefined
            form.total = total || undefined
            form.quantity = quantity || undefined
            form.answer = props.evt_action

            if(props.evt_action === "decline"){
                input_name.value.focus()
            }
            if(props.evt_action === "done"){
                input_price.value.setFocus()
            }
        })

        async function submit(){
            errors.value = {}
            if(props.evt_action === "decline"){
                errors.value = Rules(form, declineRules);
            }
            if(props.evt_action === "done"){
                errors.value = Rules(form, doneRules);
            }

            if(Object.entries(errors.value).length)
                return notify({
                    title: "Preencha os campos obrigatórios",
                    type: "warn",
                    duration: 5000
                })

            emit("set", form)
            emit("close-modal")  
        }

        function calcTotal(){
            form.total = (form.unitary_value * form.quantity) - (form.discount || 0)
        }

        return {
            form,
            errors,
            isDecline,
            // 
            input_name,
            input_price,
            // 
            submit,
            calcTotal
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