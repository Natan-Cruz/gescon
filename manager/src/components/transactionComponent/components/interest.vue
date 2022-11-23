<template>
    <div class="form_row">
            <!-- late free -->
        <wrapper-input label="Multa por atraso:" id="late_fee">
            <div class="content-inputs">
                <select class="select" v-model="type_late_fee" @input="setFocusLateFee()" :disabled="disabled">
                    <option value="value">Valor</option>
                    <option value="percentage">Percentual</option>
                </select>

                <input-money id="late_fee" class="input" v-model="late_fee" ref="input_late_fee" :disabled="disabled" :options="lateFeeOptions"/>
            </div>
        </wrapper-input> 
            <!--  -->
        <wrapper-input label="Correção do atraso:" id="monetary_correction" :error="errors.type_monetary_correction || errors.frequency_monetary_correction || errors.monetary_correction">
            <div class="content-inputs">
                <select class="select" v-model="type_monetary_correction" :disabled="disabled">
                    <option value="value">Valor</option>
                    <option value="percentage">Percentual</option>
                </select>
                <select class="select" v-model="frequency_monetary_correction" :disabled="disabled" @input="setFocusMonetaryPerDay()">
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                </select>
                <input-money id="monetary_correction" class="input" 
                    ref="input_monetary_correction"
                    v-model="monetary_correction"
                    :disabled="disabled" 
                    :options="correctionOptions"/>
            </div>
        </wrapper-input>
    </div>
</template>

<script>
import inputMoney from "@/components/inputMoney/inputMoney.vue"
import { computed, ref } from "vue";

export default {
    emits: ["event-edit"],
    components: { inputMoney },
    props: {
        trx: Object,
        index: Number,
        disabled: Boolean,
        errors: Object
    },
    setup(props, { emit }){
      
        // late fee ou multa pela falta de pagamento
        const input_late_fee = ref(null)
        const lateFeeOptions = computed(() => formatOptions(type_late_fee.value))

        const type_late_fee = computed({
            get: () => props.trx.type_late_fee,
            set: type_late_fee => emit("event-edit", { ...props.trx, type_late_fee })
        })
        const late_fee = computed({
            get: () => props.trx.late_fee,
            set: late_fee => emit("event-edit", { ...props.trx, late_fee })
        })
       
        function setFocusLateFee(){
            input_late_fee.value.setFocus()
        }
        //  ------------------------------------------------- //

        // monetary correction ou correcao monetaria
        const input_monetary_correction = ref(null);
        const correctionOptions = computed(() => formatOptions(type_monetary_correction.value))

        const type_monetary_correction = computed({
            get: () => props.trx.type_monetary_correction,
            set: type_monetary_correction => emit("event-edit", { ...props.trx, type_monetary_correction })
        })
        const frequency_monetary_correction = computed({
            get: () => props.trx.frequency_monetary_correction,
            set: frequency_monetary_correction => emit("event-edit", { ...props.trx, frequency_monetary_correction })
        })
        const monetary_correction = computed({
            get: () => props.trx.monetary_correction,
            set: monetary_correction => emit("event-edit", { ...props.trx, monetary_correction })
        })

        function setFocusMonetaryPerDay(){
            input_monetary_correction.value.setFocus()
        }

        // format options percetage or money value
        function formatOptions(type){
            switch(type){
                case "value": return { prefix: "R$", sufix: "", decimals: 2 };
                case "percentage": return { prefix: "", sufix: "%", decimals: 2 };
            }
        }


        return {
            // late fee
            input_late_fee,
            lateFeeOptions,
            type_late_fee,
            late_fee,
            setFocusLateFee,

            // monetary correction 
            type_monetary_correction,
            frequency_monetary_correction,
            monetary_correction,

            // methods or computed
            input_monetary_correction,
            correctionOptions,
            setFocusMonetaryPerDay,
        }
    }
}
</script>

<style lang="less" scoped>
    .content-inputs{
        display: flex;

        .select{
            width: 140px;
            margin-right: 4px;
        }
    }
</style>