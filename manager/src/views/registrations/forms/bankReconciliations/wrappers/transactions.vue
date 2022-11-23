<template>
    <div class="wrapper-transactions">
        <div class="group" v-show="local.length">
            <div class="head">
                <p class="sub-title">Transações do OFX</p>
                <button @click="local.length = 0">CLose</button>
            </div>
            <ul>
                <item-transaction 
                    v-for="(trx, i) of local" :key="i" :trx="trx" 
                    @event-select="selectItem" 
                    @event-deselect="deselectItem" 
                    @event-updated="updateItem"/>
            </ul>
        </div>
        <div class="group">
            <div class="head">
                <p class="sub-title">Transações do ERP</p>
                <button @click="server.length = 0">CLose</button>
            </div>
            <ul>
                <item-transaction v-for="(trx, i) of server" :key="i" :trx="trx" 
                    @event-select="selectItem" 
                    @event-deselect="deselectItem"/>
            </ul>
        </div>
    </div>
</template>

<script>
import itemTransaction from "../itemTransaction.vue"
import { edit, has, push, remove, editAll } from "../db.js"
import{ mapWritableState } from "pinia"
import { useStore } from "@/components/formPage/store.js";

export default {
    name: "wrapper-transactions",
    components: {
        itemTransaction,
    },
    props: {
        transactions: {
            type: Object
        }
    },
    computed: {
        ...mapWritableState(useStore, {
            form: "form" 
        })
    },
    data(){
        return{
            clipboard: {
                from: {},
                to: {}
            },
            local: [],
            server: []
        }
    },
    mounted(){
        this.local = JSON.parse(JSON.stringify(this.transactions.local))
        this.server = JSON.parse(JSON.stringify(this.transactions.server))
    },
    watch: {
        transactions: {
            handler(){
                this.local = JSON.parse(JSON.stringify(this.transactions.local))
                this.server = JSON.parse(JSON.stringify(this.transactions.server))
            },
            deep: true
        },
        clipboard: {
            handler({ from }){
                if(has(from)){
                    this.local = editAll(this.local, { on_blur: true })
                }else{
                    this.local = editAll(this.local, { on_blur: false })
                }
            },
            deep: true
        }
    },
    methods: {
        updateItem(item){
            if(item.select_mode === "create_new_transaction"){
                this.form.items = remove(this.form.items, { uuid: item.uuid })
                this.local = edit(this.local, { uuid: item.uuid }, { reference_item: null, is_checked: true, select_mode: "create_new_transaction" })
                this.server = edit(this.server, { id: item.reference_item && item.reference_item.id }, { selected: false, is_checked: false })
                this.form.items = push(this.form.items, item)
                this.clipboard.to = {}
            }

            if(item.select_mode === "relate_transaction"){
                this.form.items = remove(this.form.items, { uuid: item.uuid })
                this.local = edit(this.local, { uuid: item.uuid }, { select_mode: "relate_transaction" })
                this.clipboard.to = item
            }
        },
        selectItem(trx){
            // click na transacao do erp 
            if(trx.id){
                // marca essa transacao com checked
                this.server = edit(this.server, { id: trx.id }, { is_checked: true })

                // possui ofx
                if(this.local.length){
                    // adiciona transacao do clipboard from
                    this.clipboard.from = trx
                }
                // nao possui ofx
                else{
                    // Marca transacao reconcilida
                    this.item = push(this.form.items, { id: trx.id, reconciled: true }) 
                }
            }
            // click na transacao do ofx 
            else{
                this.local = edit(this.local, { uuid: trx.uuid }, { is_checked: true })
                // possui transacoes do erp
                if(this.server.length){
                    // verificamos se "transaction mode" é "create_new_transaction" e não tem nada no clipboard from
                    // isso significa que nao houve uma relacionamento de transacao
                    if(trx.select_mode === "create_new_transaction" && !has(this.clipboard.from)){
                        return this.form.items = push(this.form.items, trx)
                    }
                    // adiciona transacao no clipboard to
                    this.clipboard.to = trx
                    // edita transacao em questao para que seja relate_mode
                    this.local = edit(this.local, { uuid: trx.uuid }, { select_mode: "relate_transaction" })
                }
                // se nao houver transacoes do erp, simplesmente adiciona transacao no item de transacao a serem criadas
                else{
                    this.form.items = push(this.form.items, trx) 
                }
            }

            // se clipboard from e to existirem indica que houve um relacionamento
            if(has(this.clipboard.from) && has(this.clipboard.to)){
                // Coloca no array de this.form.items principais a transacao reconcilidada
                this.form.items = push(this.form.items, { id:  this.clipboard.from.id, reconciled: true, uuid: this.clipboard.to.uuid })
                // Adiciona o objecto relacionado na transacao do ofx
                this.local = edit(this.local, { uuid: this.clipboard.to.uuid }, { reference_item: JSON.parse(JSON.stringify(this.clipboard.from)) })
                // Marca com transancao do erp ja selecionada 
                this.server = edit(this.server, { id: this.clipboard.from.id }, { selected: true })
                // limpa clipboard
                this.clipboard = {
                    to: {},
                    from: {}
                }
            }
        },
        deselectItem(trx){
            // erp transaction
            if(trx.id){
                this.server = edit(this.server, { id: trx.id }, { is_checked: false })
                
                //Nao possui ofx
                if(!this.local.length){
                    this.form.items = remove(this.form.items, { id: trx.id })    
                }
                // possui ofx
                else{
                    this.clipboard.from = {}
                }
            }
            // ofx transaction
            else{
                this.local = edit(this.local, { uuid: trx.uuid }, { is_checked: false })
                // nao possui transacoes do erp
                if(!this.server.length){
                    this.form.items = remove(this.form.items, { uuid: trx.uuid })    
                }
                // possui transacoes do erp
                else{
                    this.clipboard.to = {}
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper-transactions{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    .group{
        width: 49%;
    }
    .sub-title{
        font-size: 2em;
        font-weight: bold;
        color: rgb(49, 49, 49);
        margin-bottom: 32px;
    }
</style>


