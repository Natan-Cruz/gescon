import knex from "../../../database/database.knex";
import GesconError from "../../../utils/GesconError";

// balance, saldo, consumo por mês
export async function getPaymentsInformations(company_id){
    if(!company_id)
        throw new Error("Company_id ausente!!")

    const transactions = await knex("payment_transactions").select("*", knex.raw("CAST(\"amount\" AS FLOAT) as amount")).where({ company_id })

    const modulesContractedConstruction = await knex("modules_contracted_construction as cmc")
        .select("c.id as construction_id", "c.name as construction_name", "cmc.module_name")
        .innerJoin("construction_scheme.constructions as c", "c.id", "cmc.construction_id")
        .where({ "c.company_id": company_id, "cmc.enabled": true, "c.enabled": true })

    const modulesContractedCompany = await knex("modules_contracted_company")
        .select("*")
        .where({ company_id, enabled: true })
    
    const modules_contracted_construction = modulesContractedConstruction.reduce((acc, cur) => {
        const item = acc.get(cur.construction_id)

        if(item){
            item.modules.push(cur.module_name)
            acc.set(cur.construction_id, item)
        }else{
            acc.set(cur.construction_id, {
                id: cur.construction_id, 
                construction_name: cur.construction_name,
                modules: [ cur.module_name ]
            })
        }
        return acc
    }, new Map())

    const modules_contracted_company = modulesContractedCompany.map(({ module_name }) => module_name )


    const balance = transactions.reduce((acc, cur) => {
        acc += cur.amount
        return acc
    }, 0);
    const consumptionPerMonth = modulesContractedConstruction.reduce((acc, cur) => {
        if(cur.module_name !== "occurrences" && cur.module_name !== "cloud")
            acc += 75

        return acc
    }, 0)
    const remaining_months = (balance / consumptionPerMonth).toFixed(2)
    
    const trans = transactions.map(( transaction, i ) => {
        const balance = transactions.splice(0, i).reduce((acc, cur) => {
            acc += cur.amount
            return acc
        }, 0)
        return {
            ...transaction,
            balance
        }
    })

    return {
        informations: {
            balance: balance,
            consumption_per_month: consumptionPerMonth,
            remaining_months: remaining_months
        },
        modules_contracted_company,
        modules_contracted_construction: Array.from(modules_contracted_construction, ([_, value]) => value ),
        transactions: trans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
}

export async function getTransactionDetails(transactionID){
    if(!transactionID)
        throw new Error("Transaction id necessario")

        
    const promiseTransaction = knex("payment_transactions").select("*", knex.raw("CAST(\"amount\" AS FLOAT) as amount")).where({ id: transactionID }).limit(1) 
    const promiseItems = knex("payment_transaction_items").select("*", knex.raw("CAST(\"value\" AS FLOAT) as value")).where({ transaction_id: transactionID })

    const [[ transaction ], items ] = await Promise.all([ promiseTransaction, promiseItems ])
        
    if(!transaction)
        throw new GesconError("Transação não encontrada!");

    return {
        ...transaction,
        items
    }
}


export async function getLogs(req_query){

    const query = {
        search: "",
        start_date: "",
        end_date: "",
        user: ""
    }

    const { company_id, search, start_date, end_date, user, type, construction_id } = req_query;

    if(search){
        query.search = knex.raw("lg.message ILIKE ?", [`%${ search }%`])
    }

    if(isValidDate(start_date)){
        query.start_date = knex.raw("date(lg.created_at) >= ?::date", [ start_date ])
    }

    if(isValidDate(end_date)){
        query.end_date = knex.raw("date(lg.created_at )<= ?::date", [ end_date ])
    }
    if(user){
        query.user = knex.raw("lg.user_id = ?", [ user ])
    }

    const erpLogs = await knex("public.erp_logs as lg")
        .select("lg.*", knex.raw("concat(u.first_name, ' ', u.last_name) as user_name"))
        .leftJoin("user_scheme.users as u", "u.id", "lg.user_id")
        .where({ "lg.company_id": company_id })
        .andWhereRaw(query.search)
        .andWhereRaw(query.start_date)
        .andWhereRaw(query.end_date)
        .andWhereRaw(query.user)
        .orderBy("lg.created_at", "desc");

    const constructionsLogs = await knex("construction_scheme.erp_activities as lg")
        .select(
            "lg.id",
            "lg.description as message",
            "lg.construction_id",
            "lg.created_at",
            knex.raw("concat(u.first_name, ' ', u.last_name) as user_name")
        )
        .innerJoin("construction_scheme.constructions as cns", "cns.id", "lg.construction_id")
        .leftJoin("user_scheme.users as u", "u.id", "lg.user_id")
        .where({ "cns.company_id": company_id })
    
    return [ ...erpLogs, ...constructionsLogs ];
}

// YYYY-MM-DD
function isValidDate(date){
    if(!date) 
        return false;

    return /(\d{4})-?(\d{2})?-(\d{2})/.test(date)
}
