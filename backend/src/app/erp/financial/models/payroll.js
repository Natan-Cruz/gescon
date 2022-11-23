import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys, formatActions } from "../../../../utils/Utils";
import GesconError from "../../../../utils/GesconError"
import { getCurrencyDollar } from "../../../../utils/Utils";

export async function getAllPayroll(company_id){
    if(!company_id && typeof company_id !== 'string') 
        throw new Error("companyID necessario")

    const payroll = await knex("human_resources_scheme.payroll")
        .select("*")
        .where({ company_id })

    const transactions = await knex("human_resources_scheme.payroll_payments_employee as ppe")
        .select("p.id as payroll_id","ppe.type", knex.raw("CAST(ppe.value AS FLOAT) as amount"))
        .innerJoin("human_resources_scheme.payroll as p", "p.id", "ppe.payroll_id")
        .where({ "p.company_id": company_id })

    return payroll.map( p => {
        p.amount = transactions.reduce((acc, cur) => {
            if(cur.payroll_id === p.id)
                acc += cur.type === "discount" ? cur.amount * -1 : cur.amount
            return acc
        }, 0)
        return p
    })
}

export async function getOnePayroll(payroll_id){
    if(!payroll_id)
        throw new Error("id nao presente")

    const [ payroll ] = await knex("human_resources_scheme.payroll")
        .select("*")
        .where({ id: payroll_id })
        .limit(1)

    const [ trx ] = await knex("financial_scheme.bank_transactions")
        .select("cost_center_id","chart_account_id", "account_id")
        .where({ reference: "payroll", reference_id: payroll_id })
        .limit(1)

    const payments = await knex("human_resources_scheme.payroll_payments_employee") 
        .select("*")
        .where({ payroll_id })

    if(!payroll)
        throw new GesconError("Folha de pagamentos nao encontrado!")

    return {
        ...payroll,
        ...trx,
        transactions: payments
    }
}

export async function createNewPayroll(req_body){
    if(!req_body)
        throw new Error("Body necessario")

    const currencyRate = await getCurrencyDollar()

    const allowedKeys = [
        "company_id",
        "start_date",
        "end_date"
    ]
    const allowedKeysPayment = [
        "employee_id",
        "short_description",
        "long_description",
        "value",
        "quantity",
        "complement",
        "type",
        "payday"
    ]

    const payroll = filterKeys(allowedKeys, req_body, { id: nanoid() })
   
    const payments = []
    req_body.transactions.forEach( trx => {
        payments.push(filterKeys(allowedKeysPayment, trx, { id: nanoid(), payroll_id: payroll.id }))
    })
    
    const transactionAmount =  req_body.transactions.reduce((acc, cur) => {
        if(cur.value)
            acc += parseFloat(cur.value)

        return acc
    }, 0)

    const transactions = []

    const transactionsByEmployee = req_body.transactions.reduce((acc, cur) => {
        const has = acc.get(cur.employee_id)
        const value = cur.type === "discount" ? cur.value * -1 : cur.value
        if(has){
            const sum = parseFloat(value) + has
            acc.set(cur.employee_id, sum)
        }else{
            acc.set(cur.employee_id, parseFloat(value))
        }
        return acc
    }, new Map())

    const employeesNames = await knex("human_resources_scheme.employees")
        .select("id", "fullname")
        .whereIn("id", Array.from(transactionsByEmployee).map( ([key]) => key ))

    Array.from(transactionsByEmployee).forEach(([ key, value ]) => {
        const { fullname } = employeesNames.find( employee => employee.id === key )
        transactions.push({
            id: nanoid(),
            company_id: req_body.company_id,
            cost_center_id: req_body.cost_center_id,
            chart_account_id: req_body.chart_account_id,
            account_id: req_body.account_id,
            type: "outflow",
            name: `Pagamento para colaborador - ${ fullname }`,
            description: "Transação gerada de forma automática ao gerar folha de pagamentos",
            amount: value.toFixed(2),
            currency_code: "BRL",
            currency_rate: currencyRate,
            payment_method: "Diversos",
            billing_date: "now()",
            paid_at: "now()",
            reference: "payroll_employee",
            reference_id: key
        })
    })

    console.log(transactions)

    return await knex.transaction( async trx => {
        const [ result ] = await trx("human_resources_scheme.payroll")
            .insert(payroll)
            .returning("*")

        await trx("financial_scheme.bank_transactions")
            .insert(transactions)

        if(payments.length)
            await trx("human_resources_scheme.payroll_payments_employee")
                .insert(payments)

        return result
    })
}

