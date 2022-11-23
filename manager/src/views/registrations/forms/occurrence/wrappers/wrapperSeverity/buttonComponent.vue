<template>
    <div class="wrapper-button">
        <div class="background-disabled" v-if="disabled"></div>    
        
        <div class="handle-click" @click="$emit('event-toggle')">
            <button class="button-select-severity" v-if="showButtonSelectSeverity" >
                + Adicionar
            </button>

            <item  
                v-else
                :severity="severity"
                :risk="risk" 
                :title="risk.title"/>
        </div>
    </div>
</template>

<script>
import item from "./item"

import { computed } from 'vue';

export default {
    name: "button-component",
    components: { item },
    props: {
        severity: Number,
        risks: Array,
        disabled: Boolean
    },
    setup(props){
        const risk = computed( () => props.risks.find(risk => risk.riskCode === props.severity ))

        const showButtonSelectSeverity = computed( () => !(props.severity && props.severity > 0 ))

        return {
            risk,
            showButtonSelectSeverity
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper-button{
        width: 135px;
        position: relative;
    }
    .button-select-severity{
        width: auto;
        height: auto;
        padding: 8px 16px;

        border-radius: 5px;
        border: none;
        font-size: 1.7em;
        cursor: pointer;
    }
    .background-disabled{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(196, 196, 196, 0.322);
        z-index: 1;
    }
</style>