import knex from "../../../../database/database.knex";
import sendMail from "../../../../services/email"
import { addStatusInOccurrence } from "../models";

const accountSid = "AC66e80deaa818be566d1263f924a9ddf3";
const authToken = "f0d1d87211f39a8ce4c33c70af8dc365";
// const client = require('twilio')(accountSid, authToken);
const client = {}

// Obter todos os ids das ocorrencia para notificação
// Obter todos os tercerizados
// Obter contatos
export default async function sendNotifications(arrayOccurrenceID){
    // Faz o tratamento do parametro de entrada que pode ser uma string ou arrays de ids
    let occIDS = [];
    if(typeof arrayOccurrenceID === "string")
        occIDS.push(arrayOccurrenceID);
    else
    if(typeof arrayOccurrenceID === "object" && Array.isArray(arrayOccurrenceID))
        occIDS = arrayOccurrenceID;
    else
        throw new Error("Parametro de entrada incorreto");

    // Obter todas as ocorrencias com contatos e anexos
    const occurrences = await getThirdPartyCompaniesContacts(occIDS)

    for(const occ of occurrences){
        // Se não possuir contato, pula loop
        if(!occ.contacts.length)
            continue;

        // Se escopo for diferente que externo, pula loop
        if(occ.scope !== "external")
            continue;


        for( const ctt of occ.contacts ){
            // Envio de emails
            if(ctt.type === "email")
                sendEmail(ctt.value, occ)
            

            if(ctt.type === "whatsapp")
                await sendMsgWhatsapp(ctt.value, occ)
            

            // Habilitar para produção
            await addStatusInOccurrence(occ.id, 3)
        }
    }
}

async function getThirdPartyCompaniesContacts(ocurrenceIDS){
    const response = [];

    for(const id of ocurrenceIDS){
        const promiseOccurrence = knex("occurrences as occ")
            .select("cp.name as constructionCompanyName", "occ.*")
            .innerJoin("constructions as constr", "constr.id", "occ.constructionID")
            .innerJoin("companies as cp", "cp.id", "constr.companyID")
            .where({ "occ.id": id })

        const promiseContacts = knex("occurrences as occ")
            .select("tpcc.*")
            .innerJoin("occurrenceThirdPartycompanies as otpc", "otpc.occurrenceID", "occ.id")
            .innerJoin("thirdPartyCompanyContacts as tpcc", "tpcc.thirdPartyCompanyID", "otpc.thirdPartyCompanyID")
            .where({ 'occ.id': id, "tpcc.contactWasVerified": false })

        const promiseAttachments = knex("occurrences as occ")
            .select("fls.*")
            .innerJoin("occurrenceAttachments as oa", "oa.occurrenceID", "occ.id")
            .innerJoin("files as fls", "fls.id", "oa.fileID")
            .where({ 'occ.id': id })


        const [ [ occurrence ], contacts, attachments ] = await Promise.all([ promiseOccurrence, promiseContacts, promiseAttachments ]);

        response.push({
            ...occurrence,
            contacts,
            attachments
        })
    }

    return response;
}

async function sendEmail(email, occ){
    const occurrencePublicLink = `https://gescon.tec.br/public/occurrence/${ occ.id }`

    const subject = `Ocorrência registrada - ${ occ.constructionCompanyName }`,
        title = `Uma nova ocorrência foi registrada - ${ occ.constructionCompanyName }!!`,
        subtitle = `Por favor acesse <a href="${ occurrencePublicLink }">gescon.tec.br</a> para acompanhar a ocorrência!`,
        body = occ.description

    const attachments = occ.attachments.map(({ fileName, cloudFileUrl }) => {
        return {
                filename: fileName, 
                path: cloudFileUrl
            }
        })

    const templateConfig = {
        title,
        subtitle,
        body
    }

    await sendMail({ templateEmailName: "main", templateConfig}, { email, subject, body, attachments })
}

// sendEmail("natanalves287@gmail.com", { id: "a", constructionCompanyName: "TESTE", description: "Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict`", attachments: []})

async function sendMsgWhatsapp(number, occ){
    if(!(/^[0-9]{0,14}$/.test(number)))
        return;

    const occurrencePublicLink = `https://gescon.tec.br/public/occurrence/${ occ.id }`

    const msgs = [
        `Uma nova ocorrência foi registrada - ${ occ.constructionCompanyName }!!`,
        `Por favor acesse ${ occurrencePublicLink } para acompanhar a ocorrência!`
    ];

    if(occ.title)
        msgs.push(occ.title);

    if(occ.description)
        msgs.push(occ.description);

    const attachments = [ ...occ.attachments.map( ({ cloudFileUrl }) => cloudFileUrl )];
        
    for(const msg of msgs){
        await client.messages.create({
            from: 'whatsapp:+14155238886',
            to: `whatsapp:+55${number}`,
            body: msg
        })
        .then( res => console.log(res.sid))
    }  

    for(const attach of attachments){
        await client.messages.create({
            from: 'whatsapp:+14155238886',
            to: `whatsapp:+55${number}`,
            body: "",
            mediaUrl: attach
        })
        .then( res => console.log(res.sid))
    }
}
