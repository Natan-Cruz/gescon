import jwt, { decode } from "jsonwebtoken";
import authConfig from "../config/auht.json";

export default (req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader) 
        return res.status(401).send({ error: "No token provided" });

    const parts = authHeader.split(" ");

    if(!parts.length === 2)
        return res.status(401).send({ error: "Token error " });

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: "Token malformatted" });

    jwt.verify(token, authConfig.secret, (err,decoded) => {
        if(err) return res.status(401).send({ error: "Token invalid" });
        // temporario, remover posteriormente!
        req.defaultParams = {
            company_id: decoded.company_id,
            user_id: decoded.id || decoded.user_id,
            user_is_admin: decoded.user_is_admin,
            ip: req.ip,
        }
        req.userId = decoded.id || decoded.user_id;
        req.company_id = decoded.company_id;
        req.user_id = decoded.id || decoded.user_id;
        req.user_is_admin = decoded.user_is_admin;
        return next();
    })
}