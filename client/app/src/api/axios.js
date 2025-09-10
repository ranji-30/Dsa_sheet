import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change to AWS backend later
});

export default API;
