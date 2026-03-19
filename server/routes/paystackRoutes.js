import express from "express";
import {
  initializePayment,
  paystackWebhook,
  verifyPayment,
} from "../controllers/paystackController.js";

export const paystackRouter = express.Router();

paystackRouter.post("/initialize", initializePayment);
paystackRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paystackWebhook,
);

paystackRouter.get("/verify", verifyPayment);
