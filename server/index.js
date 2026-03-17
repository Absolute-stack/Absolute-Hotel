import "dotenv/config";
import cors from "cors";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import passport from "./middleware/passport.js";
import { connectDB } from "./config/connectDB.js";
import { authRouter } from "./routes/authRoutes.js";
import { roomRouter } from "./routes/roomRoutes.js";
import { reviewRouter } from "./routes/reviewRoutes.js";
import { bookingRouter } from "./routes/bookingRoutes.js";
import { paystackRouter } from "./routes/paystackRoutes.js";
import { paystackWebhook } from "./controllers/paystackController.js";

const app = express();
const PORT = process.env.PORT || 8000;

await connectDB();

app.use(
  cors({
    origin: ["http://localhost:9000", "http://localhost:5173"],
    credentials: true,
  }),
);

app.use(
  "/api/paystack/webhook",
  express.raw({ type: "application/json" }),
  paystackWebhook,
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/review", reviewRouter);
app.use("/api/paystack", paystackRouter);

app.get("/", (req, res) => {
  return res.status(200).send("API is working...");
});

app.listen(PORT, () => console.log(`API running on PORT:${PORT}...`));
