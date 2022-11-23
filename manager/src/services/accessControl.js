import axios from "./api"


export default function getAccessControl(){
    axios.get("/access-control")
        .then( response => {
            console.log(response.data)
        })
        .catch( error => {
            console.error(error)
        })
}