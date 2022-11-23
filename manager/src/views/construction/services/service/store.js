import { defineStore } from "pinia"
import axios from "@/services/api"
// import { useStore as storeUploader } from "@/store/uploader,js"
import { notify } from '@kyvg/vue3-notification';

function orderByDate(a,b){
    return new Date(b.date) - new Date(a.date)
}

export const useStore = defineStore("service", {
    state: () => ({
        isLoading: false,
        error: "",
        form_error: "",
        data: {},
        path_name: ""
    }),
    actions: {
        async fetchService(service_id){
            this.isLoading = true;
            this.error = ""

            try {
                const { data: service } = await axios.get(`/services/sheet/${ service_id }`)
                const { data: pathName } = await axios.get("/financial/cost-center/full-path/" + service.path )
                this.data = service
                this.path_name = pathName
            } catch (error) {
                this.error = error
            } finally {
                this.isLoading = false
            }
        },
        async editService(service){
            this.isLoading = true;
            this.form_error = "";
            try {
                await axios.post("/services/sheet", service)
                Object.entries(service).forEach(([key, value]) => {
                    this.data[key] = value
                })
                notify({
                    title: "Dados alterados!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                this.form_error = error;
            } finally {
                this.isLoading = false
            }
        },
        // production
        async saveProduction(service, callback){
            this.isLoading = true;
            this.form_error = "";
            try {
                const { data } = await axios.post("/services/production-rate", service)
                const response = data[0]
                this.data.productions.push(response)
                this.data.productions = this.data.productions.sort(orderByDate)
                notify({
                    title: "Produção adicionada!",
                    type: "success",
                    duration: 5000
                })
                callback()
            } catch (error) {
                this.form_error = error;
            } finally {
                this.isLoading = false
            }
        },
        async editProduction(service, callback){
            this.isLoading = true;
            this.form_error = "";
            try {
                const { data } = await axios.put("/services/production-rate", service)
                const index = this.data.productions.findIndex( p => p.id === data.id )
                this.data.productions.splice(index, 1, data)
                notify({
                    title: "Produção editada!",
                    type: "success",
                    duration: 5000
                })
                callback()
            } catch (error) {
                this.form_error = error;
            } finally {
                this.isLoading = false
            }
        },
        async deleteProduction(production_id, callback){
            this.isLoading = true;
            this.form_error = "";
            try {
                await axios.delete("/services/production-rate/" + production_id)
                notify({
                    title: "Produção deletada!",
                    type: "success",
                    duration: 5000
                })
                callback()
            } catch (error) {
                this.form_error = error;
            } finally {
                this.isLoading = false
            }
        },
        // check sheet
        async editCheckItem(check_item){
            this.isLoading = true;
            this.form_error = "";
            try {
                const { data } = await axios.put("/services/check-items", check_item)
                const index = this.data.check_items.findIndex( p => p.id === data.id )
                this.data.check_items.splice(index, 1, data)
                notify({
                    title: "Item editado!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                this.form_error = error;
            } finally {
                this.isLoading = false
            }
        },
        editCheckOrUncheckItem(id, checked){
            this.data.check_items = this.data.check_items.map( item => {
                if(item.id === id)
                    return { ...item, checked }

                return item
            })
        }
    }
})