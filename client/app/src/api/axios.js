import axios from "axios";

const API = axios.create({
  baseURL: "https://dsa-sheet-8g1e.onrender.com/api", // change to AWS backend later
});

export default API;
