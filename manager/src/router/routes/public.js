export default [
    {
		path: "/public/material-quotation/:id?",
		name: "public/material_quotation",
        component: () => import( /* webpackChunkName: "public" */ "@/views/public/materialQuotation/index.vue" ),
		meta: { titlePage: "Gescon - Cotação de materiais" }
	},
	{
		path: "/public/occurrence",
		name: "public/ocurrence",
        component: () => import( /* webpackChunkName: "public" */ "@/views/public/ocurrence/index.vue" ),
		meta: { titlePage: "Gescon - Ocorrência" }
	}
]