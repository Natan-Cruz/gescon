<template>
    <div class="modal modal-is-open" >
        <!-- background -->
        <transition name="background_fade">
            <div class="background" v-if="filterIsShow" ref="background" @click="$emit('close')"></div>
        </transition>

        <!-- content -->
        <transition name="content_modal_animation">

            <div class="content-modal" v-if="filterIsShow">
                
                <!-- scroll -->
                <div class="scroll">
                    <!-- header -->
                    <div style="position: relative">
                        <p class="title-modal">Filtros</p>
                        <button class="button-close" @click="$emit('close')">
                            <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="m10.458 31.458-1.916-1.916 9.5-9.542-9.5-9.542 1.916-1.916 9.542 9.5 9.542-9.5 1.916 1.916-9.5 9.542 9.5 9.542-1.916 1.916-9.542-9.5Z"/></svg>
                        </button>
                    </div>

                    <slot />
                </div>

                <!-- button bottom -->
                <div class="wrapper-buttons" style="justify-content: space-between">
                    <button class="button button-primary text-medium button-search" @click="$emit('submit'); $emit('close')">Pesquisar</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from "vue"

export default {
    emits: ["close", "submit"],
    props: { filterIsShow: Boolean },
    setup(props, { emit }){
        onMounted(() => window.addEventListener("keyup", handleKeyPress, false))
        onBeforeUnmount(() => window.removeEventListener("keyup", handleKeyPress, false))

        function handleKeyPress(evt){
            const keyCode = evt.keyCode;
            
            if(props.filterIsShow){
                if(keyCode === 27)
                   return emit("close")
                if(keyCode === 13){
                    emit("submit")
                    emit('close')
                }
            }
        }
        return {}
    }
}
// 
</script>
<style lang="less" scoped>
    // BACKGROUND
    /* we will explain what these classes do next! */
    .v-enter-active,
    .v-leave-active {
        transition: opacity 250ms ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    // CONTENT MODAL
    .content_modal_animation-enter-from{
        transform: translateX(100%);
        transition: transform 160ms ease-out, opacity 500ms ease;
    }
    .content_modal_animation-enter-to{
        transform: translateX(0);
        transition: transform 160ms ease-out, opacity 500ms ease;
    }
    .content_modal_animation-leave-from{
        transform: translateX(0);
        transition: transform 160ms ease-in, opacity 500ms ease;
    }
    .content_modal_animation-leave-to{
        transform: translateX(110%);
        transition: transform 160ms ease-in, opacity 500ms ease;
    }
</style>

<style lang="less" scoped>
    .modal{
        width: 100%;
        height: 100%;

        display: none;
        justify-content: flex-end;
        align-items: center;
        z-index: 2000;
        // 
        position: fixed;
        top: 0;
        left: 0;
    }
    .modal-is-open{
        display: flex;
        pointer-events: none;
    }

    // 
    .background{
        background-color: rgba(0,0,0,.6);
            
        width: 100%;
        height: 100%;

        position: absolute;
        left: 0;
        top: 0;

        pointer-events: all;
    }
    
    .content-modal{
        width: 380px;
        height: 100%;
        border-radius: 5px 0 0 5px;

        position: relative;

        background-color: #fff;
        z-index: 100;
        overflow: hidden;

        pointer-events: all;
    }
    .scroll{
        height: 100%;
        max-height: 100%;
        overflow: hidden auto;
        padding: 20px 20px 60px 20px;
    }
    .title-modal{
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 16px;
    }

  
    // 
    .button{
        width: auto; 
        padding: 10px;
    }
    .button-close{
        width: 40px;
        height: 40px;

        border: none;
        background-color: #fff;
        border-radius: 50%;

        position: absolute;
        top: -10px;
        right: -5px;

        transform: scale(.8);
    }
    // 
    
    .wrapper-buttons{
        width: 100%;
        height: 50px;
        background-color: #fff;
        padding: 0 20px; 

        position: absolute;
        bottom: 0;
        left: 0;
        border-top: solid 1px gray;

        display: flex;
        flex-direction: row-reverse;
        align-items: center;

        .button{
            width: auto;
            height: auto;
            padding: 10px;
            white-space: nowrap;

            cursor: pointer;
            pointer-events: all;
        }
    }
    // table
    @media screen and (max-width: 500px) {
        .modal{
            justify-content: center;
        }
        .content-modal{
            width: 100%;
            height: 100vh;
            border-radius: 5px;
        }
    }
</style>