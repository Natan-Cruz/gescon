<template>
    <li class="item-file">
        <!-- ERROR -->
        <div class="background background-error" v-if="file.error">
            <p>{{ file.error }}</p>

            <span class="btn-cancel btn-remove btn-cancel-error" @click="removeItem">
                <svg xmlns="http://www.w3.org/2000/svg" width="14.258" height="14.258" viewBox="0 0 14.258 14.258">
                    <path id="Icon_material-close" data-name="Icon material-close" d="M21.758,8.936,20.322,7.5l-5.693,5.693L8.936,7.5,7.5,8.936l5.693,5.693L7.5,20.322l1.436,1.436,5.693-5.693,5.693,5.693,1.436-1.436-5.693-5.693Z" transform="translate(-7.5 -7.5)"/>
                </svg>
            </span>
        </div>
        <!-- DONE -->
        <div class="background background-done" v-if="file.done" >
            <p>Concluido</p>

            <span class="btn-cancel btn-remove btn-remove-item-done" @click="removeItem">
                <svg xmlns="http://www.w3.org/2000/svg" width="14.258" height="14.258" viewBox="0 0 14.258 14.258">
                    <path id="Icon_material-close" data-name="Icon material-close" d="M21.758,8.936,20.322,7.5l-5.693,5.693L8.936,7.5,7.5,8.936l5.693,5.693L7.5,20.322l1.436,1.436,5.693-5.693,5.693,5.693,1.436-1.436-5.693-5.693Z" transform="translate(-7.5 -7.5)"/>
                </svg>
            </span>
        </div>

        <!-- WRAPPER ITEM -->
        <div class="wrapper-item-file" :class="{ 'blur': (file.error || file.done) }">

            <icon-archive :extension="file.fileName.split('.').pop()"></icon-archive>

            <div class="ctn-info">
                <p class="text-medium bold">{{ file.fileName }}</p>
                <p class="text-medium" style="color: #c1c1c1">{{ file.filePath || "/" }}</p>
            </div>

            <div class="ctn-progress">
                <span class="progress-bar" :style="`width:${file.uploadProgress}%`"></span>
            </div>

            <div class="ctn-upload-status">
                <p class="text-medium file-size">{{ formatBytes(file.size) }}</p>
                <!-- <p class="text-medium file-size">{{ formatBytesPerSecond(file.speed) }}</p> -->
            </div>

            <span class="btn-cancel" @click="$emit('event-cancel-upload', file)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14.258" height="14.258" viewBox="0 0 14.258 14.258">
                    <path id="Icon_material-close" data-name="Icon material-close" d="M21.758,8.936,20.322,7.5l-5.693,5.693L8.936,7.5,7.5,8.936l5.693,5.693L7.5,20.322l1.436,1.436,5.693-5.693,5.693,5.693,1.436-1.436-5.693-5.693Z" transform="translate(-7.5 -7.5)"/>
                </svg>
            </span>
        </div>

    </li>
</template>

<script>
import iconArchive from "./iconFileType.vue";
import { formatBytes } from "@/Utils/index.js";

export default {
    name: "item-file",
    components: { iconArchive },
    emits: [ "event-cancel-upload", "event-remove-item" ],
    props:{
        file: Object
    },
    setup(props, { emit }){
         
        function removeItem(){
            emit('event-remove-item', props.file)
        }

        return {
            formatBytes,
            removeItem
        }
    }
}
</script>

<style lang="less" scoped>
    .item-file{
        width: 100%;
        margin-bottom: 12px;
        padding-bottom: 6px;
        border-bottom: 2px dashed #dedede;
        position: relative;
    }

    .background{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(255,255,255,.6);
        z-index: 100;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    // ERROR
    .background-error{
        p{
            font-size: 1.7em;
            color: red;
            font-weight: bold;
            text-shadow: rgba(0,0,0,.2);
        }
    }

    .btn-cancel-error{
        width: 24px;
        height: 24px;
        cursor: pointer;
        svg{
            fill: red;
            width: 16px;
            height: 16px;
        }
    }

    // DONE
    .background-done{
        p{
            font-size: 1.7em;
            color: #009900;
            font-weight: bold;
            text-shadow: rgba(0,0,0,.2);
        }
    }

    .btn-remove-item-done{
        width: 24px;
        height: 24px;
        cursor: pointer;
        svg{
            fill: #009900;
            width: 16px;
            height: 16px;
        }
    }

    // WRAPPER ITEM
    .wrapper-item-file{
        width: 100%;
        display: grid;
        grid-template-areas: 'icon informations uploadStatus btnCancel' 'progress progress progress progress';
        grid-template-columns: 30px 1fr auto 24px;
        grid-template-rows: 50px 10px;
        column-gap: 14px;
        row-gap: 6px;
    }

    .blur{
        filter: blur(2px);
    }
    

    .ctn-icon-spinner{
        width: 100%;
        grid-area: icon;
    }
    .ctn-info{
        grid-area: informations;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        overflow: hidden;
        p{
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
    .ctn-upload-status{
        grid-area: uploadStatus;
         display: flex;
        flex-direction: column;
        justify-content: space-around;
        overflow: hidden;
    }
    .btn-cancel{
        grid-area: btnCancel;
        display: flex;
        align-items: center;
    }

    .ctn-progress{
        grid-area: progress;
        width: 100%;
        height: 4px;
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        background-color: #ffe3cb;
    }

    .progress-bar{
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #ff7700;
    }

</style>