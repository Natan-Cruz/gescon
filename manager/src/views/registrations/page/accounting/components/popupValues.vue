<template>
    <div class="no_highlights">
        <label class="btn-more-options" @click.stop="show" :class="computedClass"  :style="computedStyle">
            <p v-if="mainAmount">{{ formatCurrency(mainAmount) }}</p>
            <p v-if="mainAmount !== paymentFineAndReadjustment">{{ formatCurrency(paymentFineAndReadjustment) }}</p>
        </label>

        <transition name="card-attachment-options">
            <div v-if="visible" class="container-more-option">

                <div class="background" @click="hide"></div>

                <div class="card">
                    <p>
                        <span style="margin-right: 4px">Original: </span>
                        <span class="bold" :class="computedClass">{{ formatCurrency(amount || forecast_amount) }}</span>
                    </p>
                    <p>
                        <span style="margin-right: 4px">Correções: </span>
                        <span class="bold" :class="computedClass">{{ formatCurrency(corrections) }}</span>
                    </p>
                    <p>
                        <span style="margin-right: 4px">Multa: </span>
                        <span class="bold" :class="computedClass">{{ formatCurrency(fees) }}</span>
                    </p>
                    <p>
                        <span style="margin-right: 4px">Juros: </span>
                        <span class="bold" :class="computedClass">{{ formatCurrency(fine) }}</span>
                    </p>
                    <p>
                        <span style="margin-right: 4px">Total: </span>
                        <span class="bold" :class="computedClass">{{ formatCurrency((amount || forecast_amount) + corrections + fees + fine) }}</span>
                    </p>
                </div>
            </div>
        </transition>

    </div>
</template>

<script>
import { computed, ref } from "vue"
import { useStore as useStoreHistory } from "@/store/history"
import { formatCurrency, formatDate } from "@/Utils/index.js"

export default {
    props: {
        account_type: String,
        paid_at: String,
        fees: {
            type: Number,
            required: false,
            default: 0
        },
        forecast_amount: {
            type: Number,
            required: false,
            default: 0
        },
        amount: {
            type: Number,
            required: false,
            default: 0
        },
        corrections: {
            type: Number,
            required: false,
            default: 0
        },
        fine: {
            type: Number,
            required: false,
            default: 0
        }
    },
    setup(props){
        const visible = ref(false);
        const history = useStoreHistory()

        function show(){
            history.push({ name: "popup", fn: hide })
            visible.value = true;
        }
        function hide(){
            history.remove("popup")
            visible.value = false;
        }

        const computedClass = computed(() => `amount-${ props.account_type }`)
        const computedStyle = computed(() => props.paid_at ? 'opacity: 1' : 'opacity: 0.7')
        const mainAmount = computed(() => {
            const { amount, forecast_amount, corrections } = props;
            const value = (amount || forecast_amount) + corrections
            return props.account_type === "inflow" ? value : value * -1
        })
        const paymentFineAndReadjustment = computed(() => {
            const { amount, forecast_amount, fine, fees, corrections } = props;
            const value = (amount || forecast_amount) + fine + fees + corrections
            return props.account_type === "inflow" ? value : value * -1
        })

        return {
            visible,
            show,
            hide,
            // 
            computedClass,
            computedStyle,
            paymentFineAndReadjustment,
            // 
            formatCurrency,
            formatDate,
            // 
            mainAmount
        }
    }
}
</script>

<style lang="less" scoped>
    @inflow-color: #287928;
    @outflow-color: #F51720;
    .amount-inflow{ color: @inflow-color; }
    .amount-outflow{ color: @outflow-color; }

    .container-more-option{
        height: 100%;
        z-index: 2000;
        position: relative;
    }
    .background{
        width: 100%;
        height: 100%;

        position: fixed;
        top: 0;
        left: 0;

        background-color: rgba(0,0,0,.2);
        z-index: 2000;
    }
    .btn-more-options{
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;

        p{
            font-size: 1.5em;
            align-self: center;
            white-space: nowrap;
        }
    }
    .card{
        width: auto;
        height: auto;
        box-shadow: 1px 1px 21px 8px rgba(115, 115, 115, .4);
        border-radius: 5px;
        padding: 10px 14px;
        background-color: #fff;
        z-index: 2000;
        position: absolute;
        top: 0;
        right: 0;

        p{
            border-bottom: dashed 1px gray;
            padding-bottom: 4px;
            margin-bottom: 4px;

            &:last-child{
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
        }

        p > span{
            font-size: 1.6em;
        }
    }
</style>