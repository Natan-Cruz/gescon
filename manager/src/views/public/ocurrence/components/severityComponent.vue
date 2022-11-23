<template>
    <li class="item">
        <span class="detail" :style="{ backgroundColor: risk.color }"></span>
        <span class="text">{{ risk.title }}</span>
    </li>
</template>

<script>
import { computed } from 'vue';

export default {
    props: { severity: Number },
    setup(props){
        const risks = [
            { riskCode: 1, color: "#00ac46", title: "Muito baixo" },
            { riskCode: 2, color: "#fdc500", title: "Baixo" },
            { riskCode: 3, color: "#fd8c00", title: "Moderado" },
            { riskCode: 4, color: "#dc0000", title: "Alto" },
            { riskCode: 5, color: "#780000", title: "Muito alto" }
        ];

        const risk = computed(() => risks.find(risk => risk.riskCode === props.severity))

        return {
            risk
        }
    }
}
</script>



<style lang="less" scoped >
    .item{
        max-width: 180px;
        position: relative;
        height: 34px;
        margin-bottom: 12px;
        
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 0 6px;
        border-radius: 5px;
        background-color: rgb(224, 224, 224);
    }
    .detail{
        content: "";
        display: block;
        width: 26px;
        height: 26px;
    }

    .text{
        font-size: 1.7em;
        line-height: 1em;
        margin-left: 10px;
    }
</style>