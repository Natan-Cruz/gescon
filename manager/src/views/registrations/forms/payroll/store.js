import { defineStore } from "pinia"
import axios from "@/services/api"
import _ from "lodash"
import { notify } from "@kyvg/vue3-notification";

export const useStore = defineStore("payroll", {
    state: () => ({
        isLoading: false,
        error: "",
        employees: [],
        employeesSelecteds: [],
        payroll: {},
        form: {}
    }),
    actions: {
        async fetch(payroll_id){
            this.isLoading = true;
            this.error = "";

            try {
                const promises = []

                promises.push(this.fetchEmployees())

                if(payroll_id) promises.push(this.fetchPayroll(payroll_id))

                await Promise.all(promises)
                
            } catch (error) {
                console.error(error)
                this.error = error;
            } finally {
                this.isLoading = false;
            }
        },
        async fetchEmployees(){
            const { data } = await axios.get("/registrations/employees-with-items")
            this.employees = data;
        },
        async fetchPayroll(payroll_id){
            const { data } = await axios.get("/financial/payroll/" + payroll_id)
            this.payroll = JSON.parse(JSON.stringify(data));

            Object.entries(data).forEach(([ key, value ]) => {
                this.form[key] = value
            })

            const employeesIds = data.transactions.map( trx => trx.employee_id ).filter(function (a) {
                return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
            }, Object.create(null))

            this.employeesSelecteds = employeesIds
        },
        async createPayroll(){
            this.isLoading = true;
            this.error = ""
            try {
                await axios.post("/financial/payroll", this.form)

                notify({
                    title: "Salvo com sucesso!!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                this.error = error;
            } finally {
                this.isLoading = false;
            }
        },
        async editPayroll(){
            this.isLoading = true;
            this.error = ""
            try {
                const alterations = _.differenceWith(Object.entries({ ...this.form }), Object.entries({ ...this.payroll }),  _.isEqual);

                if(!alterations.length)
                    return notify({
                        title: "Nenhuma alteração foi feita!!",
                        type: "warn",
                        duration: 5000
                    })
                const body = {
                    id: this.payroll.id
                }
                alterations.forEach(([ key, value ]) => {
                    body[key] = value
                })
                await axios.put("/financial/payroll", body)

                notify({
                    title: "Editado com sucesso!!",
                    type: "success",
                    duration: 5000
                })
            } catch (error) {
                console.error(error)
                this.error = error;
            } finally {
                this.isLoading = false;
            }
        }
    }
})