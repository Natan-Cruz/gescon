<template>
    <li class="card-construction" @click="handleSelectItem">
        <div class="container-image skeleton" :id="`id-${construction.id}`"></div>

        <div class="content-informations">
            <h3 class="name-construction bold">{{ construction.name }}</h3>

            <div class="row">
                <span class="key bold">Início planejado:</span>
                <span class="value" :class="{ 'gray': !construction.planned_start_date }">{{ formatDate(construction.planned_start_date) || "Não especificada" }}</span>
            </div>
            <div class="row">
                <span class="key bold">Início real:</span>
                <span class="value" :class="{ 'gray': !construction.start_date }">{{ formatDate(construction.start_date) || "Não especificada" }}</span>
            </div>
            <div class="row">
                <span class="key bold">Término planejado:</span>
                <span class="value" :class="{ 'gray': !construction.planned_end_date }">{{ formatDate(construction.planned_end_date) || "Não especificada" }}</span>
            </div>
            <div class="row">
                <span class="key bold">Término real:</span>
                <span class="value" :class="{ 'gray': !construction.end_date }">{{ formatDate(construction.end_date) || "Não especificada" }}</span>
            </div>
        </div>
    </li>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from "vue-router"
import { formatDate } from "@/Utils/index.js"

export default {
    name: 'card-construction',
    props:{ construction: Object },
    setup(props){
        const $router = useRouter();
        
        onMounted(loadImage)

        function loadImage(){
            const skeleton = document.getElementById(`id-${props.construction.id}`);
            if(props.construction && props.construction.banner_file_url) {

                const image = new Image()

                image.addEventListener('load', () => {
                    skeleton.classList.remove('skeleton');
                    if(image.width > image.height){
                        image.style.width = '100%'
                    }else{
                        image.style.height = '100%'
                    }
                    skeleton.appendChild(image);
                })

                image.addEventListener('error', function() {
                    skeleton.classList.remove('skeleton');
                    skeleton.classList.add('image-error')
                }, false)

                image.setAttribute('src', props.construction.banner_file_url)
            } else {
                skeleton.classList.remove('skeleton');
                skeleton.innerHTML = "Sem imagem"
            }
        }

        function handleSelectItem(){
            $router.push({ name: "construction/home", params: { constructionID: props.construction.id }})
        }

        return {
            handleSelectItem,
            formatDate: date => formatDate(date, "DD/MM/YYYY")
        }
    }
}
</script>

<style lang="less" scoped >
    .card-construction{
        width: 100%;
        height: auto;
        box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);

        color: #000;
        text-decoration: none;

        align-self: center;
        justify-items: center;

        cursor: pointer;
        border-radius: 5px;
        padding: 10px;
        background-color: #fff;

        align-self: flex-start; 
    }

    .container-image {
        width: 100%;
        height: 300px;

        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #dfdfdf;

        border-radius: 5px;

        font-size: 1.7em;
        color: gray;
        font-weight: bold;
        img{
            width: 100%;
        }
    }
    .content-informations {
        grid-area: description;
        position: relative;
    }
    .name-construction{
        font-size: 2em;
        margin: 10px 0
    }
    .row{
        margin: 5px 0;
    }
    .key, .value{
        font-size: 1.6em;
        white-space: nowrap;
    }
    .key{
        color: #404040;  
    }
    .value{
        margin-left: 10px;
    }
    .gray{
        color: gray;
    }
</style>