import { defineStore } from "pinia"
import axios from "@/services/api"

export const useStore = defineStore("cloud", {
    state: () => ({
        parentFolder: {},
        childrenFolder: [],
        favorites: [],
        error: "",
        isLoading: false
    }),
    actions: {
        async fetchDirectory(ObjectQuery){
            this.isLoading = true;
            this.error = "";
            this.parentFolder =  {} 
            this.childrenFolder = []
            this.favorites = []

            const query = new URLSearchParams(ObjectQuery).toString();
            const cloudUrl = `/cloud/directory?${ query }`
            const favoritesUrl = `/cloud/directory/favorites?${ query }`;

            try {
                const promises = []

                promises.push(axios.get(cloudUrl))
                
                if(ObjectQuery.path.split(".").length === 1)
                    promises.push(axios.get(favoritesUrl))

                const [ cloud, favorites ] = await Promise.all(promises)

                // LIST FOLDER
                this.parentFolder = cloud.data.parentFolder
                this.childrenFolder = cloud.data.children

                if(favorites)
                    this.favorites = favorites.data

            } catch (error) {
                console.error(error)
                this.error = error
            }finally{
                this.isLoading = false
            }
        },
        async searchFolderAndFiles(ObjectQuery){
            const query = new URLSearchParams(ObjectQuery).toString();
            const url = `/cloud/directory/search?${ query }`

            this.isLoading = true;
            this.error = "";
            this.parentFolder =  {} 
            this.childrenFolder = []
            this.favorites = []

            try {
                const { data } = await axios.get(url)
                // SEARCH FOLDERS AND FILE
                if(Array.isArray(data)){
                    this.parentFolder =  {} 
                    this.childrenFolder = data
                }
            } catch (error) {
                this.error = error
            } finally {
                this.isLoading = false
            }
        },
        
        // favorites
        addInFavorites(folderOrFile){
            this.favorites.push(folderOrFile)
        },
        removeFromFavorites(folderOrFile){
            this.favorites = this.favorites.filter( item => {
                if(item.id !== folderOrFile.id) return item
            })
        },

        // folder
        addFolder(folder){
            let lastFolderIndex = 0;
            this.childrenFolder.forEach( (item, i) => {
                if(item.folder_name) lastFolderIndex = i
            })
            this.childrenFolder.splice(lastFolderIndex + 1, 0, folder)
        },
        // files
        addFile(file){
            this.childrenFolder.push(file)
        },

        // favorites, folder or file
        editItem(folderOrFile){
            this.childrenFolder = this.childrenFolder.map( item => {
                if(item.id === folderOrFile.id)
                    return folderOrFile;
                else 
                    return item;
            })
        },
        removeItem(folderOrFile){
            this.childrenFolder = this.childrenFolder.filter( item => {
                if(item.id !== folderOrFile.id) return item
            })
        }
    }
})