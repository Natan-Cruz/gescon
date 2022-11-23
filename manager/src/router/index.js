import { createRouter, createWebHistory } from 'vue-router'

// main
import constructionsChildren from './childrens/constructions';
import constructionChildren from "./childrens/construction"
import financialChildren from "./childrens/financial.js"
import subAccountsChildren from "./childrens/subAccounts"
import system from "./routes/system.js"

import registrations from './routes/registrations'

// children
import viewerChildren from "./childrens/viewer"
import authChildren from "./childrens/auth"

import publicPages from "./routes/public.js"

import forms from "./routes/forms"
import shows from './routes/shows';
import others from "./routes/treeStructure"

const routes = [
	{
		path: "/main",
		name: "page_main",
		component: () => import("../main.vue"),
		meta: { requiresAuth: true },
		children: [
			{
				path: 'constructions',
				name: 'constructions',
				component: () => import( /* webpackChunkName: "constructions" */ '@/views/constructions/index.vue'),
				meta:{
					titlePage: "Gescon - Obras",
					titleView: "Obras"
				},
				children: constructionsChildren
			},
			{
				path: 'constructions/c/:constructionID',
				name: 'construction',
				component: () => import( /* webpackChunkName: "construction" */ "@/views/construction/index.vue"),
				children: constructionChildren
			},
			{
				path: "financial",
				name: "financial",
				component: () => import( /* webpackChunkName: "financial" */ "@/views/financial/index.vue"),
				children: financialChildren
			},
			{
				path: "sub-accounts",
				name: "sub_accounts",
				component: () => import( /* webpackChunkName: "sub-account" */ "@/views/subAccounts/index.vue"),
				meta: {
					titleView: "Contas de usuários",
					titlePage: "Gescon - Contas de usuários",
					moduleName: "show:sub_accounts",
				},
				children: subAccountsChildren
			},
			...registrations,
			...others,
			...system
		]
	},
	...forms,
	...shows,
	{
		path: '/auth',
		name: 'user',
		component: () => import( /* webpackChunkName: "user-auth" */ "@/views/userAuth/index.vue"),
		meta: { requiresNotAuth: true },
		children: authChildren
	},
	{
		path: "/file-viewer/:id",
		name: "fileViewer",
		component: () => import( /* webpackChunkName: "file-viewer" */ "@/views/fileViewer/index.vue" ),
		children: viewerChildren
	},
	...publicPages,
	{
		path: "/router-error",
		name: "router_error",
		component: () => import("../views/utils/ErrorComponent.vue")
	},
	{ path: "/", redirect: "/main/constructions/active" },
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router