import "dotenv/config";
import cors from "cors";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import passport from "./middleware/passport.js";
import { connectDB } from "./config/connectDB.js";
import { authRouter } from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 7000;

app.use(
  cors({
    origin: "http://localhost:7000",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

await connectDB();
app.use(passport.initialize());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  return res.status(200).send("API is working...");
});

app.listen(PORT, () => console.log(`API running on PORT:${PORT}...`));
