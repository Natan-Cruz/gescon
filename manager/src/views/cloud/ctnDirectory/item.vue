<template>
	<li class="row-tree-list no_highlights" :class="{ 'row-tree-list_isFolder': isFolder }" ref="ref_item">
		<div class="wrapper-tree-list" 
			@click="$emit('select-item', item)" 
			:class="{ bold: isFolder }" 
			@contextmenu.prevent="$emit('context-menu', item)">
			
			<div class="icon-item-type">
				<span v-if="isUploading" class="spinner-loading"></span>
				<svg v-else-if="item.error" xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="red"><path d="M11 13H13V7H11ZM12 17Q12.425 17 12.713 16.712Q13 16.425 13 16Q13 15.575 12.713 15.287Q12.425 15 12 15Q11.575 15 11.288 15.287Q11 15.575 11 16Q11 16.425 11.288 16.712Q11.575 17 12 17ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>
				<icon-archive v-else :extension="fileType"></icon-archive>
			</div>
			
			<span class="text item-name" :style="item.error && 'text-decoration: line-through'">
				{{ item.folder_name || item.file_name || item.fileName}}
			</span>

			<span class="file-size">{{ fileSize }}</span>

			<div class="ctn-icons">
				<p class="created-by-system" v-if="item.was_created_by_system" title="Criada pelo sistema">Criada pelo sistema</p>
				<p class="created-by-system" v-if="item.isNew" title="Pasta nova">Pasta nova</p>
				<p class="created-by-system" v-if="item.done" title="Pasta nova">Arquivo novo</p>
				<visibility-icon v-if="item.is_public" title="Pasta pública"/>
				<star-icon v-if="item.is_favorite" title="Favorita"/>
				<p style="font-size: 1.5em; color: gray" v-show="isUploading">Fazendo upload...</p>
				<p style="font-size: 1.5em; color: gray" v-show="item.error">Ops, ocorreu um erro!</p>
			</div>
		</div>
		<button class="btn-more-options" @click="$emit('click-more-options', item)" v-show="item.folder_name || item.file_name">
			<svg xmlns="http://www.w3.org/2000/svg" width="5.609" height="23" viewBox="0 0 5.609 23">
				<g id="Icon_feather-more-vertical" data-name="Icon feather-more-vertical" transform="translate(-15 -4.5)">
					<path id="Caminho_1" data-name="Caminho 1" d="M19.109,18a1.412,1.412,0,0,1-1.3,1.5A1.412,1.412,0,0,1,16.5,18a1.412,1.412,0,0,1,1.3-1.5A1.412,1.412,0,0,1,19.109,18Z" transform="translate(0 -2)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
					<path id="Caminho_2" data-name="Caminho 2" d="M19.109,7.5A1.412,1.412,0,0,1,17.8,9a1.412,1.412,0,0,1-1.3-1.5A1.412,1.412,0,0,1,17.8,6,1.412,1.412,0,0,1,19.109,7.5Z" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
					<path id="Caminho_3" data-name="Caminho 3" d="M19.109,28.5A1.412,1.412,0,0,1,17.8,30a1.515,1.515,0,0,1,0-3A1.412,1.412,0,0,1,19.109,28.5Z" transform="translate(0 -4)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
				</g>
			</svg>
		</button>
	</li>
</template>

<script>
import iconArchive from "../icons/iconFileType.vue";
import visibilityIcon from "../icons/iconVisibility.vue";
import starIcon from "../icons/iconStar.vue";
import { formatBytes } from "@/Utils/index"
import { computed, onMounted, ref } from 'vue';

export default {
	name: "tree-item",
	components:{
		iconArchive,
		visibilityIcon,
		starIcon
	},
	props: {
		item: Object
	},
	setup(props){
		const isFolder = computed(() => props.item.folder_name ? true : false)
        const isUploading = computed(() => (!props.item.done && !props.item.error) && props.item.uploadProgress)
		const fileType = computed(() => {
			if(isFolder.value)
				return "folder"
			
			const fileName = props.item.file_name || props.item.fileName
			if(fileName)
				return fileName.split('.').pop()
			else
				return ""
		})
		const fileSize = props.item.size && formatBytes(props.item.size)
		const ref_item = ref(null)

		onMounted(() => {
			if(props.item.isNew){
				const ctnScroll = document.querySelector(".body")
				ctnScroll.scrollTo({ top: ref_item.value.offsetTop, behavior: "smooth" })
			}
		})

		return {
			isFolder,
			fileType,
			fileSize,
			ref_item,
			isUploading
		}
	}
};
</script>

<style lang="less" scoped>
    .row-tree-list {
		width: 100%;
		height: auto;
        position: relative;
        cursor: pointer;
		border-bottom: dashed 1px rgb(224, 224, 224);
    }
	
    .wrapper-tree-list{
		width: 100%;
		height: 100%;
		padding: 16px 50px 16px 20px;

		display: grid;
		grid-template-areas: "iconType itemName fileSize" "iconType icons fileSize";
		grid-template-columns: 32px 1fr auto;
		grid-template-rows: repeat(2, auto);
		column-gap: 12px;
		row-gap: 4px;

		&:hover{
            background-color: rgb(224, 224, 224);
        }
    }

	.icon-item-type{
		grid-area: iconType;
		align-self: center;
	}
	.item-name{
		grid-area: itemName;
		align-self: center;
	}
	.file-size{
		grid-area: fileSize;
		color: gray;
		align-self: center;
		font-size: 1.7em;
	}

	.ctn-icons{
		grid-area: icons;
	}
    .text {
		width: 100%;
        font-size: 1.6em;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
    }
	.ctn-icons{
		display: flex;
		align-items: center;
		column-gap: 6px;
	}
	.btn-more-options{
		width: 50px;
		height: 50px;
        position: absolute;
        right: 0;
        top: 12px;
        cursor: pointer;
		background-color: transparent;
		border:none;
		transition: 120ms;
        svg{
            width: 20px;
            height: 20px;
            stroke: #000;
            pointer-events: none;
        }
		&:active{
			transform: scale(.8);
		}
    }

	.created-by-system{
		font-size: 1.4em;
		color: rgb(255, 255, 255);
		background-color: rgba(236, 110, 0, 0.85);
		border-radius: 16px;
		padding: 2px 6px;
	}

	.spinner-loading {
        width: 28px;
        height: 28px;
        margin: 0 auto;
        border: solid 4px transparent;
        border-bottom: solid 4px #f70;
        border-radius: 50%;
        transform: rotate(0deg);
        animation: animation-reload 1250ms infinite;
        display: block;
    }

    @keyframes animation-reload {
        to {
            transform: rotate(0deg);
        }
        from {
            transform: rotate(-1080deg);
        }
    }
	
	@media screen and (max-width: 550px) {
		.wrapper-tree-list{
			padding: 14px 50px 14px 10px;
			grid-template-areas: "iconType itemName" "iconType icons";
			grid-template-columns: 32px 1fr;
			column-gap: 8px;
		}
		.file-size{
			display: none;
		}
	}
</style>