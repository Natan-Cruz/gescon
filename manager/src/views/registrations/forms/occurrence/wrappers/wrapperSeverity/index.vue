<template>
    <div class="select-severity-occurrence">
        <button-component 
            :severity="severity"
            :risks="risks"
            :disabled="disabled"
            @event-toggle="toggle" />
            
        <wrapper-component 
            v-show="isOpen" 
            :severity="severity"
            :risks="risks"
            @event-close="toggle" 
            @event-select-severity-occurrence="$emit('event-select-severity-occurrence', $event)" />
    </div>
</template>

<script>
import buttonComponent from "./buttonComponent.vue";
import wrapperComponent from "./wrapperComponent.vue";

import { ref } from 'vue';
import { useStore as useStoreHistory } from "@/store/history.js"

export default {
    name: "select-severity-occurrence",
    components: {
        buttonComponent,
        wrapperComponent
    },
    props: {
        severity: Number,
        disabled: Boolean
    },
    setup(){
        const history = useStoreHistory();
        const isOpen = ref(false)
        const risks = [
            {
                riskCode: 1,
                color: "#00ac46",
                title: "Muito baixo"
            },
            {
                riskCode: 2,
                color: "#fdc500",
                title: "Baixo"
            },
            {
                riskCode: 3,
                color: "#fd8c00",
                title: "Moderado"
            },
            {
                riskCode: 4,
                color: "#dc0000",
                title: "Alto"
            },
            {
                riskCode: 5,
                color: "#780000",
                title: "Muito alto"
            },
        ]

        function toggle(){
            if(isOpen.value){
                history.remove("popup_severity")
            } else{
                history.push({ name: "popup_severity", fn: () => isOpen.value = false })
            }
            isOpen.value = !isOpen.value;
        }

        return {
            isOpen,
            risks,
            toggle
        }
    },
}
</script>

<style lang="less" scoped>
    .select-severity-occurrence{
        width: 100%;
        height: 34px;
        position: relative;
    }
</style>