import Controller from "../../../../utils/Controller";
import * as models from "../models/contracts"

export const getAllContracts = (req,res) => Controller( async () => {
    return await models.getAllContracts(req.userId)
}, res, "controllerContracts -> getAllContracts")