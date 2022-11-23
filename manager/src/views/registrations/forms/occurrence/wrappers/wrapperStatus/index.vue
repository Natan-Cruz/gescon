<template>
    <expandable-content title="Status" style="margin-bottom: 24px">        
        <ul class="wrapper wrapper-status">
            <item-status :status="itemHeader" class="bold"/>
            <item-status 
                v-for="(status, i) of status.map(formatDate)" 
                :key="i"
                :index="i"
                :status="status" />
        </ul>
    </expandable-content>
</template>

<script>
import expandableContent from "../../expandableContent.vue"
import itemStatus from "./itemStatus.vue";
import dayjs from "dayjs";

export default {
    name: "wrapper-status",
    components: { expandableContent, itemStatus },
    props: {
        status: Array
    },
    setup(){
        const itemHeader = {
            status_code: "Cod.",
            status_name: "Status",
            created_at: "Data e hora"
        }
        function formatDate(item){
            return {
                ...item,
                created_at: dayjs(item.created_at).format("hh:mm DD/MM/YY")
            }
        }
        return {
            itemHeader,
            formatDate
        }
    }
}
</script>