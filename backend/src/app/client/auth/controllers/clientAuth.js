// import * as modelsUser from "../models/user";
// import * as modelsAuth from "../models/userAuth"
// import * as jwt from "../utils/utils"
// import GesconError from "../../../../utils/GesconError";
// import logger from "../../../../utils/logger";

export async function sendResetTokenToUserEmail( req, res ){
    const { email } = req.body;
    try{
        const user = await modelsUser.searchUserByEmail(email)

        if(!user)
            throw new GesconError("Conta não encontrada")

        const token = await modelsAuth.generateAndSaveToken(user.id, email)

        await modelsAuth.sendResetTokenToUserEmail(email, `${user.firstName} ${user.lastName}`, token)

        res.status(200).send("Email enviado!")
    } catch (error) {
        logger.error(error)
        res.status(400).send({ name: error.name, message: error.message })
    }
}

export async function verifyToken( req, res ){
    const { token } = req.body;
    try {
        const has = await modelsAuth.verifyHasTokenInDatabase(token)
        if(!has){
            logger.info("Token invalido")
            return res.status(200).send({ tokenIsValid: false, user: {}, msg: "Token inválido" })
        }

        const decoded = await jwt.verifyToken(token)

        res.status(200).send({ tokenIsValid: true , user: { id: decoded.id, email: decoded.email }})
    } catch (error) {
        logger.error(error)
        res.status(400).send({ name: error.name, message: error.message })
    }
}

export async function resetPassword( req, res ){
    const { token, password, repeatedPassword } = req.body;
    try {
        // Verfica se as duas senhas sao iguais
        if(password !== repeatedPassword)
            throw new GesconError("Senha não são iguais!");

        // Verfica se token e valido
        const has = await modelsAuth.verifyHasTokenInDatabase(token)
        if(!has)
            throw new Error("Token inválido")
        
        // Descodifica token
        const decoded = await jwt.verifyToken(token)
        // Efetivamente edita usuario
        const user = await modelsUser.changeUserPassword(decoded.id, password, token)

        user.data.token = jwt.generateToken({ id: user.id });

        res.send(user)
    } catch (error) {
        logger.error(error)
        res.status(400).send({ name: error.name, message: error.message })
    }
}