import Pushy from "pushy"
import knex from "../database/database.knex";
import logger from "../utils/logger";
const pushyAPI = new Pushy('cb40424d58adffa0414c2aa9979956f5a374ffbb9472d81f0016c810edf6c911');

export async function sendPushNotification(user_id, { title, message, icon }){

    try {
        const deviceTokens = await knex("user_scheme.device_tokens as dt")
            .select("dt.token")
            .innerJoin("user_scheme.users as u", "u.id", "dt.user_id")
            .innerJoin("companys as c", "c.id", "u.company_id")
            .where({ "u.id": user_id })

        if(!deviceTokens.length) return;

        const data = {
            title,
            message: message,
            icon
        };
        
        const options = {
            notification: {
                badge: 1,
                title, 
                body: message,
                icon
            },
        };
        const to = deviceTokens.map( ({ token }) => token );

        pushyAPI.sendPushNotification(data, to, options, function (err, id) {
            // Log errors to console 
            if (err) 
                return logger.error("Pushy Notification: Fatal error" + err);
            
            // Log success 
            logger.info("Pushy Notification: Sent", id)
        })
        
    } catch (error) {
        console.log(error)
        return logger.error("Pushy Notification: Fatal error" + error);
    }
}