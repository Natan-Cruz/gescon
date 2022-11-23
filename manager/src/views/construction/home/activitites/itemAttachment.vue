<template>
    <div class="item-attachment no_highlights" :class="{ 'run-animation-download': isDownloading }" ref="file_viewer"></div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
    props: {
        item: {
            type: Object,
            required: true,
            default: () => {}
        },
        disabled: Boolean
    },
    setup(props){
        const file_viewer = ref(null)
        const isDownloading = ref(false);

        onMounted(() => {
            const src = `https://gescon-tec.herokuapp.com/erp/files/${ props.item.id }?width=250&quality=80`;

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
            isDownloading
        }
    }
}
</script>

<style lang="less" scoped>
    .item-attachment{
        width: 100%;
        border: 1px solid #bdbdbd;
        border-radius: 6px;
        position: relative;
        margin-right:16px;
        background-color: #dfdfdf;

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

        &:last-child{
            margin-right: 0;
        }
        &:hover{
            cursor: pointer;
            border: 1px solid #a5a5a5;
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
</style>
