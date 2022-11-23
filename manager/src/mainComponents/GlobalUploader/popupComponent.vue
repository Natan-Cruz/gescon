<template>
    <div >
        <div class="background" @click="closePopup"></div>
        <div class="wrapper-popup">
            <button-close-modal @event-close="closePopup" />
            
            <p class="title">Upload de arquivos</p>

            <ul style="padding: 20px">
                <item-file 
                    v-for="(file, i) in queueFiles" 
                    :key="i"
                    :file="file"
                    @event-remove-item="removeItem"
                    @event-cancel-upload="cancelUpload" />

                <li v-if="!queueFiles.length">
                    <p class="text-medium" style="text-align:center">Vazio</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import ItemFile from './itemFile.vue';
import buttonCloseModal from "./buttons/buttonClose.vue";

export default {
    name: "popup",
    emits: ["close-popup", "remove-item", "cancel-upload"],
    components: {
        ItemFile,
        buttonCloseModal,
    },
    props: {
        queueFiles: Array
    },
    setup(_, { emit }){

        function closePopup(){
            emit("close-popup");
        }

        function removeItem(file){
            emit("remove-item", file._uuid)           
        }
        function cancelUpload(file){
            emit("cancel-upload", file._uuid)           
        }

        return {
            closePopup,
            removeItem,
            cancelUpload
        }
    }
}
</script>

<style lang="less" scoped >
    .background{
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.2);
        z-index: 1000;
        pointer-events: all;

    }
    
    .wrapper-popup{
        width: 100vw;
        max-width: 600px;
        height: 500px;
        box-shadow: 0 0 6px rgba(0,0,0,.2);
        background-color: #fff;
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10000;
        border-radius: 5px;
        pointer-events: all;
        overflow: auto;
    }

    .title{
        font-size: 2em;
        text-align: center;
        font-weight: bold;
        padding: 16px 0;
        box-shadow: rgba(50,50,93,.25) 1px 1px 27px 0px, rgba(0, 0, 0, .3) 1px 2px 16px -8px;
        color: #000;
    }
    
    @media screen and (max-width: 600px) {
        .wrapper-popup{
            width: 100vw;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            border-radius: 0;
        }
        .button-close{
            display: block;
        }
    }

</style>