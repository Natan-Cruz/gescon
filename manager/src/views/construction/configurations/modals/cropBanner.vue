<template>
	<Modal @close-modal="$emit('close-modal')">
		<div class="container-functions-image">
			<div class="button-function" @click="rotate(90)">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.47 21.49C4.2 19.93 1.86 16.76 1.5 13H0c.51 6.16 5.66 11 11.95 11 .23 0 .44-.02.66-.03L8.8 20.15l-1.33 1.34zM12.05 0c-.23 0-.44.02-.66.04l3.81 3.81 1.33-1.33C19.8 4.07 22.14 7.24 22.5 11H24c-.51-6.16-5.66-11-11.95-11zM16 14h2V8a2 2 0 00-2-2h-6v2h6v6zm-8 2V4H6v2H4v2h2v8a2 2 0 002 2h8v2h2v-2h2v-2H8z"/></svg>                    
				<span class="text-medium">Girar</span>
			</div>
			<div class="button-function" @click="flip(180, 0)">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"/></svg>
				<span class="text-medium">Horizontal</span>
			</div>
			<div class="button-function" @click="flip(0, 180)">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"/></svg>
				<span class="text-medium">Vertical</span>
			</div>
		</div>

		<cropper
			class="cropper"
			:src="state.image.src"
			ref="cropper">
		</cropper>

		<input style="display:none" type="file" ref="file" @change="loadImage($event)" accept="image/*">

		<form-loading-or-error :isLoading="state.isLoading" :error="state.errorMsg" />

		<div class="container-buttons-image">
			<button class="button button-second text-medium" for="input-image" @click="$refs.file.click()">Nova imagem</button>
			<button class="button button-second text-medium" @click="finalizeImage">Salvar imagem</button>
		</div>
	</Modal>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import getMimeType from "../utils/getMimeType"
import { uploadImage } from "../utils/uploader"
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import { notify } from "@kyvg/vue3-notification";

export default {
	name:"modal-crop-photo",
    props: {
        constructionId: String
    },
	components: {
		/*eslint-disable */
		Cropper
		/*eslint-enable */
	},
	setup(props, { emit }){
		const cropper = ref(null)
		const file = ref(null)
		const state = reactive({
			image: {
				src: null,
				type: null
			},
			isLoading: false,
			errorMsg: ""
		})

		onMounted(() => {
			file.value.click()
		})
		onUnmounted(() => {
			if (state.image.src)
				URL.revokeObjectURL(state.image.src)
		})

		function rotate(angle){
			cropper.value.rotate(angle)
		}
		function flip(x, y){
			cropper.value.flip(x, y)
		}
		function reset() {
			state.image.src = null
			state.image.type = null
		}
		function loadImage(event) {
			const { files } = event.target;
			if (!(files && files[0])) return;
			
			if (state.image.src) {
				URL.revokeObjectURL(state.image.src)
			}
			const blob = URL.createObjectURL(files[0]);
			
			const reader = new FileReader();
			reader.onload = e => {
				state.image = {
					src: blob,
					type: getMimeType(e.target.result, files[0].type),
				};
			};
			reader.onerror = error => console.error(error)
			reader.readAsArrayBuffer(files[0]);
		}
		function finalizeImage() {
			const { canvas } = cropper.value.getResult();
			if (!canvas) return;

			canvas.toBlob( blob => {
				state.isLoading = true;
				
				uploadImage({ 
					imageData: blob,
					constructionId: props.constructionId
				})
				.then( data => {
					emit("set", data)
					emit("close-modal")
					notify({
						title: "Imagem salva!",
						type: "success",
						duration: 5000
					});
				})
				.catch( () => {
					notify({
						title: "Ops, ocorreu um problema!",
						type: "error",
						duration: 5000
					});
				})
				.finally(() => state.isLoading = false )
			}, 'image/jpeg');
		}

		return {
			state,
			cropper,
			file,
			// 
			rotate,
			flip,
			reset,
			loadImage,
			finalizeImage
		}
	}
}
</script>

<style lang="less" scoped>
	:deep(.cropper){
		height: 400px;
		width: 600px;
		background: #DDD;

		margin: 0 auto 16px auto;
	}
	
	.container-functions-image, .container-buttons-image{
		width: 100%;
		height: auto;
		border-radius: 5px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 5px;
	}
	.container-functions-image{
		margin-bottom: 14px;
		border: 1px solid #a8a8a8;
	}
	.container-buttons-image{
		justify-content: space-between;
		margin-top: 14px;
	}
	.button-function{
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: column;
		cursor: pointer;
		&:hover {
			&>svg{
				fill: #FF7900;
			}
			&>span{
				color: #FF7900;
				pointer-events: none;
			}
		}
	}
	.button:first-child{
		margin-right: 20px;
	}
</style>