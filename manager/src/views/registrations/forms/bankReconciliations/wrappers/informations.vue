<template>
    <div class="wrapper-informations">
        <div class="wrapper">
            <label for="" class="label">Data de início:</label>
            <input type="date" class="input" v-model="started_at">
        </div>

        <div class="wrapper">
            <label for="" class="label">Data final:</label>
            <input type="date" class="input" v-model="ended_at">
        </div>
        
        <div class="wrapper">
            <label for="closing_balance" class="label">Fechamento do balanço:</label>
            <input-money id="closing_balance" class="input input-balance" v-model="closing_balance"/>
        </div>

        <div class="wrapper">
            <label for="" class="label">Conta:</label>
            <input-suggest-list
                url="/financial/bank/accounts"
                :options="{ key: 'id', displayName: 'name' }"
                v-model="account_id" />
        </div>
        <button class="button button-primary text-medium" @click="$emit('event-fetch-transactions')">Buscar</button>
    </div>
</template>

<script>
import inputSuggestList from "@/components/inputSuggest/inputSuggestList.vue"
import inputMoney from "@/components/inputMoney/inputMoney.vue"
import { useStore } from "@/components/formPage/store.js";
import { toRef } from "vue"

export default {
    name: "wrapper-informations",
    components: {
        inputSuggestList,
        inputMoney
    },
    setup(){
        const store = useStore()

        const started_at = toRef(store.form, "started_at")
        const ended_at = toRef(store.form, "ended_at")
        const closing_balance = toRef(store.form, "closing_balance")
        const account_id = toRef(store.form, "account_id")

        return {
            started_at,
            ended_at,
            closing_balance,
            account_id,
        }
    }
}
</script>

<style lang="less" scoped src="../style.less"></style>
<style lang="less" scoped>
    .wrapper-informations{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        column-gap: 12px;
        row-gap: 12px;
    }
    .input-balance{
        width: 185px;
    }
    .button{
        width: 120px;
        height: 40px;
        margin-top: 26px;
    }
</style>