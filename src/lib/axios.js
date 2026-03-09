import "dotenv/config";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

let failedQueue = [];
let isRefreshing = false;
