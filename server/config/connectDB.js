import "dotenv/config";
import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.connection.on("connected", () =>
      console.log(`MongoDB connected successfully`),
    );
    await mongoose.connect(process.env.DB);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "MongoDB connection error",
    });
  }
}
