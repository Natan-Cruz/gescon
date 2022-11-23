import Controller from "../../../../utils/Controller"
import * as models from "../models/webhook.js"

export const handleSucceeded = (req, res) => Controller( async () => {
    await models.handleSucceeded(req.body)
    return;
}, res, "", 200)
export const handleCanceled = (req, res) => Controller( async () => {
    await models.handleCanceled(req.body)
    return;
}, res, "", 200)
export const handleFailed = (req, res) => Controller( async () => {
    await models.handleFailed(req.body)
    return;
}, res, "", 200)
export const handleUpdated = (req, res) => Controller( async () => {
    await models.handleUpdated(req.body)
    return;
}, res, "", 200)