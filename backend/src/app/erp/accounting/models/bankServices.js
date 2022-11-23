import knex from "../../../../database/database.knex";
import nanoid from "../../../../utils/nanoid";
import dayjs from "dayjs"
import sendMail from "../../../../services/email";


const sdk = require('api')('@voluti/v1.0#bm4h38l0mnc8fw');
sdk.auth('de0a601ff44748599f69b2970a6fab7e', 'NDU4MzMzNDYwMDAxMDk=');
sdk.server('https://api.weepay.com.br');
// dados do cliente
// dados da transacao

export async function getInformationsAboutInstallmentsAndCustomers(req_body){
    const response = [];

    for(const { id, isTransaction } of req_body){
        if(isTransaction){
            const [ cstmer ] = await knex("financial_scheme.bank_transactions as bt") 
                .select(
                    "bt.id as t_id",
                    "e.id", 
                    "e.name",
                    "e.email",
                    "e.cellphone",
                    "e.document_value",
                    "e.legal_type",
                    "e.street",
                    "e.neighborhood",
                    "e.city",
                    "e.state",
                    "e.cep",
                )
                .innerJoin("entities as e", "e.id", "bt.entity_id")
                .where({ "bt.id": id })

            response.push(cstmer)
        }else{
            const [ cstmer ] = await knex("financial_scheme.recurrence_template as bt") 
            .select(
                "bt.id as t_id",
                "e.id", 
                "e.name ",
                "e.email",
                "e.cellphone",
                "e.document_value",
                "e.legal_type",
                "e.street",
                "e.neighborhood",
                "e.city",
                "e.state",
                "e.cep"
            )
            .innerJoin("entities as e", "e.id", "bt.entity_id")
            .where({ "bt.id": id })

            response.push(cstmer)
        }
    }

    return response
}


async function getCustomerDataTransaction(account){
    const [ cstmer ] = await knex("financial_scheme.bank_transactions as bt") 
        .select(
            "bt.id as t_id",
            "btbs.id as splip_id",
            "e.id", 
            "e.name",
            "e.email",
            "e.cellphone",
            "e.document_value",
            "e.legal_type",
            "e.street",
            "e.neighborhood",
            "e.city",
            "e.state",
            "e.cep",
            "bt.amount",
            "bt.due_date"
        )
        .innerJoin("entities as e", "e.id", "bt.entity_id")
        .leftJoin("financial_scheme.bank_transaction_bank_slips as btbs", "btbs.id", function(){
            this.select("id")
                .from("financial_scheme.bank_transaction_bank_slips")
                .where("transaction_id", "=", knex.raw("bt.id"))
                .orderBy("created_at", "asc")
                .limit(1)
        })
        .where({ "bt.id": account.id })

    const email = account.email || cstmer.email
    const cellphone = account.cellphone || cstmer.cellphone
    const document_value = cstmer.document_value
    const legal_type = cstmer.legal_type
    const street = account.street || cstmer.street
    const neighborhood = account.neighborhood || cstmer.neighborhood
    const city = account.city || cstmer.city
    const state = account.state || cstmer.state
    const cep = account.cep || cstmer.cep

    if( !email ||
        cstmer.splip_id ||
        // !cellphone ||
        !document_value ||
        !legal_type ||
        !street ||
        !neighborhood ||
        !city ||
        !state ||
        !cep
    )
    return {};

    let entity = {}

    if(account.email) entity.email = account.email
    if(account.cellphone) entity.cellphone = account.cellphone
    if(account.street) entity.street = account.street
    if(account.neighborhood) entity.neighborhood = account.neighborhood
    if(account.city) entity.city = account.city
    if(account.state) entity.state = account.state
    if(account.cep) entity.cep = account.cep;

    if(Object.entries(entity).length){
        entity.id = cstmer.id
    }else{
        entity = undefined
    }

    const customer = {
        id: cstmer.id,
        transaction_id: cstmer.t_id,
        name: cstmer.name,
        email: email,
        cellphone: cellphone,
        document_value: document_value,
        legal_type: legal_type,
        street: street,
        neighborhood: neighborhood,
        city: city,
        state: state,
        cep: cep,
        due_date: dayjs().add(7, "day").format("YYYY-MM-DD"),
        amount: parseFloat(cstmer.amount || cstmer.forecast_amount)
    }

    return {
        entity,
        customer
    }
}

