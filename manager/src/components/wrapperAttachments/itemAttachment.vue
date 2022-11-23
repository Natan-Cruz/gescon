<template>
    <div class="item-attachment no_highlights">

        <div class="_ctn_" @click="!itemHasFile && $emit('select-item', item.id)">
            <div class="ctn-icon" :class="{ 'run-animation-upload': isUploading, 'run-animation-download': isDownloading }" ref="file_viewer">
                <icon-archive v-if="fileType.type !== 'image'" :extension="fileType.extension"></icon-archive>
            </div>
            <div class="ctn-info">
                <p class="text">{{ item.file_name || item.name || item.fileName }}</p>
            </div>
        </div>


        <popup-options class="popup-options" v-show="!disabled" v-slot="{ hide }">
            <p class="text-medium" @click="$emit('download'); hide()">Download</p>
            <p class="text-medium" @click="$emit('remove'); hide()">Excluir</p>
        </popup-options>
    </div>
</template>

<script>
import mime from "mime";
import popupOptions from '@/components/popup-options.vue';
import { isFile } from '@/Utils';
import { computed, onMounted, ref } from 'vue';
import iconArchive from "./iconFileType.vue";

export default {
    emits: ["remove"],
    components: { popupOptions, iconArchive },
    props: {
        item: {
            type: [Object, File],
            required: true,
            default: () => {}
        },
        disabled: Boolean
    },
    setup(props){
        const file_viewer = ref(null)
        const isDownloading = ref(false);
        const itemHasFile = isFile(props.item)
        const isUploading = computed(() => itemHasFile && !props.item.done && props.item.uploadProgress)
        
        const fileType = computed(() => {
            if(!props.item) return {}

            const fileName = props.item.file_name || props.item.name || props.item.fileName
            if(!fileName) return {}
            
            const mimeType = mime.getType(fileName)
            if(!mimeType) return {}

            const [ type, extension ] = mimeType.split("/")
            return {
                type,
                extension
            }
        })

        onMounted(() => {
            if(fileType.value.type !== "image" || !file_viewer.value) return;

            const src = itemHasFile ? URL.createObjectURL(props.item) : `https://gescon-tec.herokuapp.com/erp/files/${ props.item.id }?width=150&quality=80`;

            const image = new Image();
            isDownloading.value = true;

            image.addEventListener('load', () => {
                file_viewer.value.innerHTML = "";
                if(image.width > image.height){
                    image.style.width = '100%';
                }else{
                    image.style.height = '100%';
                }
                file_viewer.value.appendChild(image);
                file_viewer.value.style.backgroundColor = "#dfdfdf";
                isDownloading.value = false;
            })

            image.addEventListener('error', () => {
                isDownloading.value = false;
                file_viewer.value.innerHTML = "Erro ao carregar";
            }, false)

            image.setAttribute('src', src);
        })

        return {
            file_viewer,
            isDownloading,
            isUploading,
            itemHasFile,
            fileType
        }
    }
}
</script>

<style lang="less" scoped>
    .item-attachment{
        width: 100%;
        height: 100%;
        border: 1px solid #bdbdbd;
        border-radius: 6px;
        position: relative;
        margin-right:16px;

        &:last-child{
            margin-right: 0;
        }
        &:hover{
            cursor: pointer;
            border: 1px solid #a5a5a5;
        }
    }
    ._ctn_{
        height: 100%;
    }
    .ctn-icon{
        width: 100%;
        height: calc(100% - 30px);

        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
        font-size: 1.7em;

        & > :deep(.icon-file){
            width: 54px;
        }

        & > img{
            width: 100%;
        }
    }
    .ctn-info{
        width: 100%;
        height: 30px;
        border-top: 1px solid #dadce0;
        padding: 6px;
    }
    .text{
        width: 100%;
        height: 100%;

        font-size: 1.5em;
        cursor: default;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .popup-options{
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: #fff;
        height: 28px;
    }   

    .run-animation-upload,
    .run-animation-download{
        &::before{
            content: "";
            width: 100%;
            height: 4px;

            background-color: rgb(255, 196, 145);

            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
        }

        &::after{
            content: "";
            width: 36%;
            height: 4px;

            background-color: #f70;

            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
        }
    }

    .run-animation-upload{
        &::after{
            transform: translateX(-10%);
            animation: translate_bar_animation_uploading 1200ms forwards ease infinite;
        }
    }
    .run-animation-download{
        &::after{
            transform: translateX(-10%);
            animation: translate_bar_animation_downloading 1200ms forwards ease infinite;
        }
    }
    
    @keyframes translate_bar_animation_uploading {
        from{
            transform: translateX(-100%);
        }
        to{
            transform: translateX(400%);
        }
    }

    @keyframes translate_bar_animation_downloading {
        from{
            transform: translateX(400%);
        }
        to{
            transform: translateX(-100%);
        }
    }
</style>
