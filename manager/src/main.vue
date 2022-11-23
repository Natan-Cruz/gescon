<template>
	<div>

		<loading-or-error :isLoading="isLoading" :width="60" :error="error" @event-retry="fetchInitial"></loading-or-error>

		<template v-if="(!isLoading && !error)">
			<grid-system-layout>
				<template v-slot:header>
					<custom-header :title="$route.meta.titleView || '' " />
				</template>

				<template v-slot:menu-left>
					<menu-left-component />
				</template>

				<template v-slot:content>
					<router-view></router-view>
				</template>
			</grid-system-layout>
		</template>
	</div>
</template>

<script>

import gridSystemLayout from "./mainComponents/gridSystemLayout.vue"
import menuLeftComponent from "./mainComponents/menuLeft/index.vue"
import customHeader from "./mainComponents/header/head.vue";
import { useStore } from "./store/accessControl"
import { storeToRefs } from 'pinia';

export default{
	name:"app",
	components:{
		gridSystemLayout,
        menuLeftComponent,
		customHeader
	},
	setup(){
		const store = useStore()
		const { isLoading, error } = storeToRefs(store)

		async function fetchInitial(){
			await store.fetchInitial()
		}

		return {
			isLoading, 
			error,
			fetchInitial
		}
	}
}
</script>