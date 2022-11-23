import knex from "../../../../database/database.knex";

export async function getAccessControl(user_id){
    if(!user_id) throw new Error("user_id necessario!")


    const pUser = knex("user_scheme.users").select("is_admin").where({ id: user_id })

    const pRolesPermissions = knex("user_scheme.user_roles as ur")
        .select("rp.permission")
        .leftJoin("user_scheme.role_permissions as rp", "rp.role_id", "ur.role_id")
        .where({ "ur.user_id": user_id })

    const pUserPermissions = knex("user_scheme.user_permissions")
        .select("permission")
        .where({ user_id })

    const pUserPermissionsConstruction = knex("user_scheme.user_permission_constructions as upc")
        .select("construction_id", "module_name")
        .where({ user_id })


    const pContractModulesERP =  knex("modules_contracted_company as mcc")
    const pContractModulesConstruction =  knex("modules_contracted_construction as mcc")


    const promises = [ 
        pUser, 
        pRolesPermissions, 
        pUserPermissions, 
        pUserPermissionsConstruction,
        pContractModulesERP,
        pContractModulesConstruction
    ]

    const [ 
        [ user ], 
        rolesPermissions, 
        userPermissions, 
        userPermissionsConstruction,
        contractModulesERP,
        contractModulesConstruction
    ] = await Promise.all(promises)


    const objectMap = [...rolesPermissions, ...userPermissions ].reduce((map, object) => {
        map.set(object.permission, object);
        return map
    }, new Map())

    const permissions = Array.from(objectMap, ([_, value]) => value)

    const manager = []

    whitelist.forEach(({ name, includes, default_module }) => {
        const hasModule = contractModulesERP.findIndex( mod => mod.module_name === name) > -1
        if(hasModule || default_module){
            includes.forEach( p => manager.push(p))
        }
    })
    const constr = []

    contractModulesConstruction.forEach(({ construction_id, module_name }) => {
        const hasModule = userPermissionsConstruction.findIndex( mod => mod.module_name === module_name && mod.construction_id === construction_id ) > -1
        if(hasModule){
            constr.push({ construction_id, module_name })
        }
    })

    return {
        is_admin: user ? user.is_admin : false,
        contracted_modules: manager,
        contracted_modules_construction: constr,
        manager: permissions.map(({ permission }) => permission ),
        constructions: userPermissionsConstruction
    }
}


const whitelist = [
    {
        name: "financial",
        includes: [
            "bills_to_pay",
            "bills_to_receive",
            "paid_bills",
            "accounts_received",
            "bank_accounts",
            "credit_cards",
            "bank_transfers",
            "bank_transactions",
            "bank_reconciliations",
            "chart_accounts"
        ]
    },
    {
        name: "sales",
        includes: [
            "assets",
            "contracts"
        ]
    },
    {
        name: "materials",
        includes: [
            "materials",
            "material_quotations",
            "material_orders"
        ]
    },
    {
        name: "services",
        includes: []
    },
    {
        name: "cloud",
        includes: [
            "construction_cloud",
            "company_cloud",
            "user_cloud"
        ]
    },
    {
        name: "registrations",
        default_module: true,
        includes: [
            "clients",
            "service_providers",
            "material_providers",
            "employees",
            "visits",
            "services",
            "cost_center"
        ]
    },
    {
        name: "system",
        default_module: true,
        includes: [
            "sub_accounts",
            "system_payments",
            "system_logs"
        ]
    }
]

const whitelistConstruction = [
    "home", "configurations"
]