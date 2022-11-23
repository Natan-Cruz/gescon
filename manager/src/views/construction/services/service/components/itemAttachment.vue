<template>
    <div class="item-attachment no_highlights">
        <div class="_ctn_" @click="$emit('select-item', item.id)">
            <div class="ctn-icon" :class="{ 'run-animation-download': isDownloading }" ref="file_viewer">
                <icon-archive v-if="filetype.split('/')[0] !== 'image'" :extension="filetype.split('/')[1]"></icon-archive>
            </div>
            <div class="ctn-info">
                <p class="text">{{ item.fileName }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import mime from "mime";
import { onMounted, ref } from 'vue';
import iconArchive from "@/components/wrapperAttachments/iconFileType.vue";

export default {
    emits: ["remove"],
    components: { iconArchive },
    props: {
        item: {
            type: Object,
            required: true
        },
        disabled: Boolean
    },
    setup(props){
        const file_viewer = ref(null)
        const isDownloading = ref(false);

        const filetype = (() => {
            if(!props.item) return;
            return props.item.fileName ? mime.getType(props.item.fileName.split('.').pop()) : ""
		})()

        onMounted(() => {
            if(filetype.split("/")[0] !== "image") return;

            const src = `https://gestor-obras.herokuapp.com/files/${props.item.id}`
            const image = new Image()
            isDownloading.value = true;

            image.addEventListener('load', () => {
                file_viewer.value.innerHTML = ""
                if(image.width > image.height){
                    image.style.width = '100%'
                }else{
                    image.style.height = '100%'
                }
                file_viewer.value.appendChild(image)
                file_viewer.value.style.backgroundColor = "#dfdfdf"
                isDownloading.value = false;
            })

            image.addEventListener('error', () => {
                isDownloading.value = false;
                file_viewer.value.innerHTML = "Error"
            }, false)

            image.setAttribute('src', src)
        })

        return {
            file_viewer,
            isDownloading,
            filetype
        }
    }
}
</script>

<style lang="less" scoped>
    .item-attachment{
        width: 100%;
        height: auto;
        border: 1px solid #dadce0;
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

    .ctn-icon{
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;

        & > :deep(.icon-file){
            width: 54px;
        }

        & > img{
            width: 100%;
        }
    }

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
            transform: translateX(-10%);

            animation: animation_download 1200ms forwards ease infinite;
        }
    }

    @keyframes animation_download {
        from{
            transform: translateX(400%);
        }
        to{
            transform: translateX(-100%);
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
</style>
