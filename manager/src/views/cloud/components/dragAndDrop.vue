<template>
	<div class="drag-and-drop"
		@drag.stop.prevent=""
		@dragover.stop.prevent=""
		@dragstart.stop.prevent=""
		@dragend.stop.prevent=""
		@dragenter.stop.prevent="handleDragEnter"
		@dragleave.stop.prevent="handleDragEnd"
		@drop.stop.prevent="handleDrop">

		<transition name="effect-drag-and-drop" >
			<div class="effect-drag-and-drop" v-if="isDragActive"></div>
		</transition>

		<div style="height:100%" :class="{ 'no_pointer_events': isDragActive }">
			<slot />	
		</div>
	</div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '@/store/uploader';
import { nanoid } from "nanoid"

export default {
	name: "drag-and-drop",
	props:{
        path: String,
		pathLtree: String
    },
	setup(props){
		const isDragActive = ref(false);
		const store = useStore()

		function handleDrop(evt){
			const droppedFiles = evt.dataTransfer.files;

			const reqHeaders = {
				fileFullPath: props.path,
				pathltree: props.pathLtree,
                group_id: nanoid(6)
			};

			store.push(Array.from(droppedFiles), reqHeaders)
			setTimeout(() => {
				isDragActive.value = false
			}, 100);
		}
		function handleDragEnter(){
			isDragActive.value = true;
		}

		// Isso evita que a funcao seja chamada logo em seguida do drag enter
		let can = false
		function handleDragEnd(){
			if(can){
				isDragActive.value = false;
				can = false
			}

			setTimeout(() => {
				can = true
			}, 300);
		}

		return {
			isDragActive,
			handleDrop,
			handleDragEnter,
			handleDragEnd
		}
	}
}
</script>

<style  lang="less" scoped>
	.drag-and-drop{
        width: 100%;
        height: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 10px;
		background-color: #fff;
	}

	.no_pointer_events{
		pointer-events: none;
		background-color: rgba(250, 162, 85, 0.4);
	}

	.effect-drag-and-drop{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		border: 5px dashed #ff7700;
		z-index: 200;
		border-radius: 5px;
		pointer-events: none;
		transform: scale(.97, .98);
		transition: 400ms;
	}
	.effect-drag-and-drop-enter-active{
		animation: enterAnimation 500ms;
		animation-fill-mode: both;
		opacity: 1;
	} 
	.effect-drag-and-drop-leave-active {
		animation: leaveAnimation 500ms;
		animation-fill-mode: both;
		opacity: 0;
	}
	.effect-drag-and-drop-enter{
		animation: enterAnimation 500ms;
		animation-fill-mode: both;
		opacity: 1;
	} 
	.effect-drag-and-drop-leave-to /* .effect-drag-and-drop-leave-active em versões anteriores a 2.1.8 */ {
		animation: leaveAnimation 500ms;
		animation-fill-mode: both;
		opacity: 0;
	}

	@keyframes enterAnimation {
		from{
			transform: scale(1);
		}
		to{
			transform: scale(.97, .98);
		}
	}

	@keyframes leaveAnimation {
		from{
			transform: scale(.97, .98);
		}
		to{
			transform: scale(1);
		}
	}
</style>