<template>
    <form-page-without-script linkBack="/main/payroll" :isLoading="isLoading" :error="error" @event-retry="fetch">

        <step-form @select-item="handleSelectItem"/>
        
        <div class="view">
            <router-view v-slot="{ Component, route }"  >
                <transition :name="transitionName || 'fade'">
                    <component :is="Component" :key="route.path" @next="handleNext"/>
                </transition>
            </router-view>
        </div>

        <template v-slot:footer>
            <div class="wrapper-buttons">
                <!-- row reverse -->
                <button class="button button-primary text-medium" @click="handleNext">{{ $route.meta.index === 3 ? "Confirmar" : "Próximo" }}</button>
                <button v-show="$route.meta.index > 1" class="button button-second text-medium" @click="handlePrevious">Anterior</button>
            </div>
        </template>
    </form-page-without-script>
</template>

<script>
import { useStore } from "./store"
import formPageWithoutScript from "@/components/formPage/formPageWithoutScript.vue"

import stepForm from "./stepForm.vue"
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

export default {
    components: { formPageWithoutScript, stepForm },
    setup(){
        const store = useStore();
        store.$reset();


        const $router = useRouter()
        const $route = useRoute()
        const index = ref($route.meta.index)
        const transitionName = ref("fade")

        const { isLoading, error } = storeToRefs(store)

        onMounted(() => {
            store.form.transactions = []
            const { id } = $route.params
            store.fetch(id)
        })

        watch($route, route => {
            if(index.value < route.meta.index  )
                transitionName.value = "slide-right" 
            else
                transitionName.value = "slide-left" 

            index.value = route.meta.index
        })
        
        function handleSelectItem(source){
            $router.push({ name: `registrations/form_payroll/${ source }`, params: $route.params, query: $route.query })
        }

        function handlePrevious(){
            const currentIndex = $route.meta.index;

            $router.push({ name: `registrations/form_payroll/step_0` + (currentIndex - 1), params: $route.params, query: $route.query })
        }

        function handleNext(){
            const currentIndex = $route.meta.index;

            if(currentIndex + 1 === 4){
                const { id } = $route.params
                if(id)
                    store.editPayroll(id)
                else
                    store.createPayroll()

            }else{
                $router.push({ name: `registrations/form_payroll/step_0` + (currentIndex + 1), params: $route.params, query: $route.query })
            }
        }

        return {
            transitionName,
            isLoading, 
            error,
            handleSelectItem,
            handleNext,
            handlePrevious,
            fetch: store.fetch
        }
    }
}
</script>

<style lang="less" scoped>
    .view{
        height: calc(100% - 95px);
        padding: 20px 0;
    }

    :deep(.title_2){
        font-size: 1.7em;
        font-weight: bold;
        margin-bottom: 12px;
    }
    :deep(.container-alert){
        margin-top: 26px;
        p{
            font-size: 1.7em;
            text-align: center;
        }
    }
    .wrapper-buttons{
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;

        .button{
            width: auto;
            min-width: 120px;
            padding: 0 6px;
            height: 40px;
        }
    }
</style>