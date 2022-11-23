<template>
    <div class="container-attachments">

        <div class="flex-row">
            <p class="title-attachment">Anexos</p>
            <button-add-attachment @event-load-file="loadAttachment" :disabled="disabled"/>
        </div>

        <ul class="list-attachments">
            <item-attachment 
                v-for="(attachment, i) in attachmentsFiltered" :key="i"
                :item="attachment" 
                :disabled="disabled"
                @select-item="$router.push({ name: 'viewer/viewer', params: { id: $event }, query: { previous: $route.fullPath }})"
                @remove="removeAttachment(attachment, i)" />
        </ul>
    </div>
</template>

<script>
import buttonAddAttachment from "./buttonAddAttachment.vue";
import itemAttachment from "./itemAttachment";

import { computed } from 'vue';
import { useStore as useStoreUploader } from "@/store/uploader"
import { isFile } from "@/Utils/index.js"

export default {
    name: "wrapper-attachments",
    emits: ["update:modelValue", "update-attachments", "edit", "remove"],
    components:{
        buttonAddAttachment,
        itemAttachment
    },
    props:{
        attachments: {
            type: Array,
            required: false
        },
        modelValue: {
            type: Array,
            required: false
        },
        disabled: {
            type: Boolean,
            required: false,
            default: () => false
        },
        id: {
            type: String,
            required: true
        },
    },
    setup(props, { emit }){
        const uploader = useStoreUploader()

        const mAttachments = computed({
            get: () => props.modelValue || props.attachments,
            set: attachment => {
                emit("update-attachments", attachment)
                emit("update:modelValue", attachment)
            }
        })

        function loadAttachment(evt){
            const evtFiles = evt.target.files;
			Array.from(evtFiles).forEach( evtFile => {
                mAttachments.value.push(evtFile)
			})
            evt.target.value = ""
        }

        function removeAttachment(item, index){
            if(isFile(item)){
                mAttachments.value.splice(index, 1)
            }else{
                mAttachments.value.splice(index, 1, {
                    ...item,
                    action: "REMOVE"
                })
            }
        }

        const attachs = computed(() => {
            if(!mAttachments.value)
                return []

            const uploaders = uploader.queue.filter( item => item.reqHeaders.reference_value === props.id)
            return mAttachments.value.filter( attach => attach.action !== "REMOVE").concat(uploaders)
        })
        return {
            loadAttachment,
            removeAttachment,
            attachmentsFiltered: attachs,
        }
    }
}
</script>
<style lang="less" scoped>
    .flex-row{
        display: flex;
        justify-content: space-between;
        align-items: center;

        margin-bottom: 12px;
    }
    .title-attachment{
        font-size: 1.8em;
        font-weight: bold;
    }
    .list-attachments{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        grid-template-rows: auto;
        row-gap: 12px;
        column-gap: 12px;


        & > :deep(.item-attachment){
            height: 140px;
        }
    }

    .label-disabled{
        opacity: .5;
    }
</style>