import axios from 'axios';

const api = axios.create({
    baseURL: 'http://bonsaeb-production.up.railway.app/',
    timeout: 5000,
})

export default api;