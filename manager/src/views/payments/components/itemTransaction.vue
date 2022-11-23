<template>
    <div class="item" :class="{ 'item-position_left': !isPositionLeft }" @click="$emit('click', transaction._id )">
        <div class="wrapper-item ball-detail" :class="{ 'position_left': isPositionLeft, 'ball-detail-right': isPositionLeft, 'ball-detail-left': !isPositionLeft }">
            <div class="row">
                <p class="text bold" style="margin-right: 6px;">{{ isPositionLeft ? "Adicionado" : "Descontado" }}:</p>
                <p class="text price">{{ formatCurrency(transaction.amount) }}</p>
                <div class="payment-info" v-show="false ">sucesso</div>
            </div>
            <div class="row">
                <span class="text price">{{ formatCurrency(transaction.balance) }}</span>
                <span class="arrow">
                    <svg id="keyboard_backspace_black_24dp" xmlns="http://www.w3.org/2000/svg" width="17.353" height="17.353" viewBox="0 0 17.353 17.353">
                        <path id="Caminho_6412" data-name="Caminho 6412" d="M17.353,17.353H0V0H17.353Z" fill="none"/>
                        <path id="Caminho_6413" data-name="Caminho 6413" d="M0,5.061H10.246l-2.589,2.6,1.02,1.02,4.338-4.338L8.677,0,7.657,1.02l2.589,2.6H0Z" transform="translate(2.169 4.338)"/>
                    </svg>
                </span>
                <span class="text price">{{ formatCurrency(parseFloat(transaction.balance) + parseFloat(transaction.amount)) }}</span>
            </div>
            <div class="row">
                <p class="text_2 color_id">{{ new Date(transaction.created_at).toLocaleDateString() }}</p>
                <span class="bar"></span>
                <p class="text_2 color_id">ID {{ transaction.id }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { formatCurrency } from "@/Utils/index.js"

export default {
    props: {
        transaction: Object
    },
    setup(props){
        const isPositionLeft = computed(() => props.transaction.type === "income" )

        return {
            isPositionLeft,
            formatCurrency
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;
        margin-bottom: 30px;
    }
    .mobile-type-transaction{
        font-weight: bold;
        font-size: 1.7em;
        color: #6a6a6a;
        display: none;
        margin-left: 20px;
        margin-bottom: 12px;
    }
    .wrapper-item{
        width: calc(50% - 25px);

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        padding: 10px 16px;
        border-radius: 6px;
        position: relative;
        background-color: #fff;

        box-shadow: 1px 1px 6px rgba(168, 168, 168, 0.3);
        border: solid 1px rgb(212, 212, 212);
        &:hover{
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            cursor: pointer;
        }
    }
    .item-position_left{
        margin-left:calc(50% + 20px)
    }
    
    .ball-detail{
        &::before{
            content: "";
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #f70;
            display: block;
            position: absolute;
            top: 10px;
        }
    }
    .ball-detail-left{
        &::before{
            left: -28px;
        }
    }
    .ball-detail-right{
        &::before{
            right: -35px;
        }
    }

    .position_left{
        align-items: flex-end;
    }

    .row{
        display: flex;
        align-items: center;
        margin: 6px 0;
        flex-wrap: wrap;
        justify-content: flex-end;  
    }
    .text{
        font-size: 1.7em;
        white-space: nowrap;
    }
    .text_2{
        font-size: 1.5em;
        white-space: nowrap;
    }

    .price{
        color: #f70;
        font-weight: bold;
    }   

    .arrow{
        margin: 0 10px;
        width: 22px;
        svg{
            width: 100%;
            height: 100%;
        }
    }

    @color-id: #8B8B8B;
    .color_id{
        color: @color-id;
    }
    .bar{
        width: 1px;
        height: 20px;
        background-color: @color-id;
        display: block;
        margin-left: 10px;
        margin-right: 6px;
    }

    .payment-info{
        border-radius: 16px;
        font-size: 2em;
        font-weight: bold;
        color: #fff;
        padding: 6px 10px;
        background-color: #4BB543;
        margin-left: 16px;
    }

    @media screen and (max-width: 700px) {
        .item:last-child{
            margin-bottom: 0;
        }
        .wrapper-item{
            width: calc(100% - 25px);
            margin-left: 25px;
        }
        .mobile-type-transaction{
            display: block;
        }
        .item-position_left{
            margin: 0;
            margin-bottom: 16px;
        }
        .position_left{
            align-items: flex-start;
        }

        .ball-detail-left, .ball-detail-right{
            &::before{
                left: -25px;
            }
        }

        .row{
            justify-content: flex-start;
        }
    }
</style>