
const financialPage = () => import( /* webpackChunkName: "financial" */ "../../views/registrations/page/accounting/index.vue" )

export default [ 
    // {
    //     path: "home",
    //     name: "financial/home",
    //     component: () => import( /* webpackChunkName: "financial" */ "@/views/financial/home/index.vue" ),
    //     meta: {
    //         titlePage: "Gescon - Fluxo de caixa",
    //         titleView: "Fluxo de caixa",
    //         moduleName: "show:cash_flow",
    //     }
    // },
    // Contas a pagar
    {
        path: "accounting/bills_to_pay",
        name: "financial/accounting/bills_to_pay",
        component: financialPage,
        meta: {
            titlePage: "Gescon - Contas a pagar",
            titleView: "Contas a pagar",
            moduleName: "show:bills_to_pay",
        },
        props: {
            account_type: "bills_to_pay",
            permissionName: "create:bills_to_pay"
        }
    },
    // Contas pagas
    {
        path: "accounting/paid_bills",
        name: "financial/accounting/paid_bills",
        component: financialPage,
        meta: {
            titlePage: "Gescon - Contas a pagas",
            titleView: "Contas pagas",
            moduleName: "show:paid_bills",
        },
        props: {
            account_type: "paid_bills",
            permissionName: "create:paid_bills"
        }
    },
    // Contas a receber
    {
        path: "accounting/bills_to_receive",
        name: "financial/accounting/bills_to_receive",
        component: financialPage,
        meta: {
            titlePage: "Gescon - Contas a receber",
            titleView: "Contas a receber",
            moduleName: "show:bills_to_receive",
        },
        props: {
            account_type: "bills_to_receive",
            permissionName: "create:bills_to_receive"
        }
    },
    // Contas recebidas
    {
        path: "accounting/accounts_received",
        name: "financial/accounting/accounts_received",
        component: financialPage,
        meta: {
            titlePage: "Gescon - Contas recebidas",
            titleView: "Contas recebidas",
            moduleName: "show:accounts_received",
        },
        props: {
            account_type: "accounts_received",
            permissionName: "create:accounts_received"
        }
    }
]