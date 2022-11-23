import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys, formatActions } from "../../../../utils/Utils";
import saveLog from "../../erpActivyLogs";

export async function getAllEmployees(company_id, req_query){
    if(!company_id) 
        throw new Error("company_id requirido")

    const query = {
        search: "",
        type: "",
        deleted: ""
    }

    const { search, type, deleted } = req_query;

    if(search){
        query.search = knex.raw("empl.fullname ILIKE ?", [`%${ search }%`])
    }

    switch(type){
        case "construction_company": 
            query.type = knex.raw("empl.entity_id is null");
            break;
        case "outsourced_company": 
            query.type = knex.raw("empl.entity_id is not null");
            break;
    }

    if(deleted){
        query.deleted = knex.raw("empl.deleted_at is not null")
    }else{
        query.deleted = knex.raw("empl.deleted_at is null")
    }

    return await knex("human_resources_scheme.employees as empl")
        .select("empl.*", knex.raw("CASE WHEN e.name is not null THEN e.name ELSE c.name END AS company_name"))
        .leftJoin("public.entities as e", "e.id", "empl.entity_id")
        .leftJoin("public.companies as c", "c.id", "empl.company_id")
        .where({ "empl.company_id": company_id })
        .andWhereRaw(query.search)
        .andWhereRaw(query.type)
        .andWhereRaw(query.deleted)
}

export async function getAllEmployeesWithItems(company_id){
    if(!company_id) 
        throw new Error("company_id requirido")

    const employees = await knex("human_resources_scheme.employees")
        .select("*")
        .where({ company_id })

        // 
    const gainsProduction = await knex("human_resources_scheme.employee_gains_production as egp")
        .select("egp.*")
        .innerJoin("human_resources_scheme.employees as e", "e.id", "egp.employee_id")
        .where({ "e.company_id": company_id })

    const paymentMethods = await knex("human_resources_scheme.employee_payment_methods as epm")
        .select("epm.*")
        .innerJoin("human_resources_scheme.employees as e", "e.id", "epm.employee_id")
        .where({ "e.company_id": company_id })

    const discounts = await knex("human_resources_scheme.employee_discounts as ed")
        .select("ed.*")
        .innerJoin("human_resources_scheme.employees as e", "e.id", "ed.employee_id")
        .where({ "e.company_id": company_id })

    return employees.map( employee => {
        employee.gains_production = gainsProduction.filter( production => production.employee_id === employee.id )
        employee.payment_methods = paymentMethods.filter( paymentMethod => paymentMethod.employee_id === employee.id )
        employee.discounts = discounts.filter( discount => discount.employee_id === employee.id )
        return employee
    })
}

export async function getOneEmployee(employee_id){
    if(!employee_id)
        throw new Error("employee_id necessario")

    const promiseEmployee = knex("human_resources_scheme.employees")
        .select("*")
        .where({ id: employee_id })
        .limit(1)

    const promiseGainsProduction = knex("human_resources_scheme.employee_gains_production")
        .select("*")
        .where({ employee_id })

    const promiseEmployeePaymentMethod = knex("human_resources_scheme.employee_payment_methods")
        .select("*")
        .where({ employee_id })

    const promiseEmployeeDiscounts = knex("human_resources_scheme.employee_discounts")
        .select("*")
        .where({ employee_id })

    const [[ employee ], gains_production, payment_methods, discounts ] = await Promise.all([ promiseEmployee, promiseGainsProduction, promiseEmployeePaymentMethod, promiseEmployeeDiscounts ])

    if(!employee)
        throw new Error("Funcionário não encontrado!!")

    return {
        ...employee,
        gains_production,
        payment_methods,
        discounts
    }
}

export async function createNewEmployee(req_body){
    if(!req_body || !req_body.company_id) 
        throw new Error("req_body ou company_id necessario")

    const allowedKeys = [
        "company_id",
        "fullname",
        "type_employment_contract",
        "wage",
        "payday",
        "entity_id"
    ]

    const employee = filterKeys(allowedKeys, req_body, { id: nanoid() })

    const gainsProduction = [], paymentMethods = [], discounts = []

    req_body.gains_production.forEach( payment => {
        gainsProduction.push({
            id: nanoid(),
            employee_id: employee.id,
            short_description: payment.short_description,
            long_description: payment.long_description,
            price: payment.price,
            unity: payment.unity
        })
    })

    req_body.payment_methods.forEach( payment => {
        paymentMethods.push({
            id: nanoid(),
            employee_id: employee.id,
            payment_method: payment.payment_method,
            description: payment.description
        })
    })

    req_body.discounts.forEach( discount => {
        discounts.push({
            id: nanoid(),
            employee_id: employee.id,
            name: discount.name,
            value: discount.value,
            payday: discount.payday
        })
    })


    return await knex.transaction( async trx => {
        const [ result ] = await trx("human_resources_scheme.employees").insert(employee).returning("*")

        if(gainsProduction.length)
            await trx("human_resources_scheme.employee_gains_production").insert(gainsProduction)

        if(paymentMethods.length)
            await trx("human_resources_scheme.employee_payment_methods").insert(paymentMethods)

        if(discounts.length)
            await trx("human_resources_scheme.employee_discounts").insert(discounts)

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "employee",
            message: "Funcionário foi cadastrado!",
            ip: req_body.ip,
            reference: "human_resources_scheme.employees",
            reference_id: employee.id
        }, trx)

        return result;
    })

}

