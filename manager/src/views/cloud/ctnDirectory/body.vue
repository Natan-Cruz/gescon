<template>
	<div class="body">
		<loading-or-error :isLoading="isLoading" :error="errorMsg" @event-retry="$emit('event-retry')" @event-back="$router.replace({ name: 'construction/cloud' })"/>
		<!--  -->
		<template v-if="folders.length">
			
			<div v-if="favorites.length" style="margin-bottom: 12px; padding: 0 20px">
				<h2 class="sub-title">Favoritos</h2>	

				<vue-horizontal :button-between="false " responsive ref="horizontal">
					<item-card-favorite 
						class="item"
						v-for="favorite in favorites" 
						:key="favorite.id" 
						:item="favorite" 
						@select-item="handleClick" 
						@click-more-options="handleClickInMoreOptions" 
						@context-menu="handleClickInMoreOptions" />
				</vue-horizontal>
			</div>

			<tree-item
				v-for="folder in folders"
				:key="folder.id"
				:item="folder"
				@select-item="handleClick"
				@click-more-options="handleClickInMoreOptions"
				@context-menu="handleClickInMoreOptions" />
		</template>
		<p v-else-if="!(isLoading || errorMsg)" class="text-medium" style="text-align:center; margin-top: 30px" >Nenhum item</p>
	</div>
</template>

<script>
import treeItem from "./item.vue";
import itemCardFavorite from '../components/itemCardFavorite.vue';
import VueHorizontal from 'vue-horizontal';

import { watch, ref } from 'vue';

export default {
	emits: ["enter-folder", "select-file"],
	components: {
		itemCardFavorite,
		treeItem,
		VueHorizontal
	},
    props:{
		folders: Array,
		favorites: Array,
		isLoading: Boolean,
        errorMsg: String
    },
	setup(props, { emit }){
		const horizontal = ref(null)

		function handleClick(params) {
			// é um arquivo
			if(params.folder_name){
				emit("enter-folder", params.path_ltree)
			}else{
				emit("select-file", params.id)
			}
		}
		function handleClickInMoreOptions(item){
			emit("open-modal", item)
		}

		watch(() => props.favorites, () => {
			if(horizontal.value && props.favorites.length)
				horizontal.value.refresh(() => {})
		})
		return {
			handleClick,
			handleClickInMoreOptions,
			horizontal
		}
	}
}
</script>

<style lang="less" scoped>
	.body{
		width: 100%;
		height: calc(100% - 44px);
		padding-bottom: 72px;
		overflow: hidden auto;
		position: relative;
	}

	.sub-title{
		font-size: 1.8em;
		font-weight: bold;
		margin: 8px 0 16px 0;
	}
</style>
