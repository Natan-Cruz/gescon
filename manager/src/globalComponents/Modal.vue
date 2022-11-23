<template>
   <div class="global__modal">
        <div class="global__background-modal" @click="$emit('close-modal')"></div>
        <div class="global__wrapper-modal" :style="`max-width: ${ maxWidth }px`">
            <slot />
        </div>
    </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from "vue"

export default {
    emits: ["close-modal", "submit" ],
    props: {
        maxWidth: {
            type: Number,
            required: false,
            default: () => 800
        }
    },
	setup(_, { emit }){

		onMounted(() => { 
			window.addEventListener("keydown", handleKey, false)
		})

		onBeforeUnmount(() => {
			window.removeEventListener("keydown", handleKey, false)
		})

		function handleKey(evt){
			const keyCode = evt.keyCode
			if(keyCode === 27) return emit("close-modal")
			if(keyCode === 13) return emit("submit")
		}
		
	}
}
</script>

<style lang="less" scoped>
    .global__modal{
		width: 100%;
		height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		
		z-index: 2000;
    }
	.global__background-modal{
		background-color: rgba(0,0,0,.6);
			
		width: 100%;
		height: 100%;

		position: absolute;
		left: 0;
		top: 0;
	}
    .global__wrapper-modal{
        width: 90%;
		max-width: 800px;

		height: auto;
		max-height: 90%;

        padding: 20px;
		position: relative;

        background-color: #fff;
        border-radius: 5px;
		z-index: 100;

		overflow-x: hidden;
		overflow-y: auto;
    }
</style>