export async function editEmployee(req_body){
    if(!req_body || !req_body.id)
        throw new Error("body ausente ou errado")

    const allowedKeys = [
        "fullname",
        "role",
        "type_employment_contract",
        "entity_id",
        "deleted_at"
    ]

    const allowedKeysGainProduction = [ "short_description", "long_description", "price", "unity" ]
    const allowedKeysPaymentMethods = [ "payment_method", "description" ]
    const allowedKeysDiscounts = [ "name", "value", "payday" ]

    const employee = filterKeys(allowedKeys, req_body)
    const gainsProduction = formatActions(req_body.gains_production)
    const paymentMethods = formatActions(req_body.payment_methods)
    const discounts = formatActions(req_body.discounts)

    return await knex.transaction( async trx => {
        let r;
        
        if(Object.entries(employee).length){
            const [ result ] = await trx("human_resources_scheme.employees").update(employee).where({ id: req_body.id }).returning("*")
            r = result
        }

        // employees gains productions
        if(gainsProduction.add.length)
            await trx("human_resources_scheme.employee_gains_production")
                .insert(gainsProduction.add.map( production => {
                    return filterKeys(allowedKeysGainProduction, production, { id: nanoid(), employee_id: req_body.id })
                }))

        if(gainsProduction.update.length){
            const promisses = []

            gainsProduction.update.map( production => {
                const query = trx("human_resources_scheme.employee_gains_production")
                    .update(filterKeys(allowedKeysGainProduction, production))
                    .where({ id: production.id })

                promisses.push(query)
            })
            await Promise.all(promisses)
        }

        if(gainsProduction.remove.length)
            await trx("human_resources_scheme.employee_gains_production")
                .del().whereIn('id', gainsProduction.remove.map( production => production.id ))
        

        // employees payments methods
        if(paymentMethods.add.length)
            await trx("human_resources_scheme.employee_payment_methods")
                .insert(paymentMethods.add.map( paymentMethod => {
                    return filterKeys(allowedKeysPaymentMethods, paymentMethod, { id: nanoid(), employee_id: req_body.id })
                }))

        if(paymentMethods.update.length){
            const promisses = []

            paymentMethods.update.map( paymentMethod => {
                const query = trx("human_resources_scheme.employee_payment_methods")
                    .update(filterKeys(allowedKeysPaymentMethods, paymentMethod))
                    .where({ id: paymentMethod.id })

                promisses.push(query)
            })
            await Promise.all(promisses)
        }

        if(paymentMethods.remove.length)
            await trx("human_resources_scheme.employee_payment_methods")
                .del().whereIn('id', paymentMethods.remove.map( paymentMethod => paymentMethod.id ))

        // employees discounts
        if(discounts.add.length)
            await trx("human_resources_scheme.employee_discounts")
                .insert(discounts.add.map( discount => {
                    return filterKeys(allowedKeysDiscounts, discount, { id: nanoid(), employee_id: req_body.id })
                }))

        if(discounts.update.length){
            const promisses = []

            discounts.update.map( discount => {
                const query = trx("human_resources_scheme.employee_discounts")
                    .update(filterKeys(allowedKeysDiscounts, discount))
                    .where({ id: discount.id })

                promisses.push(query)
            })
            await Promise.all(promisses)
        }

        if(discounts.remove.length)
            await trx("human_resources_scheme.employee_discounts")
                .del().whereIn('id', discounts.remove.map( discount => discount.id ))

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "employee",
            message: "Funcionário foi editado!",
            ip: req_body.ip,
            reference: "human_resources_scheme.employees",
            reference_id: req_body.id
        }, trx)
            
        // if(employeeDiscounts.length)
        //     await trx("human_resources_scheme.employee_discounts").insert(employeeDiscounts).returning("*")

        return r;
    })
}

export async function deleteEmployee(req_body){
    if(!req_body.id)
        throw new Error("employee_id ausente ou errado")

    return await knex.transaction( async trx => {
        await trx("human_resources_scheme.employees").update({ deleted_at: "now()" }).where({ id: req_body.id })

        await saveLog({
            company_id: req_body.company_id,
            user_id: req_body.user_id,
            source: "employee",
            message: "Funcionário foi deletado!",
            ip: req_body.ip,
            reference: "human_resources_scheme.employees",
            reference_id: req_body.id
        }, trx)
    })
}