async function getCustomerDataRecurrence(account){
    const [ cstmer ] = await knex("financial_scheme.recurrence_template as bt") 
        .select(
            "bt.id as t_id",
            "bt.company_id as t_company_id",
            "bt.cost_center_id as t_cost_center_id",
            "bt.chart_account_id as t_chart_account_id",
            "bt.entity_id as t_entity_id",
            "bt.account_id as t_account_id",
            "bt.type as t_type",
            "bt.name as t_name",
            "bt.description as t_description",
            knex.raw("CAST(bt.amount as FLOAT) as t_amount"),
            "bt.due_date as t_due_date",
            "bt.billing_date as t_billing_date",
            "bt.due_date as t_due_date",
            // 
            "e.id as e_id", 
            "e.name as e_name ",
            "e.email as e_email",
            "e.cellphone as e_cellphone",
            "e.document_value as e_document_value",
            "e.legal_type as e_legal_type",
            "e.street as e_street",
            "e.neighborhood as e_neighborhood",
            "e.city as e_city",
            "e.state as e_state",
            "e.cep as e_cep"
        )
        .innerJoin("entities as e", "e.id", "bt.entity_id")
        .where({ "bt.id": account.id })

    const email = account.email || cstmer.e_email
    const cellphone = account.cellphone || cstmer.e_cellphone
    const document_value = cstmer.e_document_value
    const legal_type = cstmer.e_legal_type
    const street = account.street || cstmer.e_street
    const neighborhood = account.neighborhood || cstmer.e_neighborhood
    const city = account.city || cstmer.e_city
    const state = account.state || cstmer.e_state
    const cep = account.cep || cstmer.e_cep
    
    if( !email ||
        // !cellphone ||
        !document_value ||
        !legal_type ||
        !street ||
        !neighborhood ||
        !city ||
        !state ||
        !cep
    )
    return {};

    let entity = {}

    if(account.email) entity.email = account.email
    if(account.cellphone) entity.cellphone = account.cellphone
    if(account.street) entity.street = account.street
    if(account.neighborhood) entity.neighborhood = account.neighborhood
    if(account.city) entity.city = account.city
    if(account.state) entity.state = account.state
    if(account.cep) entity.cep = account.cep;
    if(Object.entries(entity).length){
        entity.id = cstmer.e_id
    }else{
        entity = undefined
    }

    cstmer.due_date = dayjs().set("date", cstmer.t_due_date).format("YYYY-MM-DD")
            
    const transactionId = nanoid();
    const transaction = {
        id: transactionId,
        company_id: cstmer.t_company_id,
        cost_center_id: cstmer.t_cost_center_id,
        chart_account_id: cstmer.t_chart_account_id,
        entity_id: cstmer.t_entity_id,
        account_id: cstmer.t_account_id,
        recurrence_template_id: cstmer.t_id,
        type: cstmer.t_type,
        name: cstmer.t_name,
        description: cstmer.t_description,
        forecast_amount: cstmer.t_amount,
        currency_code: "BRL",
        payment_method: "Boleto",
        due_date: cstmer.due_date,
        billing_date: dayjs().format("YYYY-MM-DD")
    }

    const customer = {
        id: cstmer.e_id,
        transaction_id: transactionId,
        name: cstmer.e_name,
        email: email,
        cellphone: cellphone,
        document_value: document_value,
        legal_type: legal_type,
        street: street,
        neighborhood: neighborhood,
        city: city,
        state: state,
        cep: cep,
        due_date: dayjs().add(7, "day").format("YYYY-MM-DD"),
        amount: parseFloat(cstmer.t_amount)
    }

    return {
        transaction,
        customer,
        entity
    }
}

