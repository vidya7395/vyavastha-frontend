import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Update this with your backend URL
  withCredentials: true, // Ensures cookies (JWT) are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
