<template>
    <div>
        <template v-if="isLoading">
            <li class="skeleton-item" style="border-color: #ccc;" v-for="n in 3" :key="n">
                <div class="skeleton-row" style="margin-bottom: 8px">
                    <span class="skeleton-text" style="width: 140px; height: 20px; display: block;"></span>
                    <span class="skeleton-text" style="width: 105px; height: 20px; display: block;"></span>
                </div>
                <p class="skeleton-text" style="width: 100%; height: 15px; display: block;"></p>

                <div class="skeleton-row" style="margin-top: 16px">
                    <div>
                        <span class="skeleton-text" style="width: 80px; height: 20px; display: block;margin-bottom: 6px"></span>
                        <span class="skeleton-text" style="width: 160px; height: 16px; display: block;"></span>
                    </div>
                    <span class="skeleton-text" style="width: 30px; height: 30px; display: block; margin-right: 12px"></span>
                </div>
            </li>
        </template>
        <template v-else>
            <item-service v-for="service in unconfomititesLocal" :key="service.id" :item="service" @select-service="handleSelectService">
                <item-check-item v-for="item in service.check_items" :key="item.id" :item="item" @select-check-item="handleSelectCheckItem" @remove-check-item="handleRemoveCheckItem"/>
            </item-service>
        </template>
    </div>
</template>

<script>
import itemService from "../services/unconformitites/itemService.vue";
import itemCheckItem from "../services/unconformitites/itemCheckItem.vue";
import { useRoute, useRouter } from 'vue-router';
import { ref, watch} from 'vue';

export default {
    components: { itemService, itemCheckItem },
    props: {
        unconformitites: Array,
        isLoading: Boolean
    },
    setup(props){
        const $route = useRoute();
        const $router = useRouter();
        const unconfomititesLocal = ref();

        watch(() => props.unconformitites, unconformitites => unconfomititesLocal.value = unconformitites )

        function handleSelectService(service_id){
            $router.push({
                name: 'constuction/service/items', 
                params: { 
                    id: service_id 
                }, 
                query: { 
                    previous: $route.fullPath 
                }
            })
        }

        function handleSelectCheckItem({ service_id, check_item_id }){
            $router.push({
                name: "constuction/service/check_item",
                params: {
                    id: service_id,
                    check_item_id :check_item_id
                },
                query: {
                    previous: $route.fullPath
                }
            })
        }

        function handleRemoveCheckItem(check_item_id){
            unconfomititesLocal.value = unconfomititesLocal.value.filter( service => {
                const index = service.check_items.findIndex( item => item.id === check_item_id)
                if(index > -1)
                    service.check_items.splice(index, 1)

                if(service.check_items.length > 0)
                    return service
            })
        }

        return {
            unconfomititesLocal,
            // methods //
            handleSelectService,
            handleSelectCheckItem,
            handleRemoveCheckItem
        }
    }
}
</script>

<style lang="less" scoped>
    .skeleton-item{
        border: solid 1px gray;
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 12px;
    }

    .skeleton-row{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>