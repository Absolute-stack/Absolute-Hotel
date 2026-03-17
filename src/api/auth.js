import { api } from "../lib/axios.js";

export async function registerUser(data) {
  const res = await api.post("/api/auth/register", data);
  return res.data;
}

export async function loginUser(data) {
  const res = await api.post("/api/auth/login", data);
  return res.data;
}

export async function refresh() {
  const res = await api.get("/api/auth/refresh");
  return res.data;
}

export async function logoutUser() {
  const res = await api.delete("/api/auth/logout");
  return res.data;
}

export async function getMe() {
  const res = await api.get("/api/auth/getMe");
  return res.data;
}
