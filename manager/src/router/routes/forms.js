export default [
    // CONSTRUCTIONS
    {
        path: "/forms/occurrences/:id?",
        name: "construction/form_occurrence",
        component:  () => import ( /* webpackChunkName: "construction" */ "@/views/registrations/forms/occurrence/index.vue"),
        meta: {
            titlePage: "Gescon - Ocorrências"
        }
    },
    {
        path: "/forms/diary/:id",
        name: "construction/form_diary",
        component: () => import ( /* webpackChunkName: "construction" */ "../../views/registrations/forms/reports/index.vue"),
        meta: {
            titlePage: "Gescon",
            titleView: "Diário de obras"
        },
        children: [
            {
                path: "anotations",
                component: () => import ( /* webpackChunkName: "construction" */ "../../views/registrations/forms/reports/subpages/anotations/anotations.vue"),
                name: "construction/diary/anotations",
                meta: { index: 1 }
            },
            {
                path: "labors",
                component: () => import ( /* webpackChunkName: "construction" */ "../../views/registrations/forms/reports/subpages/labors/labors.vue"),
                name: "construction/diary/labors",
                meta: { index: 2 }
            }
        ]
    },
    {
        path: "/forms/service/:id",
        name: "constuction/service",
        component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/services/service/index.vue"),
        children: [
            {
                path: "items",
                name: "constuction/service/items",
                component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/services/service/subpages/items.vue"),
            },
            {
                path: "production-rate/:rate_id?",
                name: "constuction/service/production_rate",
                component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/services/service/subpages/productionRate.vue"),
            },
            {
                path: "details",
                name: "constuction/service/details",
                component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/services/service/subpages/details.vue"),
            },
            {
                path: "check-item/:check_item_id",
                name: "constuction/service/check_item",
                component: () => import ( /* webpackChunkName: "construction" */ "@/views/construction/services/service/subpages/checkItem.vue"),
            },
        ]
    },
    {
        path: "/forms/receive-material-order/:id",
        name: "construction/receive_material_order",
        component: () => import( /* webpackChunkName: "construction" */ "@/views/construction/materials/receiveMaterialOrder/index.vue" ),
        meta: {
            titlePage: "Gescon - Receber material"
        }
    },

    // ENTITY
    {
        path: "/forms/entity/:id?",
        name: "registrations/form_entity",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/forms/entity" ),
        meta: {
            titlePage: "Gescon",
            moduleName: [
                "show:clients",
                "create:clients",
                "edit:clients",
                "delete:clients",
                // 
                "show:service_providers",
                "create:service_providers",
                "edit:service_providers",
                "delete:service_providers",
                // 
                "show:materil_providers",
                "create:materil_providers",
                "edit:materil_providers",
                "delete:materil_providers",
            ],
        }
    },
    // CONTRACTS
    {
        path: "/forms/contracts/:id?",
        name: "registrations/form_contract",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/forms/contracts" ),
        meta: {
            titlePage: "Gescon",
            moduleName: [
                "show:contracts",
                "create:contracts",
                "edit:contracts",
                "delete:contracts",
            ],
        }
    },
    // EMPLOYEES
    {
        path: "/forms/employees/:id?",
        name: "registrations/form_employee",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/forms/employee/index.vue" ),
        meta: {
            titlePage: "Gescon - Funcionários ou colaboradores",
            moduleName: [
                "show:employees",
                "create:employees",
                "edit:employees",
                "delete:employees",
            ],
        }
    },

    // EQUIPEMENTS 
    {
        path: "/forms/equipments/:id?",
        name: "registrations/form_equipment",
        component: () => import( /* webpackChunkName: "registrations" */ "../../views/registrations/forms/equipment/index.vue" ),
        meta: { titlePage: "Gescon - Equipamento", }
    },
    {
        path: "/forms/equipments/:equipment_id/maintenance/:id?",
        name: "registrations/form_equipment_maintenance",
        component: () => import( /* webpackChunkName: "registrations" */ "../../views/registrations/forms/equipmentMaintenance/index.vue" ),
        meta: { titlePage: "Gescon - Equipamento manutenção" }
    },

    // MATERIAL
    {
        path: "/forms/materials/:id?",
        name: "registrations/material_form",
        component: () => import( /* webpackChunkName: "registrations" */ "../../views/registrations/forms/material/index.vue" ),
        meta: {
            titlePage: "Gescon",
            moduleName: [
                "show:materials",
                "create:materials",
                "edit:materials",
                "delete:materials",
            ],
        }
    },

    // MATERIAL QUOTATION
    {
        path: "/forms/material-quotations/:id?",
        name: "registrations/material_quotation_form",
        component: () => import( /* webpackChunkName: "registrations" */ "../../views/registrations/forms/materialQuotation/index.vue" ),
        meta: {
            titlePage: "Gescon",
            moduleName: [
                "show:material_quotations",
                "create:material_quotations",
                "edit:material_quotations",
                "delete:material_quotations",
            ],
        }
    },

    // MATERIAL ORDERS
    {
        path: "/forms/material-orders/:id?",
        name: "registrations/material_orders_form",
        component: () => import( /* webpackChunkName: "registrations" */ "../../views/registrations/forms/materialOrder/index.vue" ),
        meta: {
            titlePage: "Gescon",
            moduleName: [
                "show:material_orders",
                "create:material_orders",
                "edit:material_orders",
                "delete:material_orders",
            ],
        }
    },

    // VISITS
    {
        path: "/forms/visits/:id?",
        name: "registrations/form_visit",
        component: () => import( /* webpackChunkName: "registrations" */ "../../views/registrations/forms/visit/index.vue" ),
        meta: {
            titlePage: "Gescon - Visita",
            moduleName: [
                "show:visits",
                "create:visits",
                "edit:visits",
                "delete:visits",
            ],
        }
    },

    // SERVICES
    {
        path: "/forms/services-sheet/:id?",
        name: "registrations/form_service_sheet",
        component: () => import( /* webpackChunkName: "registrations" */ "../../views/registrations/forms/service" ),
        meta: { titlePage: "Gescon - Ficha de verificação de serviço" }
    },
    {
        path: "/forms/services-sheet/:service_id?/check-item/:id?",
        name: "registrations/form_service_sheet_check_item",
        component: () => import( /* webpackChunkName: "registrations" */ "../../views/registrations/forms/serviceCheckItem" ),
        meta: { titlePage: "Gescon - Ficha de verificação de serviço" }
    },

    // ASSETS
    {
        path: "/forms/assets/:id?",
        name: "registrations/form_asset",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/forms/asset/index.vue" ),
        meta: {
            titlePage: "Gescon - Ativo",
            moduleName: [
                "show:assets",
                "create:assets",
                "edit:assets",
                "delete:assets",
            ],
        }
    },

    // FINANCIAL - CREATE ACCOUNTS
    {
        path: "/forms/accounting/:id?",
        name: "registrations/form_financial",
        component: () => import( /* webpackChunkName: "financial" */ "@/views/registrations/forms/financial/index.vue" ),
        meta: {
            titlePage: "Financeiro",
            moduleName: [
                // create
                "create:bills_to_pay",
                "create:bills_to_receive",
                "create:paid_bills",
                "create:accounts_received",
                // edit
                "edit:bills_to_pay",
                "edit:bills_to_receive",
                "edit:paid_bills",
                "edit:accounts_received",
                // delete
                "delete:bills_to_pay",
                "delete:bills_to_receive",
                "delete:paid_bills",
                "delete:accounts_received",
            ],
        }
    },

    // PAYROLL
    {
        path: "/forms/payroll/:id?",
        name: "registrations/form_payroll",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/forms/payroll/index.vue" ),
        meta: { titlePage: "Folha de pagamentos" },
        children: [
            {
                path: "step_01",
                name: "registrations/form_payroll/step_01",
                component: () => import("../../views/registrations/forms/payroll/step_01/idx.vue"),
                meta: { index: 1 }
            },
            {
                path: "step_02",
                name: "registrations/form_payroll/step_02",
                component: () => import("../../views/registrations/forms/payroll/step_02/idx.vue"),
                meta: { index: 2 }
            },
            {
                path: "step_03",
                name: "registrations/form_payroll/step_03",
                component: () => import("../../views/registrations/forms/payroll/step_03/idx.vue"),
                meta: { index: 3 }
            }
        ]
    },
    // BANKS ACCOUNTS
    {
        path: "/forms/bank-accounts/:id?",
        name: "registrations/form_bank_account",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/forms/bankAccounts/index.vue" ),
        meta: {
            titlePage: "Conta Bancária",
            moduleName: [
                "show:bank_accounts",
                "create:bank_accounts",
                "edit:bank_accounts",
                "delete:bank_accounts",
            ],
        }
    },
    
    // BANKS CARDS
    {
        path: "/forms/credit-cards/:id?",
        name: "registrations/form_credit_cards",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/forms/bankCreditCards/index.vue" ),
        meta: {
            titlePage: "Cartão de crédito ou débito",
            moduleName: [
                "show:credit_cards",
                "create:credit_cards",
                "edit:credit_cards",
                "delete:credit_cards",
            ],
        }
    },

    // BANK TRANFERS
    {
        path: "/forms/bank-transfers/:id?",
        name: "registrations/form_bank_transfer",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/forms/bankTransfers/index.vue" ),
        meta: {
            titlePage: "Transferência",
            moduleName: [
                "show:bank_transfers",
                "create:bank_transfers",
                "edit:bank_transfers",
                "delete:bank_transfers",
            ],
        }
    },

    // BANK RECONCILIATIONS
    {
        path: "/forms/bank-reconciliations/:id?",
        name: "registrations/form_bank_reconciliation",
        component: () => import( /* webpackChunkName: "registrations" */ "@/views/registrations/forms/bankReconciliations/index.vue" ),
        meta: {
            titlePage: "Reconciliaçao bancária",
            moduleName: [
                "show:bank_reconciliations",
                "create:bank_reconciliations",
                "edit:bank_reconciliations",
                "delete:bank_reconciliations",
            ],
        }
    },

    // SUB-ACCOUNTS 
    {
		path: "/forms/sub-accounts/:id?",
		name: "registrations/form_sub_accounts",
        component: () => import( /* webpackChunkName: "sub-account" */ "@/views/registrations/forms/subAccounts/index.vue" ),
		meta: {
			titlePage: "Gescon - Sub-conta"
		}
	},

    // SUB-ACCOUNTS-ROLES
	{
		path: "/forms/sub-accounts/roles/:id?",
		name: "registrations/form_role",
        component: () => import( /* webpackChunkName: "sub-account" */ "@/views/registrations/forms/role/index.vue" ),
		meta: {
			titlePage: "Gescon - Roles"
		}
	},
]