<template>
    <div class="group-pages" :style="!isExpanded && 'height: calc(100% - 67px);'">

        <template v-if="preview_home">
            <ul>

                <item-link  title="Obras e projetos" path="/main/constructions/active" @c-click="$emit('event-navigate-to', $event)" :indexPath="1">
                    <template v-slot:img>
                        <img src="../../../assets/icons/icon-constructions.png" alt="">
                    </template>
                </item-link>

                
                <template v-for="({ group_name, links }, i) in menu" :key="i" >
                    <expandable-content v-can-group="links" :title="group_name" :defaultOpen="true" >
                        <template v-for="(link, i) in links" :key="i">
                            <item-link v-can="link.module_name" :title="link.title" :path="link.path" :indexPath="link.indexPath" @c-click="$emit('event-navigate-to', $event)">
                                <template v-slot:img>
                                    <img :src="link.src" alt="">
                                </template>
                                <template v-slot:btn>
                                    <button class="button-shortcut" v-if="link.formPage" v-can="link.module_name_add" @click="$emit('event-navigate-to', link.formPage)">+</button>
                                </template>
                            </item-link>
                        </template>
                    </expandable-content>
                </template>
            </ul>
        </template>

        <template v-if="preview_construction">
            <ul>
                <item-back-navigation path="/main/constructions/active" @click="$emit('event-to-back', $event)" />

                <template v-for="(link, i) in linksConstruction" :key="i">
                    <item-link v-can-construction="{ construction_id: $route.params.constructionID, module_name: link.module_name, default_module: link.default_module }" :title="link.title" :path="link.path" :indexPath="link.indexPath" @c-click="$emit('event-navigate-to', $event)" >
                        <template v-slot:img>
                            <img :src="link.src" alt="">
                        </template>
                    </item-link>
                </template>
            </ul>
        </template>
    </div>
</template>

<script>
import itemLink from "../components/itemLink";
import expandableContent from "../components/expandableContent.vue"
import ItemBackNavigation from '../components/itemBackNavigation.vue';
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';

