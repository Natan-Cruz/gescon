import Controller from "../../../../utils/Controller";
// import sendNotifications from "./sendNotifications";

export const sendNotifications = (req,res) => Controller( async () => {
    // sendNotifications(req.body.occurrencesIDS)
    return true
}, res, "controllerNotify -> sendNotifications")


export const getAllOccurrenceForGenerateReport = (req, res) => Controller( async () => {
    return await getAllOccurrenceForGenerateReport(req.params.constructionID);
},res, "controllerNotify -> getAllOccurrenceForGenerateReport")
