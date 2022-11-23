<template>
    <div style="max-width: 1000px">
        <h2 class="title">Histórico de transações</h2>

        <template v-if="transactions && transactions.length">
            <ul class="ctn">

                <span class="line-detail"></span>

                <li class="header">
                    <p>Pagamentos</p>
                    <p>Consumo</p>
                </li>  

                <item v-for="transaction in transactions" :key="transaction.id" :transaction="transaction" @click="$emit('select-transaction', transaction.id)" />
            </ul>
        </template>
        <p class="text-without-transaction" v-else>Nenhuma transação</p>
    </div>
</template>

<script>
import item from '../components/itemTransaction.vue'

export default {
    components: { item },
    props: {
        transactions: Array
    }
}
</script>

<style lang="less" scoped>
    // incoming --> pagamentos
    // outgoing --> consumo
    .ctn{
        position: relative;
    }
    .header{
        width: 100%;
        margin-bottom: 24px;

        p{
            font-size: 1.7em;
            width: 50%;
            display: inline-block;
            text-align: center;
        }
    }

    .line-detail{
        display:block;
        width: 1px;
        height: 100%;
        background-color: #f70;
        position: absolute;
        left: 50%;
        top: 0;
    }

    .text-without-transaction{
        font-size: 1.7em;
        margin-top: 32px;
        text-align: center;
    }

    @media screen and (max-width: 700px) {
        .header{
            display: none;
        }
        .line-detail{
            left: 8px;
        }
    }
</style>