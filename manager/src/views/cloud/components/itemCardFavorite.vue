<template>
    <div class="item-card-favorite">
        <div class="_ctn_" @click="$emit('select-item', item)" @contextmenu.prevent="$emit('context-menu', item)">

            <div class="ctn-icon" :class="{ 'run-animation-download': isDownloading }" ref="file_viewer">
                <icon-archive v-if="item.file_type && item.file_type.split('/')[0] !== 'image'" :extension="item.file_type.split('/')[1]" />
            </div>
            <div class="ctn-info">
                <p class="text">{{ item.folder_name || item.file_name }}</p>
            </div>
        </div>
        <button class="btn-more-options" @click="$emit('click-more-options', item)">
            <svg xmlns="http://www.w3.org/2000/svg" width="5.609" height="23" viewBox="0 0 5.609 23">
                <g id="Icon_feather-more-vertical" data-name="Icon feather-more-vertical" transform="translate(-15 -4.5)">
                    <path id="Caminho_1" data-name="Caminho 1" d="M19.109,18a1.412,1.412,0,0,1-1.3,1.5A1.412,1.412,0,0,1,16.5,18a1.412,1.412,0,0,1,1.3-1.5A1.412,1.412,0,0,1,19.109,18Z" transform="translate(0 -2)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                    <path id="Caminho_2" data-name="Caminho 2" d="M19.109,7.5A1.412,1.412,0,0,1,17.8,9a1.412,1.412,0,0,1-1.3-1.5A1.412,1.412,0,0,1,17.8,6,1.412,1.412,0,0,1,19.109,7.5Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                    <path id="Caminho_3" data-name="Caminho 3" d="M19.109,28.5A1.412,1.412,0,0,1,17.8,30a1.515,1.515,0,0,1,0-3A1.412,1.412,0,0,1,19.109,28.5Z" transform="translate(0 -4)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                </g>
            </svg>
        </button>
    </div>
</template>

<script>
import mime from "mime";
import iconArchive from "../icons/iconFileType.vue";
import { computed, onMounted, ref } from 'vue';

export default {
    name: "item-card-favorite",
    components: { iconArchive },
    props: {
        item: Object
    },
    setup(props){
        const file_viewer = ref(null)
        const isDownloading = ref(false);
        const isFolder = computed(() => props.item && props.item.folder_name)

        const filetype = (() => {
            if(!props.item || isFolder.value) return "";
            return props.item.file_name ? mime.getType(props.item.file_name.split('.').pop()) : mime.getType(props.item.name.split('.').pop())
		})()

        onMounted(() => {
            if(isFolder.value) return;
            
            if(filetype.split("/")[0] !== "image") return;

            const src = `https://gescon-tec.herokuapp.com/erp/files/${ props.item.id }?width=150&quality=80`;

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
            isFolder,
            filetype,
            file_viewer,
            isDownloading
        }
    }
}
</script>

<style lang="less" scoped>
    .item-card-favorite{
        width: 200px;
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
        height: 110px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        font-size: 1.7em;

        position: relative;

        & > :deep(.icon-file){
            width: 54px;
        }

        & > img{
            width: 100%;
        }
    }

    .ctn-info{
        width: 100%;
        height: 57px;
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

    .btn-more-options{
        position: absolute;
        right: 1px;
        bottom: 7px;
        cursor: pointer;
        width: 16px;
        height: 16px;
		background-color: transparent;
		border:none;
        svg{
            width: 16px;
            height: 16px;
            stroke: #000;
            pointer-events: none;
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
            animation: translate_bar_animation_downloading 1200ms forwards ease infinite;
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

    @media screen and (max-width: 700px) {
        .item-card-favorite{
            width: 150px;
        }
    }
</style>
