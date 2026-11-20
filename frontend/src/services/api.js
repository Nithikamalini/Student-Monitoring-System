import axios from 'axios';

// In local development, use relative URL so Vite proxy forwards to localhost:5001.
// In production (Vercel), automatically point to your live Render backend!
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://student-monitoring-system-4se9.onrender.com');

const api = axios.create({
    baseURL: API_URL,
});

export default api;
