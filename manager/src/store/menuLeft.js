import { defineStore } from "pinia"

function setMenuState(menuState = 0){
    localStorage.setItem("menu_left", menuState)
}

function getMenuState(){
    return localStorage.getItem("menu_left")
}

export const useStore = defineStore("menuLeft", {
    state: () => ({
        isOpen: false,
        isExpanded: false
    }),
    actions: {
        open(){
            // commit("history/push", { name: "menu_left_open", fn: () => dispatch("TO_CLOSE")}, { root: true })
            this.isOpen = true;
        },
        close(){
            // commit("history/remove", "menu_left_open", { root: true })
            this.isOpen = false
        },
        expandOrShrink(){
            this.isExpanded = !this.isExpanded
            setMenuState(this.isExpanded ? 1 : 0)
        },
        setDefault(){
            const menuState = getMenuState()
            this.isExpanded = parseInt(menuState) === 1 ? true : false
        }
    }
})