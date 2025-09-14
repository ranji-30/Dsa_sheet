import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL||'https://dsa-sheet-9q0f.onrender.com/', // picks dev or prod
});
export default API;
