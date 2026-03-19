import axios from "axios";
import { getQueryClient } from "./queryClient.js";

export const api = axios.create({
  baseURL: `http://localhost:8000`,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

let failedQueue = [];
let isRefreshing = false;

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

async function silentRefresh() {
  const response = await axios.get(`http://localhost:8000/api/auth/refresh`, {
    withCredentials: true,
  });

  const newToken = response.data.accessToken;

  window.__AUTH_TOKEN__ = newToken;
  const { useStore } = await import("../store/store.js");

  const user = useStore.getState().auth.user;
  if (user) useStore.getState().setAuth(user, newToken);

  return newToken;
}

api.interceptors.request.use(
  (config) => {
    const token = window.__AUTH_TOKEN__;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const tokenExpired =
      error?.response?.status === 401 &&
      error?.response?.data?.message === "Invalid or expired token";

    if (!tokenExpired || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }
    isRefreshing = true;
    originalRequest._retry = true;
    try {
      const token = await silentRefresh();
      window.__AUTH_TOKEN__ = token;
      processQueue(null, token);
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      window.__AUTH_TOKEN__ = null;
      const { useStore } = await import("../store/store.js");
      useStore.getState().clearAuth();
      getQueryClient().clear();
      return Promise.reject(refreshError);
    }
  },
);

export function setAuthToken(token) {
  window.__AUTH_TOKEN__ = token;
}

export function clearAuthToken() {
  window.__AUTH_TOKEN__ = null;
}