export async function editPayroll(req_body){
    if(!req_body || !req_body.id)
        throw new Error("id nao presente")

    const currencyRate = await getCurrencyDollar()

    const allowedKeys = [
        "start_date",
        "end_date",
    ];
    const allowedKeysTransaction = [
        "employee_id",
        "short_description",
        "long_description",
        "value",
        "quantity",
        "complement",
        "type",
        "payday"
    ]
    const payroll = filterKeys(allowedKeys, req_body)
    const { add, update, remove } = formatActions(req_body.transactions)
    return await knex.transaction( async trx => {
        let r;
        
        if(Object.entries(payroll).length){
            const [ result ] = await trx("human_resources_scheme.payroll").update(payroll).where({ id: req_body.id }).returning("*")
            r = result
        }

        if(add.length){
            await trx("human_resources_scheme.payroll_payments_employee")
                .insert(add.map( payment => {
                    return filterKeys(allowedKeysTransaction, payment, { id: nanoid(), payroll_id: req_body.id, employee_id: req_body.id })
               }))
        }

        if(update.length){
            const promisses = []

            update.map( payment => {
                const query = trx("human_resources_scheme.payroll_payments_employee")
                    .update(filterKeys(allowedKeysTransaction, payment))
                    .where({ id: payment.id })

                promisses.push(query)
            })
            await Promise.all(promisses)
        }

        if(remove.length)
            await trx("human_resources_scheme.payroll_payments_employee")
                .del().whereIn('id', remove.map( payment => payment.id ))


        if(add.length || update.length || remove.length){
            const t_a = await knex("human_resources_scheme.payroll_payments_employee")
                .select("*", knex.raw("CAST(value AS FLOAT)"))
                .where({ payroll_id: req_body.id })

            const t_b = await trx("human_resources_scheme.payroll_payments_employee")
                .select("*", knex.raw("CAST(value AS FLOAT)"))
                .where({ payroll_id: req_body.id })

            const trxs_a = reduc(t_a)
            const trxs_b = reduc(t_b)

            const transactions = { add: [], update: [], remove: [] }
            if(!trxs_a.length){
                trxs_b.forEach( t => {
                    transactions.add.push({ employee_id: t[0], amount: t[1] })
                })
            }else{
                trxs_a.forEach( (t_a, i) => {
                    trxs_b.forEach( t_b => {
                        if(t_a[0] === t_b[0] && t_a[1] !== t_b[1])
                            transactions.update.push({ employee_id: t_a[0], amount: t_b[1] })
                    })
                    const t_b_has = trxs_b.findIndex( elem => elem[0] === t_a[0])
                    if(t_b_has === -1){
                        transactions.remove.push({ employee_id: t_a[0] })
                    }
                })
            }

            if(transactions.add.length){
                const employeesNames = await knex("human_resources_scheme.employees")
                    .select("id", "fullname")
                    .whereIn("id", transactions.add.map(({ employee_id }) => employee_id ))

                await trx("financial_scheme.bank_transactions")
                    .insert(transactions.add.map( tx => {
                        const { fullname } = employeesNames.find( employee => employee.id === tx.employee_id )
                        return {
                            id: nanoid(),
                            company_id: "Pq6IM1LNUz35PbQp",
                            cost_center_id: "kN6d9mI1Pm6TZvIj",
                            chart_account_id: "3AUhTySWaKRCVSoG",
                            account_id: "mafGcvzRO5MEfNRq",
                            type: "outflow",
                            name: `Pagamento para colaborador - ${ fullname }`,
                            description: "Transação gerada de forma automática ao gerar folha de pagamentos",
                            amount: tx.amount,
                            currency_code: "BRL",
                            currency_rate: currencyRate,
                            payment_method: "Diversos",
                            billing_date: "now()",
                            paid_at: "now()",
                            reference: "payroll_employee",
                            reference_id: tx.employee_id
                        }
                    }))
            }
    
            if(transactions.update.length){
                const promisses = []
    
                transactions.update.map( tx => {
                    const query = trx("financial_scheme.bank_transactions")
                        .update({ amount: tx.amount })
                        .where({ reference: "payroll_employee", reference_id: tx.employee_id })
    
                    promisses.push(query)
                })
                await Promise.all(promisses)
            }
    
            if(transactions.remove.length)
                await trx("financial_scheme.bank_transactions")
                    .del().whereIn('id', transactions.map( tx => tx.employee_id )).andWhere({ reference: "payroll_employee" })
        }

        return r
    })
}

function reduc(trxs){
    const transactionsByEmployee = trxs.reduce((acc, cur) => {
        const has = acc.get(cur.employee_id)
        const value = cur.type === "discount" ? cur.value * -1 : cur.value
        if(has){
            const sum = parseFloat(value) + has
            acc.set(cur.employee_id, sum)
        }else{
            acc.set(cur.employee_id, parseFloat(value))
        }
        return acc
    }, new Map())

    return Array.from(transactionsByEmployee)
}