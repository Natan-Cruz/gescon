export default [
  {
    name: "Cadastros",
    feature: "registrations",
    actions: ["edit"],
    items: [
      { name: "Clientes", feature: "clients" },
      { name: "Fornecedores de serviços", feature: "service_providers" },
      { name: "Fornecedores de materiais", feature: "material_providers" },
      { name: "Funcionários", feature: "employees" },
      // { name: "Equipamentos e ferramentas", feature: "equipments" },
      { name: "Visitas", feature: "visits" },
      { name: "Serviços", feature: "services" },
      { name: "Centro de custos", feature: "cost_center" },
      { name: "Plano de contas", feature: "chart_accounts" }
    ]
  },
  {
    name: "Materias e pedidos",
    feature: "group_materials",
    items: [
      { name: "Produtos e materiais", feature: "materials" },
      { name: "Cotações", feature: "material_quotations" },
      { name: "Pedidos", feature: "material_orders" }
    ]
  },
  {
    name: "Pastas e arquivos",
    feature: "group_folder_and_files",
    items: [
      { name: "Espaço da construtora", feature: "company_cloud" },
      { name: "Espaço do usuário", feature: "user_cloud" },
    ]
  },
  {
    name: "Financeiro",
    feature: "financial",
    items: [
      // { name: "Fluxo de caixa", feature: "cash_flow" },
      { name: "Contas a Pagar", feature: "bills_to_pay" },
      { name: "Contas a Receber", feature: "bills_to_receive" },
      { name: "Contas Pagas", feature: "paid_bills" },
      { name: "Contas Recebidas", feature: "accounts_received" },
      // { name: "Folhas de pagamentos", feature: "payroll" },
    ]
  },
  {
    name: "Vendas",
    feature: "sales",
    items: [
      { name: "Ativos", feature: "assets" },
      { name: "Contratos", feature: "contracts" }
    ]
  },
  {
    name: "Bancos",
    feature: "banks_financial",
    items: [
      { name: "Contas bancárias", feature: "bank_accounts" },
      { name: "Cartões de créditos", feature: "credit_cards" },
      { name: "Transferências bancárias", feature: "bank_transfers", },
      { name: "Transações", feature: "bank_transactions", hide: ["edit", "create", "delete"] },
      { name: "Reconciliações", feature: "bank_reconciliations", hide: ["edit", "create", "delete"] }
    ]
  },
  {
    name: "Sistema",
    feature: "system",
    hide: ["edit", "create", "delete"],
    items: [
      { name: "Contas", feature: "sub_accounts" },
      { name: "Pagamentos", feature: "system_payments", hide: ["edit", "create", "delete"] },
      { name: "Logs", feature: "system_logs", hide: ["edit", "create", "delete"] }
    ]
  }
]