import winston from "winston";
import "winston-mongodb";
import config from "../config/database.mongodb.json";
const uri = `mongodb+srv://${ config.username }:${ config.password }@cluster0.kvo35.mongodb.net/logs?retryWrites=true&w=majority`;

const errorOptions = {
        level: "error",
        db: uri,
        collection: "errors",
        name: "errors",
    },
    infoOptions = {
        level: "info",
        db: uri,
        collection: "infos",
        name: "infos"
    }

// { 
//     emerg: 0, 
//     alert: 1, 
//     crit: 2, 
//     error: 3, 
//     warning: 4, 
//     notice: 5, 
//     info: 6, 
//     debug: 7
// }

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.MongoDB(errorOptions),
        new winston.transports.MongoDB(infoOptions),
    ]
})

if(process.env.NODE_ENV !== "production"){
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}

export default logger;