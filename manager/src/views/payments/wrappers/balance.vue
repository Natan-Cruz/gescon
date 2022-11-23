<template>
    <div class="wrapper">

        <p class="title">Geral</p>
        <div class="wrapper-balance">
            <ul class="content">
                <li class="card">
                    <p class="card-title">Saldo</p>
                    <p class="text">{{ formatCurrency(informations.balance) }}</p>
                </li>
                <li class="card">
                    <p class="card-title">Consumo por mês</p>
                    <p class="text">{{ formatCurrency(informations.consumption_per_month) }}</p>
                </li>
                <li class="card">
                    <p class="card-title">Meses restantes</p>
                    <p class="text">{{ informations.remaining_months }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { formatCurrency } from "@/Utils/index.js"

export default {
    props: {
        informations: {
            type: Object,
            required: false,
            default: () => ({})
        },
        
    },
    setup(){
        return {
            formatCurrency
        }
    }   
}
</script>

<style lang="less" scoped>
    .content{
        width: min-content;
        display: flex;
        align-content: center;
    }
    .card{
        width: 160px;
        height: auto;
        background-color: #fff;
        border-radius: 5px;
        border: solid 1px rgb(212, 212, 212);
        text-align: center;
        margin-right: 20px;

        padding: 10px;
        &:last-child{
            margin-right: 0;
        }
    }
   
    .card-title{
        font-size: 1.6em;
        font-weight: bold;
    }
    .text{
        color: #f70;
        font-weight: bold;
        font-size: 2em;
        margin-top: 12px;
    }

    @media screen and (max-width: 580px) {
        .content{
            width: 100%;
            display: block;
        }
        .card{
            width: 100%;
            margin-bottom: 10px;
            text-align: left;

            &:last-child{
                margin: 0;
            }
        }
    }
</style>