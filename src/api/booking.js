import { api } from "../lib/axios.js";

export async function createBooking(data) {
  const res = await api.post("/api/booking/create-booking", data);
  return res.data;
}

export async function myBookings() {
  const res = await api.get("/api/booking/bookings");
  return res.data;
}

export async function getBooking(id) {
  const res = await api.get(`/api/booking/${id}`);
  return res.data;
}

export async function guestLookup(email, reference) {
  const res = await api.get(
    `/api/booking/guest-lookup?email=${email}&reference=${reference}`,
  );
  return res.data;
}

export async function initializePayment(bookingId) {
  const res = await api.post("/api/paystack/initialize", { bookingId });
  return res.data;
}

export async function verifyPayment(reference) {
  const res = await api.get(`/api/paystack/verify?reference=${reference}`);
  return res.data;
}
