import { defineStore } from "pinia"

export const useStore = defineStore("history", {
    state: () => ({
       queue: []
    }),
    actions: {
        push(params){
            this.queue.push(params)
        },
        remove(name){
            this.queue = this.queue.filter( q => {
                if(q.name !== name) return q
            })
        }
    }
})