import dayjs from "dayjs"
import { nanoid } from "nanoid"

export function extractDataXml(xml){
    const bankAccountNumber = query(xml,"OFX > BANKMSGSRSV1 > STMTTRNRS > STMTRS > BANKACCTFROM > ACCTID")
    const startDate = query(xml, "OFX > BANKMSGSRSV1 > STMTTRNRS > STMTRS > BANKTRANLIST > DTSTART").replace("[-3:BRT]", "")
    const endDate = query(xml, "OFX > BANKMSGSRSV1 > STMTTRNRS > STMTRS > BANKTRANLIST > DTEND").replace("[-3:BRT]", "")
    const balance = parseFloat(query(xml, "OFX > BANKMSGSRSV1 > STMTTRNRS > STMTRS > LEDGERBAL > BALAMT"))

    const transactionsElements = xml.querySelectorAll("OFX > BANKMSGSRSV1 > STMTTRNRS > STMTRS > BANKTRANLIST > STMTTRN")
    const transactions = Array.from(transactionsElements).map( elem => {
        return {
            uuid: nanoid(),
            type: query(elem, "TRNTYPE").replace("DEBIT", "outflow").replace("CREDIT", "inflow"),
            amount: parseFloat(query(elem, "TRNAMT")),
            created_at: dayjs(query(elem, "DTPOSTED").replace("[-3:BRT]", "")).format("DD/MM/YYYY"),
            fitid: query(elem, "FITID"),
            checknum: query(elem, "CHECKNUM"),
            refnum: query(elem, "REFNUM"),
            description: query(elem, "MEMO"),
            fitidCodeDescription: CodesFITID(parseInt(query(elem, "FITID").split("").splice(12, 7).join("")))
        }
    })
    return {
        bank_number: bankAccountNumber,
        start_date: dayjs(startDate).format("YYYY-MM-DD"),
        end_date: dayjs(endDate).format("YYYY-MM-DD"),
        closing_balance: balance,
        ofx_transactions: transactions
    }
}

function query(elem, query){
    const node = elem.querySelector(query)
    return node ? node.textContent : ""
}
function CodesFITID(FITID){
    let fitid;
    switch(FITID){
        case 2002001:
            fitid = "Recebimento de cobrança boleto e lâmina"
        break
        case 1001002:
            fitid = "Tarifa intermediação cartão de crédito"
        break
        case 2001002:
            fitid = "Estorno intermediação cartão de crédito"
        break
        case 2002002:
            fitid = "Recebimento de cobrança cartão de crédito"
        break
        case 1002002:
            fitid = "Devolução cartão de crédito"
        break
        case 1001001:
            fitid = "Tarifa intermediação boleto e lâmina"
        break
        case 2009001:
            fitid = "Bônus intermediação"
        break
        case 1013001:
            fitid = "Devolução boleto - Débito da devolução"
        break
        case 2013001:
            fitid = "Devolução boleto - Crédito da devolução"
        break
        case 2002046:
            fitid = "Repasse pagamento marketplace boleto"
        break
        case 1001046:
            fitid = "Tarifa repasse marketplace boleto"
        break
        case 1002046:
            fitid = "Devolução de repasse marketplace boleto"
        break
        case 2002047:
            fitid = "Repasse pagamento marketplace cartão"
        break
        case 1001047:
            fitid = "Tarifa repasse marketplace cartão"
        break
        case 1002047:
            fitid = "Devolução de repasse marketplace cartão"
        break
        case 1003004:
            fitid = "Pagamento via código de barras"
        break
        case 1001004:
            fitid = "Tarifa pagamento via código de barras"
        break
        case 2002017:
            fitid = "Estorno pagamento via código de barras - Estorno por parte do banco ou análise"
        break
        case 1002025:
            fitid = "Pagamento via código de barras - Débito para sinalizar saldo insuficiente (agendamento)"
        break
        case 2002026:
            fitid = "Estorno pagamento via código de barras - Crédito para sinalizar saldo insuficiente (agendamento)"
        break
        case 1002003:
            fitid = "Transferência - Transferência TED; ou entre contas Gerencianet; ou por e-mail"
        break
        case 1001003:
            fitid = "Tarifa transferência"
        break
        case 2002016:
            fitid = "Estorno transferência - Estorno por parte do banco ou análise"
        break
        case 2002045:
            fitid = "Estorno transferência - Crédito da transferência cancelada pelo cliente"
        break
        case 2004003:
            fitid = "Estorno transferência - Crédito da tarifa da transferência cancelada pelo cliente"
        break
        case 2002003:
            fitid = "Transferência entre contas Gerencianet - Crédito da transferência Gerencianet da conta destino"
        break
        case 1003021:
            fitid = "Recarga celular"
        break
        case 2004021:
            fitid = "Estorno recarga celular"
        break
        case 2002044:
            fitid = "Pagamento aprovado cartão, boleto e lâmina"
        break
        case 1002044:
            fitid = "Pagamento enviado cartão, boleto e lâmina"
        break
        case 2002013:
            fitid = "Crédito manual"
        break
        case 1002013:
            fitid = "Débito manual"
        break
        case 1001048:
            fitid = "Tarifa de inatividade"
        break
        case 1001014:
            fitid = "Tarifa depósito"
        break
        default:
            fitid = "";
    }

    return fitid
}