import axios from "axios"
const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? "https://gescon-tec.herokuapp.com/erp/" : "http://192.168.1.6:3000/erp/",
})

export default instance;