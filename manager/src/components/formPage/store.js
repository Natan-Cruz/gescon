import { defineStore } from "pinia"

export const useStore = defineStore("form", {
    state: () => ({
        form: {},
        data: {},
        state: [],
        errors: {},
        options: {
            edit_mode: true,
        },
        isLoading: false,
        errorMsg: "",
        fn: null
    }),
    getters: {
        showSaveButton: state => state.options.edit_mode,
        showEditButton: state => !state.options.edit_mode && Object.entries(state.data).length,
        showCancelButton: state => Object.entries(state.data).length && state.options.edit_mode,
        hasData: state => Object.entries(state.data).length > 0 ? true : false,
        editMode: state => !state.options.edit_mode
    },
    actions: {
        pushState(page_name){
            this.state.push({
                pageName: page_name,
                ...this.form
            })
        },
        resetState(){
            this.form = {}
            this.data = {}
            this.errors = {}
            this.isLoading = false;
            this.errorMsg = ""
        },
        resetForm(){
            this.form = {}  
            Object.entries(this.data).forEach(([key, value]) => {
                this.form[key] = value;
            })
        },
        setDefault(fn){
            this.fn = fn
        }
    }
})