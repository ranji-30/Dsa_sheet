import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL||'https://dsa-sheet-22k2.onrender.com/api', // picks dev or prod
});
export default API;
