export default class LocalStorageBoolean{
    constructor(keyName){
        if(!keyName) throw new Error("Defina a chave de armazenamedo do LocalStorageBoolean")

        this.keyName = keyName
    }

    getState(){
        const result = localStorage.getItem(this.keyName)
        return result && result === "1"
    }
    setTrue(){
        localStorage.setItem(this.keyName, "1")
    }
    setFalse(){
        localStorage.setItem(this.keyName, "0")
    }
    reset(){
        localStorage.removeItem(this.keyName)
    }
}