export async function generatePayments(req_body){
    const customers = [];
    const transactions = [];
    const entitiesUpdates = []

    for(const account of req_body){
        if(account.isTransaction){
            const { entity, customer } = await getCustomerDataTransaction(account)
            customer && customers.push(customer)
            entity && entitiesUpdates.push(entity)
        }else{
            const { entity, customer, transaction } = await getCustomerDataRecurrence(account)
            customer && customers.push(customer)
            transaction && transactions.push(transaction)
            entity && entitiesUpdates.push(entity)
        }
    }
    const promises = []
    customers.forEach( customer => {
        const promise = new Promise((resolve, reject) => {
            // BankSlip(customer).then(res => resolve({ voluti: res, customer })).catch(reject)
            resolve({ voluti: {}, customer })
        })
        promises.push(promise)
    })

    // // gerar boletos
    const volutiResponse = await Promise.all(promises)

    const bankSlips = volutiResponse.map( ({ voluti, customer}) => {
        return {
            id: nanoid(),
            transaction_id: customer.transaction_id,
            billing_date: dayjs().format("YYYY-MM-DD"),
            due_date: dayjs().add(7, "day").format("YYYY-MM-DD"),
            url_pdf: voluti.pdf,
            amount: customer.amount
        }
    })

    // lancar contas
    // salvar referia de boleto ao db
    await knex.transaction( async trx => {
        if(transactions.length)
            await trx("financial_scheme.bank_transactions").insert(transactions)
        if(bankSlips.length)
            await trx("financial_scheme.bank_transaction_bank_slips").insert(bankSlips)
            
        const promises = []
        entitiesUpdates.forEach( ent => {
            let id = ent.id
            delete ent.id
            let query = trx("entities").update(ent).where({ id })
            promises.push(query)
        })
        await Promise.all(promises)
    })

    // enviar por email link do boleto
    for(const { voluti, customer } of volutiResponse){
        const subject = "Boleto", 
            body = "teste teste tste"
        
        const templateConfig = {
            title: "",
            subtitle: subject,
            body
        }
        
        await sendMail({}, { email: customer.email, subject, body, attachments: [{ filename: "boleto.pdf", path: voluti.pdf }] })
    }
    
    return bankSlips;
}
function sync(){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 1000);
    })
}
function BankSlip(customer){
    console.log(customer)
    const options = {
        customer: {
            name: 'Ricardo Anzolin',
            email: 'ricardoanzolin@gmail.com',
            phoneNumber: '(46) 98409-8444',
            document: '48808171043',
            description: null,
            type: 'F',
            addressLine1: 'Travessa Bortot',
            addressLine2: null,
            neighborhood: 'Santa Terezinha',
            city: 'Pato Branco',
            state: 'PR',
            postalCode: '85506050',
            countryCode: 'BR'
        },
        type: 'UNIQUE',
        acceptBillet: true,
        acceptPaymentAfterExpiration: false,
        acceptDiscount: false,
        discountLimitDate: 0,
        lateFeeType: 0,
        interestType: 0,
        discountType: 0,
        lateFeeAmount: 0,
        lateFeeStartAt: '2020-10-02T16:31:51.000Z',
        interestAmount: 0,
        interestStartAt: '2020-10-02T16:31:51.000Z',
        discountAmount: 0,
        installments: 1,
        installment: 1,
        frequency: 30,
        paymentLimitDate: 3,
        daysBeforeExpiration: 5,
        amount: 300,
        dueDate: "2022-08-30",
        description: 'Ref. Serviços Prestados.',
        currentInstallmentNumber: 1
    }
    return new Promise((resolve, reject) => {
        sdk.Emissaodeboleto(options)
        .then(resolve)
        .catch(err => {
            console.log(err)
        })
    })
}
// customer: {
//     name: customer.name,
//     email: customer.email,
//     phoneNumber: customer.cellphone,
//     document: customer.document_value,
//     description: null,
//     type: customer.legal_type === "physical_person" ? "F" : "J",
//     addressLine1: customer.street,
//     addressLine2: null,
//     neighborhood: customer.neighborhood,
//     city: customer.city,
//     state: customer.state,
//     postalCode: customer.cep.replace("-", "").replace(".", ""),
//     countryCode: 'BR'
//   },
// type: 'UNIQUE',
// acceptBillet: true,
// acceptPaymentAfterExpiration: false,
// acceptDiscount: false,
// discountLimitDate: 0,
// lateFeeType: 0,
// interestType: 0,
// discountType: 0,
// lateFeeAmount: 0,
// lateFeeStartAt: dayjs().format("YYYY-MM-DD"),
// interestAmount: 0,
// interestStartAt: dayjs().format("YYYY-MM-DD"),
// discountAmount: 0,
// installments: 1,
// installment: 1,
// frequency: 30,
// paymentLimitDate: 3,
// daysBeforeExpiration: 5,
// amount: customer.amount,
// dueDate: customer.due_date,
// description: "",
// currentInstallmentNumber: 1