import secureStorage from "./Auth";
const SESSION_KEY = "user",
    SESSION_VERSION_KEY = "session_version",
    SESSION_VERSION = "8.0";

export function changeDrive(param){
    let drive;
    switch(param){
    case 1: 
        drive = window.sessionStorage; break
    case 2:
        case 3:
        case 4:
        case 5:
            drive = window.localStorage; break
    default:
        drive = window.localStorage;
    }
    secureStorage.changeStorage(drive, SESSION_KEY)
}

export function checkSession(){
    let sessionConfigurations = localStorage.getItem(SESSION_VERSION_KEY)
    let sessionDuration = localStorage.getItem("session_preference")

    if(!sessionConfigurations) 
        return false;

    sessionConfigurations = JSON.parse(sessionConfigurations)

    if(sessionConfigurations.version !== SESSION_VERSION){
        return false
    }

    let time;
    switch(sessionDuration){
        case "2": time = 8.64e+7; break // one day
        case "3": time = 6.048e+8; break // one week
        case "4": time = 2.628e+9; break // one month
    }

    if(new Date().getTime() > sessionConfigurations.started_in + time && (sessionDuration === "2" || sessionDuration === "3")){
        // secureStorage.removeItem(SESSION_KEY)
        return false
    }

    return true
}

// return authorization header with jwt token
export function getSession() {
    let user = secureStorage.getItem(SESSION_KEY)
    return user || undefined
}

export function startSession(user){
    secureStorage.setItem(SESSION_KEY, user)
    localStorage.setItem(SESSION_VERSION_KEY, JSON.stringify({
        version: SESSION_VERSION,
        started_in: new Date().getTime(),
    }))
}

export function closeSession(){
    secureStorage.removeItem(SESSION_KEY)
}

export function updateSessionUser(updates){
    let user = secureStorage.getItem(SESSION_KEY);
    Object.entries(updates).forEach( ([ key, value ]) => {
        user[key] = value;
    })
    secureStorage.setItem(SESSION_KEY, user)
}

export function getLocalRefreshToken() {
    const user = secureStorage.getItem(SESSION_KEY);

    if(user){
        return user.refreshToken
    }else{
        return undefined
    }
}

export function getLocalAccessToken(){
    const user = secureStorage.getItem(SESSION_KEY)
    if(user)
        return user.token
    else    
        return undefined
}

