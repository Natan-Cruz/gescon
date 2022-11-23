<template>
    <ul>
        <item-service v-for="(service, i ) in data" :key="i" :item="service" @select-item="$emit('select-item', $event)">
            <template v-if="service.check_items && service.check_items.length">
                <item-check-item v-for="( item, i ) in service.check_items" :key="i" :item="item" >
                    <attachments-for-items :attachments="item.attachments" :id="item.id" :showAddButton="false"></attachments-for-items>
                </item-check-item>
            </template>
            <template v-else>
                <p class="without-item">Nenhum item</p>
            </template>
        </item-service>
    </ul>
</template>

<script>
import itemService from "../items/itemService.vue";
import itemCheckItem from "../items/itemCheckItem.vue";
import attachmentsForItems from "@/components/wrapperAttachments/attachmentsForItems.vue"

export default {
    components: { itemService, itemCheckItem, attachmentsForItems },
    props: { data: Array }
}
</script>