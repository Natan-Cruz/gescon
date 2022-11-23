import ACTIONS from "./events.json";
import dayjs from "dayjs";

export function formatLogs(logs){
    return logs.map( log => {
        if(ACTIONS.OPEN_REPORT === log.action)
            log.action = "Aberto";

        if(ACTIONS.CLOSE_REPORT === log.action)
            log.action = "Fechado";

        if(ACTIONS.REOPEN_REPORT === log.action)
            log.action = "Reaberto";

        if(ACTIONS.DELETE_REPORT === log.action)
            log.action = "Deletado";

        return log
    })
}

export function formatFiles(files){
    const photos = [], videos = [], documents = [];

    files.forEach( file => {
        // image/jpeg ---> [ "image", "jpeg" ]
        const path = file.fileType.split('/')
        if(path[0] === "image")
            photos.push(file);
        else
        if(path[0] === "video")
            videos.push(file)
        else
            documents.push(file)
    })

    return {
        photos,
        videos,
        documents
    }
}

export function isNewDay(lastReportDate){
    const lastDate = dayjs(lastReportDate),
        nowDate = dayjs();

    const last = {
        day: lastDate.get("date"),
        month: lastDate.get("month"),
        year: lastDate.get("year")
    },
    now = {
        day: nowDate.get("date"),
        month: nowDate.get("month"),
        year: nowDate.get("year")
    }
    
    if(now.year < last.year) return false

    if(now.day > last.day && now.month === last.month)
        return true

    if(now.day < last.day && now.month > last.month)
        return true
}