import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1/user/", // Change to your backend URL
  withCredentials: true, // Allows sending cookies
});

export default API;
