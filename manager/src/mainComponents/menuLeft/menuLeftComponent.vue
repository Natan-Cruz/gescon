<template>
    <div class="menu-left" :class="{ 'style-show-menu_left': isOpen }" ref="menu_left">
        <!-- background -->
        <transition name="fade">
            <div class="background" @click="$emit('event-close-menu-left')" v-show="isOpen" ref="background"></div>
        </transition>
        <!-- menu-left -->
            
        <div class="content" :class="{ 'menu-left-is-open-mobile': isOpen }" ref="content_menu_left">
            <slot />
        </div>
    </div>
</template>

<script>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

export default {
    props: {
        isOpen: Boolean
    },
    setup(props, { emit }){
        const content_menu_left = ref(null)
        const background = ref(null);
        const menu_left = ref(null)

        const state = reactive({ 
            initalPosition: 0,
            pos: 100,
            $elem: undefined,
            $background: undefined,
            y: 0,
            x: 0,
            vertical: false,
            horizontal: false,
            steps: 0
        })

        const start = ref([])
        const end = ref([])

        function handleTouchStart(evt){
            // É importante frisar, que o style.transform sobrepõe a classe-css responsável pela ação
            // é necessario limpar o style 
            const { clientX, clientY } = evt.touches[0];

            state.initalPosition = clientX;
            state.y = clientY
            state.x = clientX

            start.value = [ clientX, clientY ]
        }
        function handleTouchMove(evt){
            // Se maior que 1000px não é necessário
            if(window.innerWidth >= 1000) return;

            const { clientX, clientY } = evt.touches[0];

            if(!end.value.length){
                end.value = [ clientX, clientY ]

                let differenceX = end.value[0] - start.value[0], differenceY = end.value[1] - start.value[1] 

                if(Math.abs(differenceX) > Math.abs(differenceY))
                    state.horizontal = true
                else
                    state.vertical = true
            }
            // Isto evita que a rolagem vertical se mescle com a rolagem horizontal 
            // ou vice-versa
            if(state.vertical) return 

            state.y = clientY
            state.x = clientX
            // if(clientY !== state.y) return
            // Calcula porcentagem da tela percorrida pelo deslize
            state.pos = 100 - ((state.initalPosition - clientX) / (window.innerWidth / 100 )); 
            state.$background.style.opacity = (state.pos) / 100
            // Se for maior que 100 retorna
            if(state.pos > 100) return
            // aplica todas os estilos para tal
            state.$elem.style.transition = "none";
            state.$elem.style.transform = `translateX(${ (100 - state.pos) * -1 }%)`;
        }
        function handleTouchEnd(evt){
            state.x = 0;
            state.y = 0;
            state.vertical = false;
            state.horizontal = false;
            state.steps = 0

            start.value = []
            end.value = []


            const { clientX } = evt.changedTouches[0];
            state.pos = 100 - ((state.initalPosition - clientX) / (window.innerWidth / 100 )); 
            state.$elem.style.transition = "200ms";
            
            if(state.pos > 67){
                state.$elem.style.transform = `translateX(0%)`
                state.$background.style.opacity = "1"
            }
            else{
                state.$elem.style.transform = `translateX(-100%)`
                state.$background.style.opacity = "0"
                emit('event-close-menu-left');
            }
        }

        onMounted(() => {
            const menuLeft = menu_left.value

            state.$elem = content_menu_left.value;
            state.$background = background.value;

            menuLeft.addEventListener("touchstart", handleTouchStart, {passive: true})
            menuLeft.addEventListener("touchmove", handleTouchMove, {passive: true})
            menuLeft.addEventListener("touchend", handleTouchEnd, {passive: true})
            menuLeft.addEventListener("touchcancel", handleTouchEnd, {passive: true})

            // const selected = document.querySelector(".li-page.selected")
            // const groupPages = document.querySelector(".group-pages")
            // console.log(selected && selected.getBoundingClientRect())
            // console.log(groupPages && groupPages.getBoundingClientRect())
        })

        onBeforeUnmount(() => {
            const menuLeft = menu_left.value;

            menuLeft.removeEventListener("touchstart", handleTouchStart)
            menuLeft.removeEventListener("touchmove", handleTouchMove)
            menuLeft.removeEventListener("touchend", handleTouchEnd )
            menuLeft.removeEventListener("touchcancel", handleTouchEnd)
        })

        watch(() => props.isOpen, (v) => {
            if(!v){
                state.$elem.removeAttribute("style");
                state.$background.removeAttribute("style")
            }
        })

        return {
            content_menu_left,
            background,
            menu_left,
            state
        }
    }
  }
</script>

<style lang="less" scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity 200ms;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>

<style lang="less" scoped>
    .menu-left {
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    .background {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(2, 2, 2, .4);
        z-index: 100;
        display: none;
        pointer-events: all;
    }
    .content {
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: relative;
        pointer-events: all;
        transition: 200ms;
        box-shadow: 1px 0 6px #c3c3c3;
    }
   
    @media screen and (max-width:1000px) {
        .menu-left {
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 2000;
        }
        .style-show-menu_left {
            display: block;

            .background {
                opacity: 1
            }
        }
        // 
        .background {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            display: block;
            opacity: 0;
            transition: 200ms;
        }
        // 
        .content{
            width: 84%;
            max-width: 400px;
            transform: translateX(-100%);
            transition: 230ms ease;
            box-shadow: none;
        }
        .menu-left-is-open-mobile{
            transform: translateX(0);
        }
    }
</style>