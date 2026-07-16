import axios from 'axios';

const api = axios.create({
    baseURL: 'https://student-monitoring-system-18yc.onrender.com',
});

export default api;
