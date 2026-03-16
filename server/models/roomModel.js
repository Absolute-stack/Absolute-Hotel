import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    roomNumber: {
      trim: true,
      unique: true,
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["single", "double", "suite", "penthouse"],
      default: "single",
    },
    price: {
      min: 0,
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    images: [{ type: String }],
    amenities: [{ type: String }],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

roomSchema.index({ isAvailable: 1 });
roomSchema.index({ type: 1, price: 1 });
roomSchema.index({ createdAt: -1, _id: -1 });
roomSchema.index({ avgRating: 1, totalReviews: 1 });

export const Room = mongoose.model("Room", roomSchema);
