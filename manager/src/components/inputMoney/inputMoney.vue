<template>
    <input type="text" v-model="model" ref="input"> 
</template>

<script>
import { computed, ref } from 'vue'
import bigDecimal from 'js-big-decimal';

export default {
    props: {
        value: {
            type: [String, Number],
            required: false
        },
        modelValue: {
            type: [String, Number],
            required: false
        },
        options: {
            type: Object,
            required: false,
            default: () => ({
                prefix: "R$",
                sufix: "",
                decimals: 2
            })
        }
    },
    setup(props, { emit, expose}){
        const input = ref(null)

        const model = computed({
            get: () => {
                const modelValue = props.modelValue || props.value; 
                return modelValue ? formaterNumber(modelValue) :  `${ props.options.prefix }0,00${ props.options.sufix }`
            },
            set: value => {
                emit("update:modelValue", parseFloat(clearNumber(value)));
            }
        })

        function setFocus(){
            input.value.focus()
        }

        function clearNumber(string){
            const oldValue = Math.round(props.modelValue * Math.pow(10, props.options.decimals));
            let newValue = parseInt(string.replace(props.options.prefix, "").replace(props.options.sufix, "").replace(/\./g, "").replace(/,/g, ""))
            // numero iguais com input significa que usuario quis apagar
            if(oldValue === newValue && oldValue !== 0 && newValue !== 0){
                newValue /= 10;
            }
            return bigDecimal.round(newValue / Math.pow(10, props.options.decimals), props.options.decimals)
        }

        function formaterNumber(v){
            if(!v || (typeof v !== "number" && typeof v !== "string"))
                return 0

            let value = v
            if(typeof v === "number")
                value = v.toFixed(props.options.decimals)

            // quebra um string de numeros em um array de string de numeros
            const splited = value.replace(/\./g, "").split("")
            // se nao houver retorna o padrao
            if(splited.length === 1)
                return `R$ 0.00`

            const preLeft = splited.slice(0, splited.length - props.options.decimals);
            const left = !preLeft.length ? "0" : preLeft.join("").replace(/^0{2,}/,"") //0000.23 -> 0.23
            const right = splited.slice(-props.options.decimals).join("")
            return `${ props.options.prefix }${separator(left)},${right}${ props.options.sufix }`
        }
        function separator(numb) {
            var str = numb.toString().split(".");
            str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return str.join("");
        }

        expose({ setFocus })

        return {
            input,
            model,
            clearNumber,
            formaterNumber
        }
    }
}
</script>