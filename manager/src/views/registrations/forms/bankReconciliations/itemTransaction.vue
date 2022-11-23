<template>
    <li class="item-transaction">
        <div class="selected" v-show="(trx.selected && this.trx.id)"></div>
        <div class="selected on-blur" v-show="trx.on_blur && trx.is_checked"></div>
        <input type="checkbox" class="checkbox" v-model="isChecked">
        <p class="date">{{ createdAt }}</p>
        <div class="details">
            <div>
                <p class="text-medium title">Descricao:</p>
                <p class="text-medium content">{{ trx.description ||  trx.name }}</p>
            </div>
            <div class="row" v-if="trx.fitidCodeDescription">
                <p class="text-medium title">Tipo da Transacao:</p>
                <p class="text-medium content">{{ trx.fitidCodeDescription }}</p>
            </div>
        </div>

        <span class="amount" :class="`value-${ trx.type }`">{{ $formatCurrency(trx.amount) }}</span>

        <div v-if="trx.reference_item" class="reference">
            <div class="content-reference">
                <p class="reference-name">{{ trx.reference_item.name }}</p>
                <p class="reference-amount">{{ $formatCurrency(trx.reference_item.amount) }}</p>
            </div>
            <button class="button-trash" @click="remove" >
                <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
            </button>
        </div>
        <select class="select" v-model="select_mode" v-show="isChecked && !this.trx.id">
            <option value="create_new_transaction">Criar nova transacao</option>
            <option value="relate_transaction">Relacionar transacao</option>
        </select>
    </li>
</template>

<script>
import dayjs from 'dayjs'
export default {
    name: "item-transaction",
    emits: ['event-updated', 'remove-relationship', "event-select", "event-deselect"],
    props: {
        trx: {
            type: Object
        }
    },
    computed: {
        createdAt(){
            return dayjs(this.trx.created_at).format("DD/MM/YYYY")
        },
        select_mode: {
            get(){
                return this.trx.select_mode || "create_new_transaction"
            },
            set(select_mode){
                this.$emit("event-updated", { ...this.trx, select_mode })
            }
        },
        isChecked: {
            get(){
                return this.trx.is_checked
            },
            set(value){
                if(value) 
                    this.$emit("event-select", {  ...this.trx, select_mode: this.select_mode })
                else 
                    this.$emit("event-deselect", { ...this.trx, select_mode: this.select_mode })
            }
        }
    },
    methods: {
        remove(){
            this.$emit("event-updated", { ...this.trx, select_mode: "create_new_transaction" })
            this.$emit("event-updated", { ...this.trx, select_mode: "relate_transaction" })
        },
    }
}
</script>

<style lang="less" scoped>
    .item-transaction{
        display: grid;
        grid-template-areas: "checkbox date details amount" "reference reference reference reference" "select select select select";
        grid-template-rows: auto auto auto;
        grid-template-columns: 16px 80px 1fr auto;
        column-gap: 18px;
        row-gap: 18px;

        border-bottom: solid 1px rgb(150, 150, 150);
        margin-bottom: 12px;

        padding: 0 3px;
        position: relative;
    }
   
    .selected{
        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;

        background-color: rgba(255, 255, 255, 0.6);

        &::after{
            content: "";
            display: block;
            width: 100%;
            height: 1px;

            position: absolute;
            top: 50%;
            left: 0;

            background-color: #000;
        }
    }

    .on-blur{
        &::after{
            display: none;
        }
    }
    // 
    .checkbox{
        grid-area: checkbox;

        width: 16px;
        height: 16px;

        align-self: center;
    }
      // 
    .date{
        grid-area: date;
        align-self: center;
        color: rgb(80, 80, 80);
        font-size: 1.5em;
    }
    .details{
        grid-area: details;
        display: block;

        width: 100%;
        height: 100%;
    }
    .row{
        margin-top: 12px;
        padding-top: 6px;
        border-top: dashed 1px gray;
        
    }
    .title{
        font-weight: bold;
        color: rgb(20, 20, 20);
        margin-bottom: 3px;
    }

    .amount{
        grid-area: amount;
        font-size: 1.7em;
        align-self: center;
        cursor: default;
    }
    .value-inflow{
        color: #287928;
    }
    .value-outflow{
        color: #F51720;
    }

    .reference{
        grid-area: reference;
        width: 100%;
        
        display: flex;
        align-items: center;
        justify-content: space-between;

        p{
            font-size: 1.7em;
        }
    }
    .content-reference{
        width: calc(100% - 46px);
        background-color: #497949; 
        padding: 8px 10px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        
        border-radius: 5px;
        color: #fff;

    }
    .button-trash{
        grid-area: buttonTrash;
        align-self: center;

        width: 42px;
        height: 42px;

        border: none;
        background-color: #fff;
        border-radius: 50%;

        cursor: pointer;

        transition: 80ms ease-in;

        &:hover{
            background-color: rgb(206, 206, 206);
        }

        &:active{
            background-color: rgb(179, 179, 179);
            transform: scale(.96);
        }
    }
    .select{
        grid-area: select;
        font-size: 1.7em;
        height: 36px;
        margin-bottom: 12px;
        option{
            font-size: 1em;
        }
    }
    
</style>