<template>
    <div class="container-attachments">
       
        <ul class="list-attachments">
            <item-attachment 
                v-for="(attachment, i) in attachmentsFiltered" 
                :key="i" 
                :item="attachment" 
                :disabled="disabled"
                @select-item="$router.push({ name: 'viewer/viewer', params: { id: $event }, query: { previous: $route.fullPath }})"
                @remove="removeAttachment(attachment, i)" />

            <li class="item-button" v-if="showAddButton">
                <label :for="uuid" class="button button-second btn-add-attachments" >
                    <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" fill="#f70"><path d="M18.625 28.333H21.375V21.375H28.333V18.625H21.375V11.667H18.625V18.625H11.667V21.375H18.625ZM7.792 35Q6.667 35 5.833 34.167Q5 33.333 5 32.208V7.792Q5 6.667 5.833 5.833Q6.667 5 7.792 5H32.208Q33.333 5 34.167 5.833Q35 6.667 35 7.792V32.208Q35 33.333 34.167 34.167Q33.333 35 32.208 35ZM7.792 32.208H32.208Q32.208 32.208 32.208 32.208Q32.208 32.208 32.208 32.208V7.792Q32.208 7.792 32.208 7.792Q32.208 7.792 32.208 7.792H7.792Q7.792 7.792 7.792 7.792Q7.792 7.792 7.792 7.792V32.208Q7.792 32.208 7.792 32.208Q7.792 32.208 7.792 32.208ZM7.792 32.208Q7.792 32.208 7.792 32.208Q7.792 32.208 7.792 32.208V7.792Q7.792 7.792 7.792 7.792Q7.792 7.792 7.792 7.792Q7.792 7.792 7.792 7.792Q7.792 7.792 7.792 7.792V32.208Q7.792 32.208 7.792 32.208Q7.792 32.208 7.792 32.208Z"/></svg>                
                </label>
                <input type="file" :id="uuid" @input="loadAttachment" multiple="multiple" style="display:none" :disabled="disabled">
            </li>
        </ul>
    </div>
</template>

<script>
import itemAttachment from "./itemAttachment";

import { computed } from 'vue';
import { useStore as useStoreUploader } from "@/store/uploader"
import { randomID } from "@/Utils/index.js"

export default {
    name: "wrapper-attachments",
    emits: ["update:modelValue", "update-attachments", "edit", "remove"],
    components:{
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
        reqHeaders: {
            type: Object,
            required: false
        },
        showAddButton: {
            type: Boolean,
            required: false,
            default: () => true
        }
    },
    setup(props){
        const uploader = useStoreUploader()
        const uuid = randomID()

         const reqHeaders = {
            ...props.reqHeaders,
            reference_value: props.id
        };

        function loadAttachment(evt){
            const evtFiles = evt.target.files;
            uploader.push(Array.from(evtFiles), reqHeaders)
            evt.target.value = ""
        }

        function removeAttachment(item){
            const attachment = props.attachments.find( itm => itm.id === item.id)
            if(!attachment) return;

            attachment.action = "REMOVE"
            uploader.push([attachment], reqHeaders)
        }

        const attachs = computed(() => {
            const attachs = props.modelValue || props.attachments 
            if(attachs){
                const uploaders = uploader.queue.filter( item => {
                    if(item.reqHeaders.reference_value === props.id) return item
                })
                return attachs.filter( attach => attach.action !== "REMOVE").concat(uploaders)
            } else {
                return []
            }
        })
        return {
            uuid,
            loadAttachment,
            removeAttachment,
            attachmentsFiltered: attachs,
        }
    }
}
</script>
<style lang="less" scoped>
    .list-attachments{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        grid-template-rows: auto;
        row-gap: 12px;
        column-gap: 12px;

        & > :deep(.item-attachment){
            min-height: 120px
        }
    }
    .item-button{
        width: 100%;
        height: 120px;
        label{
            width: 100%;
            height: 100%;

            border: none;
            background-color: #fff;
            background-color: transparent;

            font-weight: bold;
            font-size: 3em;
            border-radius: 5px;
            box-shadow: 0 0 4px rgba(99, 99, 99, 0.2);

            cursor: pointer;

            svg{
                transform: scale(.8)
            }
        }
    }
</style>