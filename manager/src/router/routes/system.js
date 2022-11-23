const cloud = () => import( /* webpackChunkName: "cloud" */ "@/views/cloud")

export default [
	{
		path: "payments",
		name: "payments",
		component: () => import(/* webpackChunkName: "payments" */ "@/views/payments/index.vue"),
		meta: {
			titlePage: "Gescon - Pagamentos",
			titleView: "Pagamentos",
            moduleName: "show:system_payments",
		}
	},
	{
		path: 'configurations',
		name: 'configurations',
		component: () => import( /* webpackChunkName: "user-configurations" */ "@/views/configurations/index"),
		meta: {
			titlePage: "Gescon - Suas configuções",
			titleView: "Suas configurações",
		}
	},
	{
		path: 'user-cloud',
		name: 'user_cloud',
		component: cloud,
		meta:{
			titlePage: "Gescon - Seu espaço",
			titleView: "Seu espaço",
		},
		props: { space: "user" }
	},
	{
		path: 'company-cloud',
		name: 'company_cloud',
		component: cloud,
		meta:{
			titlePage: "Gescon - Espaço da construtora",
			titleView: "Espaço da construtora",
		},
		props: { space: "company" }
	},
]