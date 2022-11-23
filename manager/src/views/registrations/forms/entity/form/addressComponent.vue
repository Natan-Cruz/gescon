<template>
    <div>
        <ul>
            <li class="item" v-for="(address, i) in addresses" :key="i" >

                <wrapper-input v-if="addresses.length > 1" label="Nome do endereço" class="title form_spacing_bottom">
                    <input type="text" class="input" v-model="address.title" @input="handleUpdate(i, address)" :disabled="disabled" placeholder="Nome para distinguir multiplos endereços">
                </wrapper-input>

                <div class="address">
                    <address-component
                        :disabled="disabled"
                        @update:cep="handleUpdate(i, address)"
                        @update:street="handleUpdate(i, address)"
                        @update:state="handleUpdate(i, address)"
                        @update:city="handleUpdate(i, address)"
                        @update:number="handleUpdate(i, address)"
                        @update:neighborhood="handleUpdate(i, address)"
                        @update:complement="handleUpdate(i, address)"
                        v-model:cep="address.cep"
                        v-model:street="address.street"
                        v-model:state="address.state"
                        v-model:city="address.city"
                        v-model:number="address.number"
                        v-model:neighborhood="address.neighborhood"
                        v-model:complement="address.complement" />
                </div>

                <button class="btn button-trash" @click="remove(i, address)" v-show="!disabled">
                    <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                </button>
            </li>
        </ul>

        <button class="text-medium button-add" @click="add" :disabled="disabled">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z"/></svg>
            Adicionar endereço
        </button>
    </div>
</template>

<script>
import addressComponent from "@/components/addressComponent.vue"

import { computed } from 'vue';
import { useStore } from "@/components/formPage/store.js"
import { storeToRefs } from 'pinia';

export default {
    components: { addressComponent },
    setup(){
        const store = useStore();
        const { form, editMode } = storeToRefs(store)

        function add(){
            let address = {
                title: "",
                cep: "",
                street: "",
                state: "",  
                city: "",
                number: "",
                neighborhood: "",
                action: "ADD"
            }
            store.$patch( state => {
                if(form.value.addresses){
                    state.form.addresses.push(address)
                }else{
                    state.form.addresses = [address]
                }
            })
        }

        function remove(index, address){
           if(address.id){
                address.action = "REMOVE"
                form.value.addresses.splice(index, 1, address)
           }else{
                form.value.addresses.splice(index, 1)
           }
        }

        function handleUpdate(index, address){
            if(address.id){
                address.action = "UPDATE"
                form.value.addresses.splice(index, 1, address)
            }
        }
       
        const addressesFiltered = computed(() => {
            if(!form.value.addresses) return []
            return form.value.addresses.filter( ctt => ctt.action !== "REMOVE" )
        })


        return {
            disabled: editMode,
            addresses: addressesFiltered,
            // methods
            add,
            remove,
            handleUpdate
        }
    }
}
</script>

<style lang="less" scoped>
    .item{
        width: 100%;
        height: auto;

        display: grid;
        grid-template-areas: "title buttonTrash" "address buttonTrash";
        grid-template-columns: 1fr auto;
        grid-template-rows: repeat(2, auto);

        border-bottom: dashed 1px gray;
        margin-bottom: 18px;

        &:last-child{
            border-bottom: 0;
            margin-bottom: 0;
        }
    }
    .title{ grid-area: title; }
    .address{ grid-area: address; }
</style>