<template>
	<div style="height:100%;">
		<drag-and-drop :path="folderLocation.path" :pathLtree="folderLocation.pathLtree">

			<header-component 
				:path_name="folderLocation.path"
				:path_tree="folderLocation.pathLtree"
				:isLoading="isLoading"
				v-model:search="query.search"
				v-model:filter="query.filter"
				v-model:mode="query.mode"
				@enter-folder="enterFolder"
				@event-refresh="main" />


			<body-component 
				:folders="folders"
				:favorites="favorites"
				:error="error"
				:isLoading="isLoading"
				@event-retry="main" 
				@enter-folder="enterFolder"
				@select-file="selectFile"
				@open-modal="openModalMoreOptions"/>

		</drag-and-drop>
	
		<button-circle :path="folderLocation.path" :pathLtree="folderLocation.pathLtree" :space="space" @open-modal="openModalCreateFolder"/>

		<modal-create-folder v-if="stateModal.create_folder" :pathLtree="folderLocation.pathLtree" :space="space" @close-modal="closeModalCreateFolder" />
		<modal-edit-folder-or-file v-if="stateModal.edit_folder_or_file" :item="stateModal.item" @close-modal="closeModalEditFolderOrFile" />
		<modal-more-options v-if="stateModal.more_options" :item="stateModal.item" @close-modal="closeModalMoreOptions" @open-modal-edit-folder-or-file="openModalEditFolderOrFile"/>
	</div>
</template>

<script>
import DragAndDrop from './components/dragAndDrop.vue';
import headerComponent from "./ctnDirectory/header/header.vue";
import bodyComponent from "./ctnDirectory/body.vue";
import buttonCircle from "./components/buttonCircle.vue";

// modais
import modalCreateFolder from "./modais/create-new-folder.vue"
import modalEditFolderOrFile from "./modais/edit-folder-or-file-name.vue"
import modalMoreOptions from './modais/modal-more-options.vue';

// STORES
import { useRoute, useRouter } from 'vue-router';
import { computed, nextTick, onBeforeMount, reactive, watch } from 'vue';

import { useStore } from "./store"
import { storeToRefs } from 'pinia';

import { useStore  as useStoreUploader } from "@/store/uploader.js"
import { useStore as useStoreHistory } from "@/store/history"
import { useStore as useStoreUser } from "@/store/user"


export default {
	components: {
		DragAndDrop,
		headerComponent,
		bodyComponent,
		buttonCircle,
		// modals
		modalCreateFolder,
		modalEditFolderOrFile,
		modalMoreOptions
	},
	// Props oriundas do router
    props: {
        space: String,
    },
	setup(props){
		const $route = useRoute();
		const $router = useRouter();
        const history = useStoreHistory();
		const stateModal = reactive({ create_folder: false , edit_folder_or_file: false, more_options: false, item: {} })
		// stores
		const store = useStore();
		const storeUploader = useStoreUploader();
		const storeUser = useStoreUser();
		const query = reactive({ search: "", mode: "all", filter: "" })

		const { parentFolder, childrenFolder, favorites, isLoading, error } = storeToRefs(store)
		
		const folderLocation = computed(() => {
			return {
				path: parentFolder.value ? parentFolder.value.fullpath : "",
				pathLtree: parentFolder.value ? parentFolder.value.path_ltree : ""
			}
		})
		// 

		const preConfigUrl = computed(() => {
			const { path } = $route.query;
			let uriPath;
			switch(props.space){
				case "construction": uriPath = $route.params.constructionID; break
				case "user": uriPath = storeUser.data.id; break;
				case "company": uriPath = storeUser.data.company_id; break;
			}

			return {
				path: path || uriPath,
				space: props.space,
			}
		})

		// QUERY FILTERS
		watch(query, query => {
			$router.replace({ query })
		})

		// QUERY ROUTE
		watch(() => $route.query, () => nextTick(main) )
		// 
		onBeforeMount(() => {
			const routeQuery = $route.query
			Object.entries(routeQuery).forEach(([ key, value ]) => query[key] = value )
			main()
		})

		function main(){
			if(query.search)
				store.searchFolderAndFiles({ ...preConfigUrl.value, ...query })
			else
				store.fetchDirectory(preConfigUrl.value)
		}
		
		function enterFolder(path_ltree){
			$router.push({ 
				path: $route.path, 
				query: { path: path_ltree }
			})
		}

		function selectFile(file_id){
			$router.push({
				name:"viewer/viewer",
				params: { id: file_id },
				query: { previous: $route.fullPath }
			})
		}

		const folders = computed(() => {
			if(isLoading.value) return []

			const uploaders = storeUploader.queue.filter( item => {
				const hasItem = childrenFolder.value.find( folderOrfile => folderOrfile.id === item.id)

				if(!hasItem && item.reqHeaders.pathltree === folderLocation.value.pathLtree)
					return item
			})
			return childrenFolder.value.concat(uploaders)
        })

		// modal create new folder
		function openModalCreateFolder(){
			history.push({ name: "modal_cloud_create_folder", fn: closeModalCreateFolder })
			stateModal.create_folder = true
		}
		function closeModalCreateFolder(){
			stateModal.create_folder = false
			history.remove("modal_cloud_create_folder")
		}

		// modal edit folder or file 
		function openModalEditFolderOrFile(){
			history.push({ name: "modal_cloud_edit_folder_or_file", fn: closeModalEditFolderOrFile })
			stateModal.edit_folder_or_file = true
		}
		function closeModalEditFolderOrFile(){
			stateModal.edit_folder_or_file = false
			history.remove("modal_cloud_edit_folder_or_file")
		}

		// modal more options
		function openModalMoreOptions(item){
			history.push({ name: "modal_cloud_more_options", fn: closeModalMoreOptions });
			stateModal.item = item;
			stateModal.more_options = true;
		}
		function closeModalMoreOptions(){
			history.remove("modal_cloud_more_options")
			stateModal.more_options = false
			// stateModal.item = {};
		}

		return {
			query,
			stateModal,
			main,
			enterFolder,
			selectFile,
			parentFolder,
			folders,
			favorites,
			isLoading,
			error,
			folderLocation,
			// 
			openModalCreateFolder,
			closeModalCreateFolder,
			// 
			openModalEditFolderOrFile,
			closeModalEditFolderOrFile,
			// 
			openModalMoreOptions,
			closeModalMoreOptions
		}
	}
}
</script>