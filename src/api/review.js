import { api } from "../lib/axios.js";

export async function createReview(data) {
  const res = await api.post("/api/review/create", data);
  return res.data;
}

export async function fetchReviews(roomId) {
  const res = await api.get(`/api/review/room-reviews/${roomId}`);
  return res.data;
}
