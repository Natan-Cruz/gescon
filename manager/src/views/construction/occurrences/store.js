import { defineStore } from "pinia";

export const useStore = defineStore("occurrences", {
    state: () => ({
        newOccurrences: [],
        pendingOccurrences: [],
        occurrencesInProgress: [],
        resolvedOccurrences: []
    }),
})