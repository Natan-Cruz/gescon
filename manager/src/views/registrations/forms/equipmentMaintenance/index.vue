<template>
    <form-page linkBack="/main/equipments" :config="config">
        <wrapper-input id="description" label="Descrição:" class="form_spacing_bottom">
            <textarea-autosize id="description" :minHeight="80" placeholder="A descrição aqui..." v-model="form.description" :disabled="disabled" />
        </wrapper-input>

        <div class="form_row">
            <!-- start_date -->
            <wrapper-input id="start_date" label="Data de inicio:" >
                <input type="date" class="input" id="start_date" v-model="form.start_date" :disabled="disabled">
            </wrapper-input>

            <!-- end_date -->
            <wrapper-input id="end_date" label="Data de termino:" >
                <input type="date" class="input" id="end_date" v-model="form.end_date" :disabled="disabled">
            </wrapper-input>
        </div>

        <wrapper-attachments class="form_spacing_bottom" 
            v-model="form.attachments" 
            :id="$route.params.id" 
            :disabled="!disabled"/>
    </form-page>
</template>

<script>
import formPage from "@/components/formPage/index.vue"
import { useStore } from "@/components/formPage/store.js"

import wrapperAttachments from "@/components/wrapperAttachments/index.vue"
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

export default {
    components: { formPage, wrapperAttachments },
    setup(){
        const store = useStore();
        store.resetState()
        const $route = useRoute()
        // reset store

        const config = computed(() => ({
            urls: {
                fetch: "/registrations/equipments/maintenance/?",
                create: "/registrations/equipments/maintenance",
                edit: "/registrations/equipments/maintenance",
                delete: "/registrations/equipments/maintenance"
            },
            reqHeaders: {
                fileFullPath: "",
                newPathLtree: "",
                rootPathLtree: `YxexwB90JxuPN3Dx._EQUIP_`,
                reference_table: "equipment_scheme.equipment_maintenance_attachments",
                reference_key: "equipment_maintenance_id",
            }
        }))
        const { editMode } = storeToRefs(store);

        store.$patch( state => state.form.equipment_id = $route.params.equipment_id )

        return {
            config,
            disabled: editMode,
            form: store.form,
        }
    },
}
</script>
<style lang="less" scoped>

</style>