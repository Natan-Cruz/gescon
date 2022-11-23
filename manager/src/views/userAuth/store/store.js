import { defineStore } from "pinia"
import axios from "@/services/api"
import { handleErrorAxios } from "../../../Utils/index.js"

export const useStore = defineStore("userAuth", {
    state: () => ({
        user: {
            identifier: "",
            password: "",
            type: ""
        },
        errorMsg: "",
        isLoading: false
    }),
    actions: {
        async authenticate(callback){
            if(!this.user.identifier)
                return this.errorMsg = "Identificador não pode ser vazio!"

            if(!this.user.password)
                return this.errorMsg = "Senha não pode ser vazia!"

            this.errorMsg = ""
            this.isLoading = true;
            
            const url = "/users/authenticate";

            try {
                const { data } = await axios.post(url, { identifier: this.user.identifier, password: this.user.password, type: this.user.type })
                callback(data)
            } catch (error) {
                this.errorMsg = handleErrorAxios(error);
            } finally {
                this.isLoading = false
            }
        }
    }
})