import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL||'https://dsa-sheet-9e4r.onrender.com/api', // picks dev or prod
});
export default API;
