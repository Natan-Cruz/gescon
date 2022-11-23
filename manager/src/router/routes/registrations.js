import commonPage from  "@/views/registrations/page/common/index.vue";
import dayjs from "dayjs"

const formatDate = date => date ? new Date(date).toLocaleDateString() :  "--/--/----" 
const replaceTypes = string => string ? string.replace("inflow", "Entrada").replace("outflow", "Saida") : ""
const wasReconciled = reconciled => reconciled ? "OK" : "Pendente"
const formatStatus = status => status ? "Entregue" : "A entregar"

function formatCurrency(value){
    if(!value) return "R$---,--"
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
    return formatter.format(value);
}


export default [
    // CLIENTS
    {
        path: "clients",
        name: "registrations/clients",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Clientes",
            titleView: "Clientes",
            moduleName: "show:clients",
        },
        props: {
            url: "/registrations/clients",
            cols: ['Nome', "email", "Tel","Tel 2"],
            cells: ["name", "email", "phone", "phone_2"],
            formName: "registrations/form_entity",
            permissionName: "create:clients",
            routeQuery: { role: "client" }
        }
    },
    // SERVICE PROVIDERS
    {
        path: "service-providers",
        name: "registrations/service_providers",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Fornecedores de serviços",
            titleView: "Fornecedores de serviços",
            moduleName: "show:service_providers",
        },
        props: {
            url: "/registrations/service-provider",
            cols: ['Nome', "email", "Tel","Tel 2"],
            cells: ["name", "email", "phone", "phone_2"],
            formName: "registrations/form_entity",
            permissionName: "create:service_providers",
            routeQuery: { role: "service_provider" }
        }
    },
    // MATERIAL PROVIDERS
    {
        path: "material-providers",
        name: "registrations/material_providers",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Fornecedores de materiais",
            titleView: "Fornecedores de materiais",
            moduleName: "show:material_providers",
        },
        props: {
            url: "/registrations/material-provider",
            cols: ['Nome', "email", "Tel","Tel 2"],
            cells: ["name", "email", "phone", "phone_2"],
            formName: "registrations/form_entity",
            permissionName: "create:material_providers",
            routeQuery: { role: "material_provider" }
        }
    },
    // CONTRACTS
    {
        path: "contracts",
        name: "registrations/contracts",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Contratos",
            titleView: "Contratos",
            moduleName: "show:contracts"
        },
        props: {
            url: "/registrations/contracts",
            cols: ["Cliente", "Ativo", "Data"],
            cells: ["entity_name", "asset_name", [ "created_at", formatDate ]],
            formName: "registrations/form_contract",
            showName: "registrations/show_contract",
            permissionName: "create:contracts",
            filterComponentName: "contracts"
        }
    },
    // EMPLOYEES
    {
        path: "employees",
        name: "registrations/employees",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Funcionários e colaboradores",
            titleView: " Funcionários e colaboradores",
            moduleName: "show:employees",
        },
        props: {
            url: "/registrations/employees",
            cols: ['Nome completo'],
            cells: ["fullname"],
            formName: "registrations/form_employee",
            permissionName: "create:employees",
            filterComponentName: "employees"
        }
    },

    // EQUIPMENTS
    {
        path: "equipments",
        name: "registrations/equipments",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Equipamentos e ferramentas",
            titleView: "Equipamentos e ferramentas",
            moduleName: "show:equipments",
        },
        props: {
            url: "/registrations/equipments",
            cols: ['Nome', "Origem", "Status", "Obra"],
            cells: ["name", ["origin",  str => str === "own" ? "Próprio" : "Alugado"], "status", "construction_name"],
            formName: "registrations/form_equipment",
            permissionName: "create:equipments",
            filterComponentName: "equipments",
            group: true
        }
    },
    
    // MATERIALS
    {
        path: "materials",
        name: "registrations/materials",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Materiais e produtos",
            titleView: "Materiais e produtos",
            moduleName: "show:materials"
        },
        props: {
            url: "/materials/m",
            cols: ['Nome'],
            cells: ["name"],
            formName: "registrations/material_form",
            permissionName: "create:materials"
        }
    },

    // MATERIAL QUOTATIONS
    {
        path: "material-quotations",
        name: "registrations/material_quotation",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Cotações de materias",
            titleView: "Cotações de materias",
            moduleName: "show:material_quotations",
        },
        props: {
            url: "/materials/material-quotations",
            cols: ['Código', "Fornecedor", "Data"],
            cells: [["number", n => "#" + n], "provider_name", ["created_at", formatDate]],
            formName: "registrations/material_quotation_form",
            showName: "registrations/material_quotation_show",
            permissionName: "create:material_quotations"
        }
    },
     
    // MATERIAL ORDERS
    {
        path: "material-orders",
        name: "registrations/material_orders",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Pedidos",
            titleView: "Pedidos",
            moduleName: "show:material_orders"
        },
        props: {
            url: "/materials/material-orders",
            defaultUrlQuery: { status: "bought" },
            cols: ["Data de compra", "Fornecedor", "Obra", "Status"],
            cells: [["purchase_date", formatDate ], "entity_name", "construction_name", ["delivered_in", formatStatus ]],
            formName: "registrations/material_orders_form",
            filterComponentName: "materialOrders",
            permissionName: "create:material_orders"
        }
    },

    // VISITS
    {
        path: "visits",
        name: "registrations/visits",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Visitas",
            titleView: "Visitas",
            moduleName: "show:visits"
        },
        props: {
            url: "/registrations/visits",
            cols: ['Nome', "Empresa", "Motivos", "Obra", "Data", "Período"],
            cells: ["name", "company", "reasons", "construction_name", "date", "period"],
            formName: "registrations/form_visit",
            filterComponentName: "visits",
            permissionName: "create:visits"
        }
    },

    // SERVICES
    {
        path: "services-sheet",
        name: "registrations/services_sheet",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Ficha de verificação de serviços",
            titleView: "Ficha de verificação de serviços",
            moduleName: "show:services"
        }
    },
    
    // ASSETS
    {
        path: "assets",
        name: "registrations/assets",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Ativos",
            titleView: "Ativos",
            moduleName: "show:assets"
        },
        props: {
            url: "/registrations/assets",
            cols: ["Nome", "Empreendimento"],
            cells: ["name", "project_name"],
            formName: "registrations/form_asset",
            permissionName: "create:assets",
            filterComponentName: "assets"
        }
    },

    // PAYROLL
    {
        path: "payroll",
        name: "registrations/payroll",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Folhas de pagamentos",
            titleView: "Folhas de pagamentos",
            moduleName: "show:payroll"
        },
        props: {
            url: "/financial/payroll",
            cols: ["Data inicio", "Data fim", "Realizado em" ,"Montante"],
            cells: [["start_date", formatDate], ["end_date", formatDate], ["created_at", formatDate], ["amount", formatCurrency]],
            formName: "registrations/form_payroll/step_01",
            permissionName: "create:payroll"
        }
    },

    // BANK ACCOUNTS
    {
        path: "bank-accounts",
        name: "registrations/bank_accounts",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Contas bancárias",
            titleView: "Contas bancárias",
            moduleName: "show:bank_accounts"
        },
        props: {
            url: "/financial/bank/accounts?type=bank_accounts",
            cols: ['Nome'],
            cells: ["name"],
            formName: "registrations/form_bank_account",
            permissionName: "create:bank_accounts"
        }
    },

    // CREDIT CARDS
    {
        path: "credit-cards",
        name: "registrations/credit_cards",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Cartões de Créditos ou Débitos",
            titleView: "Cartões de Créditos ou Débitos",
            moduleName: "show:credit_cards"
        },
        props: {
            url: "/financial/bank/accounts?type=credit_cards",
            cols: ['Nome'],
            cells: ["name"],
            formName: "registrations/form_credit_cards",
            permissionName: "create:credit_cards"
        }
    },

    // BANK TRANSFERS
    {
        path: "bank-transfers",
        name: "registrations/bank_transfers",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Transferências bancárias",
            titleView: "Transferências bancárias",
            moduleName: "show:bank_transfers"
        },
        props: {
            url: "/financial/bank/transfers",
            cols: ['Data', "Da conta", "Para conta", "Montante"],
            cells: [["date", formatDate], "fromName", "toName", ["amount", formatCurrency] ],
            formName: "registrations/form_bank_transfer",
            permissionName: "create:bank_transfers"
        }
    },

    // BANK TRANSACTIONS
    {
        path: "bank-transactions",
        name: "registrations/bank_transactions",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Transações bancárias",
            titleView: "Transações bancárias",
            moduleName: "show:bank_transactions"
        },
        props: {
            url: "/financial/bank/transactions?paid=1",
            cols: ['Data', "Conta", "Tipo", "Montante"],
            cells: [["created_at", formatDate], "account_name", ["type", replaceTypes],["amount", formatCurrency]],
            formName: "",
            permissionName: ""
        }
    },

     
    // BANK RECONCILIATIONS
    {
        path: "bank-reconciliations",
        name: "registrations/bank_reconciliations",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Reconciliações bancárias",
            titleView: "Reconciliações bancárias",
            moduleName: "show:bank_reconciliations"
        },
        props: {
            url: "/financial/bank/reconciliations",
            cols: ['Data', "Conta", "Periodo", "Fechamento do balanco", "status"],
            cells: [["created_at", formatDate], "account_name", "period", ["closing_balance", formatCurrency], ["status", wasReconciled]],
            // formName: "registrations/form_bank_reconciliation"
            formName: "",
            permissionName: ""
        }
    },

	// LOGS 
	{
        path: "logs",
        name: "registrations/logs",
        component: commonPage,
        meta: {
            titlePage: "Gescon - Logs",
            titleView: "Logs",
            moduleName: "show:system_logs",
        },
        props: {
            url: "/payments/logs",
            cols: ["Usuário", "Hora e data", "Evento", ],
            cells: ["user_name", [ "created_at", created_at => dayjs(created_at).format("hh:mm - DD/MM/YY") ], "message"],
			formName: "",
			filterComponentName: "logs"
        }
    },
]