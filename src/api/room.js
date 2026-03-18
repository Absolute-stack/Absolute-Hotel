import { api } from "../lib/axios.js";

function getApi() {
  if (typeof window === "undefined") {
    return `http://localhost:7000`;
  } else {
    return import.meta.env.VITE_API_URL;
  }
}

export async function fetchRooms(filters = {}, pageParam) {
  const params = new URLSearchParams();
  if (pageParam) params.set("cursor", pageParam);
  params.set("limit", filters.limit || "20");
  if (filters.type) params.set("type", filters.type);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.capacity) params.set("capacity", filters.capacity);
  if (filters.checkIn) params.set("checkIn", filters.checkIn);
  if (filters.checkOut) params.set("checkOut", filters.checkOut);

  const res = await fetch(`${getApi()}/api/room/all?${params}`);
  if (!res.ok) throw new Error("Fetching rooms failed");

  return res.json();
}

export async function fetchRoomFilters() {
  const res = await fetch(`${getApi()}/api/room/room-filters`);
  if (!res.ok) throw new Error("Error fetching room filters");
  return res.json();
}

export async function checkRoomAvailability(id, checkIn, checkOut) {
  const res = await api.get(
    `/api/room/check/${id}?checkIn=${checkIn}&checkOut=${checkOut}`,
  );
  return res.data;
}

export async function fetchRoomDetails(id) {
  const res = await fetch(`${getApi()}/api/room/${id}`);
  if (!res.ok) throw new Error("Error fetching room");
  return res.json();
}
