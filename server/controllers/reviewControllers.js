import { Booking } from "../models/bookingModel.js";
import { Review } from "../models/reviewModel.js";

// @desc create a review
// @route POST /api/review/create
// @access adminProtect
export async function createReview(req, res) {
  try {
    const { bookingId, title, comment, rating } = req.body;
    if (!bookingId)
      return res.status(400).json({
        success: false,
        message: "Booking needed to write a review",
      });
    const booking = await Booking.findById(bookingId).populate(
      "customer.userId",
      "name image",
    );
    if (!booking)
      return res.status(400).json({
        success: false,
        message: "Booking not found",
      });

    if (booking.status !== "completed")
      return res.status(400).json({
        success: false,
        message: "Need to complete stay to leave a review",
      });
    const review = await Review.create({
      user: req.user.id,
      room: booking.room,
      booking: bookingId,
      title,
      comment,
      rating,
    });
    return res.status(200).json({
      review,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc get room reviews
// @route GET /api/review/room-reviews
// @access optionalAuth
export async function getRoomReviews(req, res) {
  try {
    const { limit = 10, cursor } = req.query;
    const limitNum = Math.min(Number(limit), 50);

    const filter = { room: req.params.roomId };
    if (cursor) filter._id = { $lt: cursor };

    const reviews = await Review.find(filter)
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .limit(limitNum + 1)
      .lean();
    const hasNextPage = reviews.length > limitNum;
    if (hasNextPage) reviews.pop();
    const nextCursor = hasNextPage ? reviews[reviews.length - 1]._id : null;
    return res.status(200).json({
      reviews,
      nextCursor,
      hasNextPage,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc update review
// @route GET /api/review/update/:id
// @access protect
export async function updateReview(req, res) {
  try {
    const { title, comment, rating } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, {
      title,
      comment,
      rating,
    }).populate("user", "name image");
    if (!review)
      return res.status(400).json({
        success: false,
        message: "Review not found",
      });

    return res.status(200).json({
      review,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc delete review
// @route GET /api/review/delete/:id
// @access protect
export async function deleteReview(req, res) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review)
      return res.status(400).json({
        success: false,
        message: "Review not found",
      });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
