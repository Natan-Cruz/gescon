import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import { filterKeys } from "../../../../utils/Utils";
import {  isNewDay } from "../utils/index.js";
import ACTIONS from "../utils/events.json";

export async function getAllReports(constructionID){
    return await knex("construction_scheme.reports")
        .select('*')
        .where({ 
            construction_id: constructionID,
            deleted_at: null
        })
        .orderBy("created_at", "desc")
}

export async function getOneReport({ construction_id, report_id }){
    const [report] = await knex("construction_scheme.reports")
        .select("*")
        .where({ id: report_id, construction_id: construction_id })
        .limit(1);

    if(!report)
        throw new Error("Relátorio não encontrado!")

    const employees = await knex("construction_scheme.workforce")
        .select("*")
        .where({ report_id: report_id })

  
    return {
        ...report,
        employees
    }
}

export async function createNewReport(req_body){
    if(!req_body.construction_id || !req_body.user_id)
        throw new Error("Parametro(s) faltante(s): ConstructionID ou userID");

    const [lastReport] = await knex("construction_scheme.reports")
        .select('*')
        .where({ construction_id: req_body.construction_id })
        .orderBy("created_at", "desc")
        .limit(1)

    if(lastReport && !lastReport.wasClosed && !lastReport.wasDeleted && !isNewDay(lastReport.createdAt))
        return {
            id: lastReport.id,
            msg: "Há um relatório aberto"
        };

    const reportID = nanoid();

    return await knex.transaction( async trx => {
        const [report] = await trx("construction_scheme.reports").insert({
            id: reportID,
            construction_id: req_body.construction_id,
            number: lastReport ? (parseInt(lastReport.number) + 1) : 1,
            status: "open",
            date: req_body.date
        }).returning("*")

        return report
    })
}

export async function editReport(req_params, req_body){
    const keys = [
        "climate_morning",
        "climate_afternoon",
        "climate_night",
        "condition_morning",
        "condition_afternoon",
        "condition_night",
        "anotations",
        "status"
    ]

    const alterations = filterKeys(keys, req_body);

    const employees = await knex("construction_scheme.workforce")
        .select("id")
        .where({ report_id: req_params.report_id })

    const employeesActions = { add: [], remove:[] }

    req_body.employees && req_body.employees.forEach( id => {
        const has = (employees.map(({ id }) => id ).indexOf(id) > -1)
        if(!has)
            employeesActions.add.push({
                id: nanoid(),
                report_id: req_params.report_id,
                employee_id: id,
            })
    });

    employees.forEach( ({ id }) => {
        const has = req_body.employees && (req_body.employees.indexOf(id) > -1)
        if(!has)
            employeesActions.remove.push({ report_id: req_params.report_id, employee_id: id })
    });

    return await knex.transaction(async trx => {
        if(Object.entries(alterations).length)
            await trx("construction_scheme.reports")
                .update(alterations)
                .where({ construction_id: req_params.construction_id, id: req_params.report_id })

        if(employeesActions.add.length)
            await trx("construction_scheme.workforce").insert(employeesActions.add)
            
        if(employeesActions.remove.length){
            let promises = []
            employeesActions.remove.forEach( action => {
                let query = trx("construction_scheme.workforce").del().where(action)
                promises.push(query)
            })
            await Promise.all(promises)
        }
    })
}

export async function deleteReport({ construction_id, report }){ 
    return await knex("construction_scheme.report")
        .update({ deleted_at: "now()" })
        .where({ construction_id: construction_id, id: report_id })
}