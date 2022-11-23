import * as models from "../models/employees"
import Controller from "../../../../utils/Controller"

// Obtem todas as contas bancarias
export const getAllEmployees = (req, res) => Controller(async () => {
    const employees = await models.getAllEmployees(req.company_id, req.query)  
    return employees;
}, res, "controller -> getAllEmployees")

export const getAllEmployeesWithItems = (req, res) => Controller( async () => {
    const employees = await models.getAllEmployeesWithItems(req.company_id)  
    return employees; 
}, res, "")

export const getOneEmployee = (req, res) => Controller(async () => {
    const employee = await models.getOneEmployee(req.params.id)  
    return employee;
}, res, "controller -> getOneEmployee")

export const createNewEmployee = (req, res) => Controller(async () => {
    const response = await models.createNewEmployee({ ...req.body, ...req.defaultParams })  
    return response;
}, res, "controller -> createNewEmployee", 201)

export const editEmployee = (req, res) => Controller( async () => {
    const response = await models.editEmployee({ ...req.body, ...req.defaultParams })
    return response;
}, res, "")

export const deleteEmployee = (req, res) => Controller( async () => {
    const response = await models.deleteEmployee({ id: req.params.id, ...req.defaultParams })
    return response;
}, res, "")