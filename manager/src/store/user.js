import { defineStore } from "pinia";
import * as Session from "../auth/Session";

export const useStore = defineStore("user", {
    state: () => ({
        loggedIn: undefined,
        data: {},
    }),
    getters: {
        user : state => state.data,
        token: state => {
            if(state.data) return state.data.token
            else return ""
        }
    },
    actions: {
        refreshToken(accessToken) {
            Session.updateSessionUser({ token: accessToken })
            // state
            this.loggedIn = true;
            this.data.token = accessToken
        },
        startSession(user){
            if(!user) 
                return false;

            // state
            this.loggedIn = true;
            this.data = user;
        },
        closeSession(){
            Session.closeSession();
            // state
            this.loggedIn = false;
            this.data = {}
        },
        updateUser(updates){
            Session.updateSessionUser(updates);
            // state
            Object.entries(updates).forEach( ([ key, value ]) => {
                if(value) this.data[key] = value;
            })
        }
    }
})