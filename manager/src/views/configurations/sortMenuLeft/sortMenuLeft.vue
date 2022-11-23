<template>
    <div class="wrapper-informations">
        <p class="subtitle-content">Ordernar menu lateral</p>

        <ul>
            <item v-for="(item, i) in items.sort((a,b) => a.order - b.order) " :key="i" 
                :item="item"
                @event-drag-start="handleDragStart"
                @event-drag-over="handleDragOver"
                @event-drop="handleDragDrop"
                @event-drag-end="handleDragEnd"
                @event-drag-leave="handleDragLeave"  />
        </ul>
    </div>
</template>

<script>
import { onMounted, ref } from '@vue/runtime-core'
import item from './item.vue';
/* eslint-disable */

export default {
    components: { item },
    setup(){
        const items = ref([])
        const elemDrag = ref({})

        onMounted(() => {
            const sort = localStorage.getItem("menu_left_order")

            if(sort){
                items.value = JSON.parse(sort)
            }else{
                localStorage.setItem("menu_left_order", JSON.stringify([
                    { key: "group_registrations", label: "Cadastros", order: 1 },
                    { key: "group_materials", label: "Materiais e pedidos", order: 2 },
                    { key: "group_folders_and_files", label: "Pastas e arquivos", order: 3 },
                    { key: "group_financial", label: "Financeiro", order: 4 },
                    { key: "group_sales", label: "Vendas", order: 5 },
                    { key: "group_banks", label: "Bancos", order: 6 },
                    { key: "group_system", label: "Sistema", order: 7 },
                    { key: "group_you", label: "Você", order: 8 }
                ]))
            }
        })

        function handleDragStart(item){
            elemDrag.value = item;
            items.value = items.value.map( itm => {
                if(itm.key === item.key)
                    itm.name_style = ""
                else
                    itm.name_style = "filter: brightness(0.8); opacity: .7"

                return itm
            })
        }
        
        function handleDragOver({ item, position }){
            if(elemDrag.value.key === item.key) 
                return;

            const elemIndex_2 = items.value.findIndex( elem => elem.key === item.key)

            if(position === "top"){
                resetData()
                items.value.splice(elemIndex_2, 1, { ...item, style: "border-top: solid 3px blue; margin-top: 2px; padding-top: 2px;" })
            }

            if(position === "bottom"){
                resetData()
                items.value.splice(elemIndex_2, 1, { ...item, style: "border-bottom: solid 3px blue;margin-bottom: 2px; padding-bottom: 2px;" })
            }
            const elemIndex_1 = items.value.findIndex( elem => elem.key === elemDrag.value.key) 
            items.value.splice(elemIndex_1, 1, { ...elemDrag.value, style: "border: dashed 1px #f70" })
        }

        async function handleDragDrop({ item, position }){
            const { key, order, newOrder } = item;

            // if(elemDrag.value.path === path || elemDrag.value.id === id) return;

            const elemIndex_1 = items.value.findIndex( elem => elem.key === elemDrag.value.key) 
            let ord = newOrder || order
            // se pais forem iguais, altera somente a ordem
            if(position === "top")
                items.value.splice(elemIndex_1, 1, { ...elemDrag.value, newOrder: getNumberBeetwenTwoNumber(order - 1, ord) })

            if(position === "bottom")
                items.value.splice(elemIndex_1, 1, { ...elemDrag.value, newOrder: getNumberBeetwenTwoNumber(ord, order + 1) })

            // await saveAlterations()
            const req_body = items.value.find( item => item.newOrder)
            const updates = items.value
                .map( item => {
                    if(item.key === req_body.key)
                        item.order = req_body.newOrder;
                    delete item.style
                    return item
                })
                .sort((a,b) => a.order - b.order)
                .map((item, i) => {
                    item.order = i + 1
                    return item
                })  

            items.value = updates
            localStorage.setItem("menu_left_order", JSON.stringify(updates))

            items.value = items.value.map( item => {
                item.style = ""
                item.name_style = ""
                item.newOrder = null
                return item
            })
        }
        function handleDragEnd(){
            resetData();
            items.value = items.value.map( item => {
                item.style = ""
                item.name_style = ""
                return item
            })
        }


        function resetData(){
            items.value = items.value.map( item => {
                item.style = "";
                return item
            })
        }

        function getNumberBeetwenTwoNumber(min, max){
            return (min + max) / 2
        }

        return {
            items,
            // 
            handleDragStart,
            handleDragOver,
            handleDragDrop,
            handleDragEnd,
            handleDragLeave: () => {}
        }
    }
}
</script>

<style>

</style>