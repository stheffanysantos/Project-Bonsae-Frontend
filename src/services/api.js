import axios from 'axios';

const api = axios.create({
    baseURL: 'https://bonsaeb-production-d6a0.up.railway.app/',
    timeout: 5000,
})

export default api;