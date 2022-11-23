export default [
    {
        path: "tree-structure",
        name: "tree_structure",
        component: () => import( /* webpackChunkName: "registrations" */ "../../views/treeStructure/index.vue" ),
        meta: {
            titlePage: "Gescon - Centro de custos",
            titleView: "Centro de custos",
            moduleName: "show:cost_center",
        }
    },
     // chart_accounts
    {
        path: "chart-accounts",
        name: "registrations/chart_accounts",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/page/chart-accounts/index.vue" ),
        meta: {
            titlePage: "Gescon - Plano de contas",
            titleView: "Plano de contas",
            moduleName: "show:chart_accounts",
        },
        children: [
            {
                path: "revenues",
                name: "tree_structure/revenues",
                component: () => import ( /* webpackChunkName: "registrations" */ "@/views/registrations/page/chart-accounts/components/subpages.vue"),
                meta: {
                    index: 1,
                    account_type: "revenue"
                }
            },
            {
                path: "expenses",
                name: "tree_structure/expenses",
                component: () => import ( /* webpackChunkName: "registrations" */ "@/views/registrations/page/chart-accounts/components/subpages.vue"),
                meta: {
                    index: 2,
                    account_type: "expense"
                }
            },
            {
                path: "/:catchAll(.*)",
                redirect: "/main/chart-accounts/revenues"
            }
        ]
    },
]