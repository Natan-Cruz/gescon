import jwt from "jsonwebtoken";
import authConfig from "../../../../config/auht.json";
import GesconError from "../../../../utils/GesconError";

function generateToken(info){
    return jwt.sign(info, authConfig.secret, {
        expiresIn: '365d'
    })
}

function generateTokenForResetPassword(info){
    return jwt.sign(info, authConfig.secret, {
        expiresIn: '1d'
    })
}

function verifyToken(token){
    return new Promise(( resolve, reject ) => {
        if(!token) 
            return reject(new GesconError("Token faltante"))

        jwt.verify(token, authConfig.secret, (err,decoded) => {
            if(err) return reject(new GesconError("Token invalid"));

            return resolve(decoded);
        })
    })
}

export { 
    generateToken,
    generateTokenForResetPassword,
    verifyToken
};