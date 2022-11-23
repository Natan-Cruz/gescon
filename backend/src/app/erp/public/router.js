import { Router } from "express";
import sendMail from "../../../services/email";
import logger from "../../../utils/logger";

const router = Router();
const emails = ["gescon.tec.br@gmail.com", "natanalves287@gmail.com"];

// import "./script_2";

router.post("/send-email-public-contact", async ( req, res ) => {
    const { name, email, message } = req.body;
    try {

        const subject = "Mensagem da landin g page - gescon", 
            body = `<b>Enviado por</b>: ${ name } <br> <b>Mensagem:</b> ${ message } <br> <b>Email:<b> ${ email }`

        const templateConfig = {
            title: "",
            subtitle: subject,
            body
        }

        await sendMail({ templateEmailName: "main", templateConfig }, { email: emails, subject, body })

        res.sendStatus(201);

    } catch (error) {
        logger.error(error)     
        res.send({ name: error.name, message: error.message })
    }
});



export { router };
