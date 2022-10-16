import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API
})

// Мидлвар на запрос (при любом запросе проверять есть ли токен на авторизацию)
instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default instance