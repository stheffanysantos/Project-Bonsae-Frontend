import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dae2-2804-14c-4384-8657-00-1045.ngrok-free.app',
    timeout: 5000,
})

export default api;