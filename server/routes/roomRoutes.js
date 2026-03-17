import express from "express";
import {
  getAllRooms,
  getRoomFilters,
  getRoom,
  checkAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { protect, adminProtect, optionalAuth } from "../middleware/protect.js";

export const roomRouter = express.Router();

roomRouter.get("/all", optionalAuth, getAllRooms);
roomRouter.get("/room-filters", optionalAuth, getRoomFilters);
roomRouter.post("/admin/create", adminProtect, createRoom);
roomRouter.get("/check/:id", optionalAuth, checkAvailability);
roomRouter.get("/:id", optionalAuth, getRoom);
roomRouter.patch("/update/:id", adminProtect, updateRoom);
roomRouter.delete("/delete/:id", adminProtect, deleteRoom);
