import { accountSid, authToken } from "../config/twilio.json";

const client = require('twilio')(accountSid, authToken);

export default async function sendMsgWhatsapp(number, message = "", mediaUrl = []){
    return await client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+55${number}`,
        body: message,
        mediaUrl: mediaUrl
    })
}