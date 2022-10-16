import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:4444'
})

// Мидлвар на запрос (при любом запросе проверять есть ли токен на авторизацию)
instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default instance