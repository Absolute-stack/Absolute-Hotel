import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: {
      min: 1,
      max: 5,
      type: Number,
      required: true,
    },
    title: {
      trim: true,
      type: String,
      maxLength: 100,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
      maxLength: 1000,
    },
    response: {
      comment: { type: String, trim: true },
      respondedAt: { type: Date },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

reviewSchema.post("save", async function () {
  await recalculatingRoomRating(this.room);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) await recalculatingRoomRating(doc.room);
});

async function recalculatingRoomRating(roomId) {
  const results = await mongoose.model("Review").aggregate([
    { $match: { room: roomId } },
    {
      $group: {
        _id: "$room",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await mongoose.model("Room").findByIdAndUpdate(roomId, {
    avgRating: results?.[0].avgRating.toFixed(1) ?? 0,
    totalReviews: results?.[0].totalReviews ?? 0,
  });
}
