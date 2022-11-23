import { defineStore } from "pinia";
import axios from "@/services/api";
import { useStore as useUserStore } from './user'

const TEN_MINUTES = 1000 * 60 * 10;
const ONE_MINUTE = 1000 * 60;
const TRY_LIMIT = 3

export const useStore = defineStore("accessControl", {
    state: () => ({
        data: {},
        isLoading: false,
        error: "",
        intervalId: undefined,
        errorCount: 0
    }),
    actions: {
        async fetchInitial(){
            const user = useUserStore();
            if(!user.loggedIn) return;
            
            this.isLoading = true;
			this.error = ""
            
            console.info("INITIAL FETCH")

			try {
				const { data } = await axios.get("/access-control")
				this.data = data;
			} catch (error) {
                setTimeout(() => this.error = error, 500);
			} finally {
                setTimeout(() => this.isLoading = false, 500);
			}

            this.intervalId = setInterval(this.backgroundFetch, TEN_MINUTES)
        },
        async backgroundFetch(){
            console.info("BACKGROUND FETCH")
			try {
				const { data } = await axios.get("/access-control")
				this.data = data
                this.errorCount = 0
			} catch (error) {
                if(this.errorCount < TRY_LIMIT)
                    setTimeout(this.backgroundFetch, ONE_MINUTE)

                this.errorCount += 1
			}
        },
        viewer(moduleName){
            if(moduleName === undefined || !moduleName || this.data.is_admin) 
                return true

            const manager = this.data.manager
            if(!manager || !manager.length)  return false
            let show = false;

            if(Array.isArray(moduleName)){
                moduleName.forEach( mName => {
                    if(show) return;
                    show = manager.findIndex( permission => permission === mName ) > -1
                })
            }else{
                show = manager.findIndex( permission => permission === moduleName ) > -1
            }

            return show
            
        },
        set(accessControl){
            this.data = accessControl;
        }
    }
})