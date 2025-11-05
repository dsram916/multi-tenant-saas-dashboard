import axios from 'axios';
axios.defaults.withCredentials = true;

// --- FINAL CONNECTION LOGIC ---
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005'; 
// It will use the Vercel ENV variable in production, or localhost in dev.

export default axios.create({
  // In production, Vercel frontend connects to the full API_URL
  baseURL: import.meta.env.PROD ? API_URL + '/api' : '/api', 
});