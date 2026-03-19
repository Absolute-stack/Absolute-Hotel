import { Room } from "../models/roomModel.js";
import { Booking } from "../models/bookingModel.js";
import { after } from "node:test";

// @desc create booking
// @route POST /api/booking/create
// @access Public optionalAuth
export async function createBooking(req, res) {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      specialRequest,
      guestName,
      guestEmail,
      phone,
    } = req.body;

    const guest = !req.user;
    if (guest && (!guestName || !guestEmail))
      return res.status(400).json({
        success: false,
        message: "Name and email  is required",
      });

    if (!roomId || !checkIn || !checkOut || !guests || !phone)
      return res.status(400).json({
        success: false,
        message: "roomId,checkIn,checkOut,phone,guests are required",
      });

    const room = await Room.findById(roomId);
    if (!room)
      return res.status(400).json({
        success: false,
        message: "Room is required for booking",
      });
    if (room.capacity < guests)
      return res.status(400).json({
        success: false,
        message: `Guests have exceeded maximum room capacity of ${room.capacity}`,
      });
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate)
      return res.status(400).json({
        success: false,
        message: "CheckIn must come before checkOut",
      });

    if (checkInDate < new Date())
      return res.status(400).json({
        success: false,
        message: "CheckIn cant be a past date",
      });

    const overlap = await Booking.findOne({
      room: roomId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { checkIn: { $lte: checkOutDate }, checkOut: { $gte: checkInDate } },
      ],
    });
    if (overlap)
      return res.status(400).json({
        success: false,
        message: "Room not available for that time frame",
      });

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (24 * 60 * 60 * 1000),
    );

    const totalPrice = nights * room.price;
    const customer = {
      userId: guest ? null : req.user.id,
      name: guest ? guestName : req.user.name,
      email: guest ? guestEmail : req.user.email,
      phone,
    };
    const booking = await Booking.create({
      customer,
      room: roomId,
      guests,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      status: "pending",
      paymentStatus: "unpaid",
    });
    return res.status(201).json({
      booking,
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

// @desc retrieve all bookings
// @route Get GET /api/booking/all
// @access adminProtect

export async function getAllBookings(req, res) {
  try {
    const { limit = 10, cursor, status, paymentStatus } = req.query;
    const limitNum = Math.min(Number(limit), 50);

    const filter = {};

    if (status) filter.status = status;
    if (cursor) filter._id = { $lt: cursor };
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const bookings = await Booking.find(filter)
      .populate("room", "name,roomNumber,type,images")
      .sort({ createdAt: -1 })
      .limit(limitNum + 1)
      .lean();

    const hasNextPage = bookings.length > limitNum;
    if (hasNextPage) bookings.pop();

    const nextCursor = hasNextPage ? bookings[bookings.length - 1]._id : null;
    return res.status(200).json({
      bookings,
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

// @desc updateBooking
// @route PATCH /api/booking/update/:id
// @access adminProtect
export async function updateBooking(req, res) {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, {
      status,
      paymentStatus,
    });
    if (!booking)
      return res.status(400).json({
        success: false,
        message: "Booking not found",
      });
    return res.status(200).json({
      booking,
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

// @desc deleteBooking
// @route DELETE /api/booking/delete/:id
// @access adminProtect
export async function deleteBooking(req, res) {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking)
      return res.status(400).json({
        success: false,
        message: "Booking not found",
      });
    return res.status(200).json({
      success: true,
      message: "Booking was successfully deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc get all your bookings history
// @route GET /api/booking/bookings
// @access Protect
export async function getMyBookings(req, res) {
  try {
    const { limit = 10, cursor } = req.query;
    const limitNum = Math.min(Number(limit), 50);

    const filter = { "customer.userId": req.user.id };
    if (cursor) filter._id = { $lt: cursor };

    const bookings = await Booking.find(filter)
      .populate("room")
      .sort({ createdAt: -1 })
      .limit(limitNum + 1)
      .lean();

    const hasNextPage = bookings.length > limitNum;
    if (hasNextPage) bookings.pop();

    const nextCursor = hasNextPage ? bookings[bookings.length - 1]._id : null;
    return res.status(200).json({
      bookings,
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

// @desc guestOrderLookup
// @route GET /api/booking/guest-lookup
// @access optionalAuth

export async function guestLookup(req, res) {
  try {
    const { email, reference } = req.query;
    if (!email || !reference)
      return res.status(400).json({
        success: false,
        message: "Email and reference are needed for guestLookup",
      });
    const booking = await Booking.findOne({
      "customer.email": email,
      "customer.userId": null,
      paystackReference: reference,
    }).populate("room");
    if (!booking)
      return res.status(400).json({
        success: false,
        message: "Booking not found",
      });
    return res.status(200).json({
      booking,
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

// @desc guestOrderLookup
// @route GET /api/booking/booking/:id
// @access protect
export async function getBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking)
      return res.status(400).json({
        success: false,
        message: "Booking not found",
      });
    return res.status(200).json({
      booking,
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

// @desc helper function for paystack webhook

export async function markOrderAsPaid(reference) {
  const booking = await Booking.findOneAndUpdate(
    { paystackReference: reference },
    {
      $set: { paymentStatus: "paid" },
    },
    {
      new: true, // return updated doc
      runValidators: false,
    },
  );

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
}
