export default [
    {
        path: "home",
        name: "construction/home",
        component:  () => import ( /* webpackChunkName: "construction" */ "@/views/construction/home/index.vue"),
        meta: {
            titlePage: "Gescon - Home",
            titleView: "Home"
        }
    },
    {
        path: "gantt-chart",
        name: "construction/gatt_chart",
        component:  () => import ( /* webpackChunkName: "construction" */ "@/views/construction/gantt-chart/index.vue"),
        meta: {
            titlePage: "Gescon",
            titleView: "Grafico"
        }
    },
    {
        path: "visits",
        name: "construction/visits",
        component:  () => import ( /* webpackChunkName: "construction" */ "@/views/construction/visits/index.vue"),
        meta: {
            titlePage: "Gescon - Visitas",
            titleView: "Visitas"
        }
    },
    {
        path: "workforce",
        name: "construction/workforce",
        component:  () => import ( /* webpackChunkName: "construction" */ "@/views/construction/workforce/index.vue"),
        meta: {
            titlePage: "Gescon - Efetivo",
            titleView: "Efetivo"
        }
    },
    {
        path: "occurrences",
        name: "construction/occurrences",
        component:  () => import ( /* webpackChunkName: "construction" */ "@/views/construction/occurrences/index.vue"),
        meta: {
            titlePage: "Gescon",
            titleView: "Ocorrências",
            title: "Ocorrências"
        }
    },
    {
        path: "services",
        name: "construction/services",
        component:  () => import ( /* webpackChunkName: "construction" */ "@/views/construction/services/index.vue"),
        meta: {
            titlePage: "Gescon - Serviços",
            titleView: "Serviços"
        },
        children: [
            {
                path: "progress",
                name: "constuction/services/progress",
                component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/services/inProgress/index.vue"),
                meta: { index: 1 }
            },
            {
                path: "service-sheet",
                name: "constuction/services/services",
                component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/services/services-sheet/index.vue"),
                meta: { index: 2 }
            },
            {
                path: "unconformities",
                name: "constuction/services/unconformitites",
                component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/services/unconformitites/index.vue"),
                meta: { index: 3 }
            }
        ]
    },
    
    {
        path: "materials",
        name: "construction/materiais",
        component:  () => import ( /* webpackChunkName: "construction" */ "@/views/construction/materials/index.vue"),
        meta: {
            titlePage: "Gescon - Materiais",
            titleView: "Materiais"
        },
        children: [
            {
                path: "orders",
                component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/materials/materialOrders/index.vue"),
                name: "construction/materials/orders",
                meta: { index: 1 }
            }
        ]
    },
    {
        path: "cloud",
        name: "construction/cloud",
        component: () => import( /* webpackChunkName: "cloud" */ "@/views/cloud"),
        meta: {
            titlePage: "Nuvem da obra",
            titleView: "Nuvem da obra"
        },
		props: { space: "construction" }
    },
    {
        path: "members",
        name: "construction/members",
        component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/members/index.vue"),
        meta: {
            titlePage: "Gescon",
            titleView: "Membros"
        }
    },
    {
        path: "configurations",
        name: "construction/configurations",
        component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/configurations/index.vue"),
        meta: {
            titlePage: "Gescon",
            titleView: "Configurações"
        }
    },
]