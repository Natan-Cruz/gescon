export default [
    // ASSETS
    {
        path: "/shows/contracts/:id",
        name: "registrations/show_contract",
        component: () => import( /* webpackChunkName: "shows" */ "@/views/registrations/shows/contracts/index.vue" ),
        meta: {
            titlePage: "Gescon",
            moduleName: "show:contracts",
        }
    },

    // FINANCIAL
    {
        path: "/shows/accounting/:id?",
        name: "registrations/show_financial",
        component: () => import( /* webpackChunkName: "shows" */ "@/views/registrations/shows/financial/index.vue" ),
        meta: {
            titlePage: "Financeiro",
            moduleName: [
                "show:bills_to_pay",
                "show:bills_to_receive",
                "show:paid_bills",
                "show:accounts_received",
            ],
        }
    },
    
    // MATERIAL QUOTATIONS
    {
        path: "/shows/material-quotations/:id",
        name: "registrations/material_quotation_show",
        component: () => import( /* webpackChunkName: "shows" */ "../../views/registrations/shows/materialQuotation/index.vue" ),
        meta: {
            titlePage: "Gescon",
            moduleName: "show:material_quotations"
        }
    },
    {
        path: "/shows_2/material-quotations/:id",
        name: "registrations/material_quotation_show_2",
        component: () => import( /* webpackChunkName: "shows" */ "../../views/registrations/shows/materialQuotation_2/index.vue" ),
        meta: {
            titlePage: "Gescon",
            moduleName: "show:material_quotations"
        }
    },
    {
        path: "/shows_3/material-quotations/:id",
        name: "registrations/material_quotation_show_3",
        component: () => import( /* webpackChunkName: "shows" */ "../../views/registrations/shows/materialQuotation_3/index.vue" ),
        meta: {
            titlePage: "Gescon",
            moduleName: "show:material_quotations"
        }
    },
]