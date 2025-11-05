import axios from 'axios';
axios.defaults.withCredentials = true;

// --- CRITICAL DEPLOYMENT CHANGE ---
// Use the final, live domain for your API backend
const API_URL = 'https://multi-tenant-saas-dashboard.onrender.com'; // **REPLACE THIS WITH YOUR ACTUAL DEPLOYED API URL**

export default axios.create({
  // Local development will still proxy correctly through Vite.
  // For Vercel/Production, the full URL is required.
  baseURL: import.meta.env.PROD ? API_URL + '/api' : '/api', 
});