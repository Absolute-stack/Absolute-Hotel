import express from "express";
import {
  createBooking,
  getAllBookings,
  updateBooking,
  deleteBooking,
  getBooking,
  guestLookup,
  getMyBookings,
} from "../controllers/bookingController.js";
import { protect, adminProtect, optionalAuth } from "../middleware/protect.js";

export const bookingRouter = express.Router();

bookingRouter.post("/create", optionalAuth, createBooking);
bookingRouter.get("/all", adminProtect, getAllBookings);
bookingRouter.get("/bookings", protect, getMyBookings);
bookingRouter.get("/guest-lookup", optionalAuth, guestLookup);
bookingRouter.get("/:id", protect, getBooking);
bookingRouter.patch("/update/:id", adminProtect, updateBooking);
bookingRouter.delete("/delete/:id", adminProtect, deleteBooking);
