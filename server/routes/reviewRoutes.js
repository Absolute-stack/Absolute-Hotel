import express from "express";
import {
  createReview,
  getRoomReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewControllers.js";
import { protect, adminProtect, optionalAuth } from "../middleware/protect.js";

export const reviewRouter = express.Router();

reviewRouter.post("/create", protect, createReview);
reviewRouter.get("/room-reviews/:roomId", optionalAuth, getRoomReviews);
reviewRouter.patch("/update/:id", protect, updateReview);
reviewRouter.delete("/delete/:id", protect, deleteReview);
