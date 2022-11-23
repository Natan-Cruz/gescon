import nodemailer from 'nodemailer';
import config from '../config/nodemailer.json';
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport(config);


async function sendMail( { templateEmailName, templateConfig } ,{ email, subject, body, attachments }) {
    try {
        if(templateEmailName && templateConfig){
            const html = await ejs.renderFile(path.join(__dirname, `./templateEmails/${templateEmailName}.ejs`), templateConfig)
                // send mail with defined transport object
            let info = await transporter.sendMail({
                from: config.auth.user, // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                text: body, // plain text body
                html: html, // html body,
                attachments: attachments || []
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }else{
            let info = await transporter.sendMail({
                from: config.auth.user, // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                text: body, // plain text body
                attachments: attachments || []
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

    } catch (err) {
        console.log('user/email/sendMailWelcome', err)
    }
}

export default sendMail;