<template>
    <div class="item-production">
        <div class="display_flex">
            <wrapper-input :label="`Valor(${ production_unity }):`" style="width: 49%">
                <input type="number" id="value" class="input" v-model="value" :disabled="disabled">   
            </wrapper-input>

            <wrapper-input label="Mão de obra(Qtd.):" style="width: 49%">
                <input type="number" id="value" class="input" v-model="allocated_labor" :disabled="disabled"> 
            </wrapper-input>
        </div>

        <wrapper-input label="Data:">
            <input type="date" id="value" class="input" v-model="date" :disabled="disabled"> 
        </wrapper-input>
    </div>
</template>

<script>
import { computed, ref } from 'vue';

export default {
    props: {
        production_unity: String,
        index: Number,
        item: Object
    },
    setup(props, { emit }){
        const value = computed({
            get: () => props.item.value,
            set: value => emit("set", { index: props.index, item: { ...props.item, value }})
        })
        const allocated_labor = computed({
            get: () => props.item.allocated_labor,
            set: allocated_labor => emit("set", { index: props.index, item: { ...props.item, allocated_labor }})
        })
        const date = computed({
            get: () => props.item.date,
            set: date => emit("set", { index: props.index, item: { ...props.item, date }})
        })

        const disabled = ref(false)

        disabled.value = props.item.id && true

        return {
            value,
            allocated_labor,
            date,
            disabled
        }
    }
}
</script>

<style lang="less" scoped>
    .item-production{
        width: 100%;
        max-width: 380px;

        margin-bottom: 24px;

        &:last-child{
            margin-bottom: 0;
        }
    }
    .display_flex{
        display: flex;
        justify-content: space-between;
        align-content: center;
    }
</style>