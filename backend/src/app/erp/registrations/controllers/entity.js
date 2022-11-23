import * as models from "../models/entity";
import Controller from "../../../../utils/Controller";

const DEFAULT_PATHNAME = new Map()
DEFAULT_PATHNAME.set("material-provider", "material_provider")
DEFAULT_PATHNAME.set("service-provider", "service_provider")
DEFAULT_PATHNAME.set("clients", "client")
DEFAULT_PATHNAME.set("all", "")

export const getAllEntities = (req, res) => Controller( async () => {
    const pathname = req._parsedUrl.pathname.replace("/", "");
    const entities = await models.getAllEntities(req.company_id, DEFAULT_PATHNAME.get(pathname), req.query);
    return entities;
}, res, "entity -> getAllEntities")

export const getAllEntitiesContacts = (req, res) => Controller( async () => {
    const contacts = await models.getAllEntitiesContacts(req.company_id)
    return contacts
}, res, "")

export const getOneEntity = (req,res) => Controller( async () => {
    const entity = await models.getOneEntity(req.params.id);
    return entity;
}, res, "entity -> getOneEntity")

export const createNewEntity = (req,res) => Controller( async () => {
    const entity = await models.createNewEntity({ company_id: req.company_id, user_id: req.user_id, ip: req.ip, ...req.body })
    return entity;
}, res, "entity -> createNewEntity", 201)

export const editEntity = (req, res) => Controller( async () => {
    return await models.editEntity({ ...req.body, user_id: req.user_id, company_id: req.company_id, ip: req.ip})
}, res, "entity -> editEntity")

export const deleteEntity = (req, res) => Controller( async () => {
    const response = await models.deleteEntity({ id: req.params.id, user_id: req.user_id, company_id: req.company_id, ip: req.ip })
    return response
}, res, "", 200)