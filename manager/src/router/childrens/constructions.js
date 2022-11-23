export default [
	{
		path: "active",
		aliais: "",
		name: "constructions/active",
		component: () => import( /* webpackChunkName: "constructions" */ "@/views/constructions/subpages/active.vue"),
		meta: { index: 1 }
	},
	{
		path: "archived",
		name: "constructions/archived",
		component: () => import( /* webpackChunkName: "constructions" */ "@/views/constructions/subpages/archived.vue"),
		meta: { index: 2 }
	},
	{
		path: "/:catchAll(.*)",
		redirect: "/main/chart-accounts/revenues"
	}
]