export default {
    components: { itemLink, ItemBackNavigation, expandableContent },
    emits: [ "event-navigate-to", "event-to-back" ],
    props: {
        isExpanded: Boolean,
        preview_construction: Boolean,
        preview_home: Boolean
    },
    setup(){
        const $route = useRoute();
        let sort = localStorage.getItem("menu_left_order")
        if(sort) 
            sort = JSON.parse(sort) 
        else
            sort = []

        const menu = [
            {
                group_name: "Cadastros",
                key: "group_registrations",
                links: [
                    linkRegs("Clientes", "clients", "/forms/entity?previous=/main/clients&role=client", "rating.png", { module_name: "show:clients", module_name_add:"create:clients" }),
                    linkRegs("Fornecedores de serviços", "service-providers", "/forms/entity?previous=/main/service-providers&role=service_provider", "target.png", { module_name: "show:service_providers", module_name_add:"create:service_providers" }),
                    linkRegs("Fornecedores de materiais", "material-providers", "/forms/entity?previous=/main/material-providers&role=material_provider", "forklift.png", { module_name: "show:material_providers", module_name_add:"create:material_providers" }),
                    linkRegs("Funcionários", "employees", "/forms/employees", "laborers.png", { module_name: "show:employees", module_name_add:"create:employees" }),
                    // linkRegs("Equipamentos e ferramentas", "equipments", "/forms/equipments", "toolbox.png", { module_name: "equipments" , module_name_add:"equipments" }),
                    linkRegs("Visitas", "visits", "/forms/visits", "visit-cards.png", { module_name: "show:visits", module_name_add:"create:visits" }),
                    linkRegs("Serviços", "services-sheet", "/forms/services-sheet", "completed-task.png", { module_name: "show:services",  module_name_add:"create:services" }),
                    linkRegs("Centro de custos", "tree-structure", "", "tree-structure.png", { module_name: "show:cost_center",  module_name_add:"create:cost_center" }),
                    linkRegs("Plano de contas", "chart-accounts/revenues", "", "chart_accounts.png", { indexPath: 1, module_name: "show:chart_accounts",  module_name_add:"create:chart_accounts" })
                ]
            },
            {
                group_name: "Materias e pedidos",
                key: "group_materials",
                links: [
                    linkRegs("Produtos e materiais", "materials", "/forms/materials", "building-materials_2.png", { module_name: "show:materials", module_name_add: "create:materials" }),
                    linkRegs("Cotações", "material-quotations", "/forms/material-quotations?previous=/forms/material-quotations", "payment.png", { module_name: "show:material_quotations", module_name_add: "create:material_quotations" }),
                    linkRegs("Pedidos", "material-orders", "/forms/material-orders", "cargo.png", { module_name: "show:material_orders", module_name_add: "create:material_orders" }),
                ]
            },
            {
                group_name: "Pastas e arquivos",
                key: "group_folders_and_files",
                links: [
                    link("Escritório", "company-cloud", "", "cloud-network.png", { module_name: "show:company_cloud" }),
                    link("Sua Nuvem", "user-cloud", "", "icon-user-cloud.png", { module_name: "show:user_cloud"})
                ]
            },
            {
                group_name: "Financeiro",
                key: "group_financial",
                links: [
                    // link("Fluxo de caixa", "financial/home", "", "financial-home.png", "financial"),
                    link("Contas a Pagar", "financial/accounting/bills_to_pay", "accounting?previous=/main/financial/accounting/bills_to_pay&type=outflow", "right-arrow-outflow.png", { module_name: "show:bills_to_pay", module_name_add: "create:bills_to_pay" }),
                    link("Contas a Receber", "financial/accounting/bills_to_receive", "accounting?previous=/main/financial/accounting/bills_to_receive&type=inflow", "left-arrow-inflow.png", { module_name: "show:bills_to_receive", module_name_add: "create:bills_to_receive" }),
                    link("Contas Pagas", "financial/accounting/paid_bills", "accounting?previous=/main/financial/accounting/paid_bills&type=outflow&wasPaid=1", "right-arrow-realized-outflow.png", { module_name: "show:paid_bills", module_name_add: "create:paid_bills" }),
                    link("Contas Recebidas", "financial/accounting/accounts_received", "accounting?previous=/main/financial/accounting/accounts_received&type=inflow&wasPaid=1", "left-arrow-realized-inflow.png", { module_name: "show:accounts_received", module_name_add: "create:accounts_received" }),
                    // linkRegs("Folhas de pagamentos", "payroll", "/forms/payroll/step_01", "payroll.png"),
                ]
            },
               {
                group_name: "Vendas",
                key: "group_sales",
                links: [
                    linkRegs("Ativos", "assets", "", "assets.png", { module_name: "show:assets", module_name_add: "create:assets" }),
                    linkRegs("Contratos", "contracts", "", "intangible-asset.png", { module_name: "show:contracts", module_name_add: "create:contracts" }),
                ]
            },
            {
                group_name: "Bancos",
                key: "group_banks",
                links: [
                    linkRegs("Contas bancárias", "bank-accounts", "/forms/bank-accounts", "bank-accounts.png", { module_name: "show:bank_accounts", module_name_add: "create:bank_account" }),
                    linkRegs("Cartões de créditos", "credit-cards", "/forms/credit-cards", "credit-cards.png", { module_name: "show:credit_cards", module_name_add: "create:credit_cards" }),
                    linkRegs("Transferências bancárias", "bank-transfers", "/forms/bank-transfers", "bank-tranfers.png", { module_name: "show:bank_transfers", module_name_add: "create:bank_transfer" }),
                    linkRegs("Transações", "bank-transactions", "", "bank-transactions.png", { module_name: "show:bank_transactions" }),
                    linkRegs("Reconciliações", "bank-reconciliations", "", "bank-reconciliations.png", { module_name: "show:bank_reconciliations" }),
                ]
            },
            {
                group_name: "Sistema",
                key: "group_system",
                links: [
                    link("Contas", "sub-accounts/users", "/sub-accounts", "icon-crowd.png", { module_name: "show:sub_accounts", module_name_add: "create:sub_accounts" }),
                    link("Pagamentos", "payments", "", "icon-payment.png", { module_name: "show:system_payments" }),
                    link("Logs", "logs", "", "log.png", { module_name: "show:system_logs" })
                ]
            },
            {
                group_name: "Você",
                key: "group_you",
                links: [
                    link("Minha conta", "configurations", "", "icon-user.png")
                ]
            }
        ].map( (group, i) => {
            const preferences = sort.find(({ key }) => key === group.key)
            group.order = preferences ? preferences.order : i
            return group
        }).sort((a,b) => a.order - b.order)

        const linksConstruction = ref([])
        function defineLinks(){
            const constrId = $route.params.constructionID
            linksConstruction.value = [
                linkConst(constrId, "Home", "home", "icon-home.png", { default_module: true }),
                linkConst(constrId, "Ocorrências", "occurrences", "icon-occurrences.png", { module_name: 'occurrences' }),
                // linkConst(constrId, "Serviços", "services/service-sheet", "ordem-de-servico.png", { module_name: 'services' }),
                linkConst(constrId, "Pedidos e Materiais", "materials/orders", "building-materials.png", { module_name: 'materials' }),
                linkConst(constrId, "Visitas", "visits", "visit-cards.png", { module_name: '' }),
                linkConst(constrId, "Efetivo", "workforce", "team-management.png", { module_name: '' }),
                // linkConst(constrId, "Rastreio de contreto", "concrete-traceability", "concrete-mixer.png", { module_name: '' }),
                // linkConst(constrId, "Calendário", "calendar/calendar", "calendar.png", { module_name: 'progress_tracker' }),
                linkConst(constrId, "Nuvem", "cloud", "icon-cloud.png", { module_name: 'cloud' }),
                linkConst(constrId, "Membros", "members", "group.png", { module_name: 'members', default_module: true }),
                linkConst(constrId, "Configurações", "configurations", "icon-settings.png", { module_name: 'configurations', default_module: true }),
            ]
        }

        onMounted(defineLinks)
        watch(() => $route.params.constructionID, defineLinks)

        function linkRegs(title, path, formPage, src, options = {}){
            return {
                title, 
                path: `/main/${ path }`, 
                formPage, 
                src: require("../../../assets/icons/" + src),
                ...options
            }
        }
        function link(title, path, formPage, src, options = {}){
            return {
                title, 
                path: "/main/" + path, 
                formPage: formPage && '/forms/' + formPage, 
                src: require("../../../assets/icons/" + src),
                ...options
            }
        }
        function linkConst(constructionId, title, path, src, options = {}){
            const PATH = `/main/constructions/c/${ constructionId }/${ path }`
            return {
                title, 
                path: PATH, 
                src: require("../../../assets/icons/" + src),
                ...options
            }
        }

        return { 
            menu,
            linksConstruction
        }
    }
}
</script>


<style lang="less" scoped>    
    .group-pages {
        width: 100%;
        height: calc(100% - 80px);
        overflow: hidden auto;
        transition: 200ms;
        padding-bottom: 20px;
    }
    ::-webkit-scrollbar {
        width: 6px;
        height: 10px;
    }
    ::-webkit-scrollbar-button {
        width: 0px;
        height: 0px;
    }
    ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border: 0px none #ffffff;
        border-radius: 50px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border: 0px none #ffffff;
    }
    ::-webkit-scrollbar-corner {
        background: transparent;
    }
</style>