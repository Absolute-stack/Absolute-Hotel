import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    guests: {
      min: 1,
      type: "Number",
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "complete", "cancelled", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    specialRequest: {
      type: String,
      trim: true,
    },
    paystackReference: {
      type: String,
      sparse: true,
      unique: true,
    },
  },
  { timestamps: true },
);

bookingSchema.index({ paymentStatus: 1, status: 1 });
bookingSchema.index({ "customer.userId": 1, createdAt: -1 });
bookingSchema.index({ "customer.email": 1, createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);
