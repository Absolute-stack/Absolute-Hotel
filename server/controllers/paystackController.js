import "dotenv/config";
import crypto from "crypto";
import axios from "axios";
import { Booking } from "../models/bookingModel.js";
import { markOrderAsPaid } from "./bookingController.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const PAYSTACK_BASE = process.env.PAYSTACK_BASE;

// @desc initializePayment with paystanc
// @route GET /api/paystack/initialize
// @access optionalAuth
export async function initializePayment(req, res) {
  try {
    const { bookingId } = req.body;
    if (!bookingId)
      return res.status(400).json({
        success: false,
        message: "BookingId is required to initialize payment",
      });

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(400).json({
        success: false,
        message: "Booking not found",
      });
    if (booking.paymentStatus === "paid")
      return res.status(200).json({
        success: true,
        message: "Already paid",
        reference: booking.paystackReference,
      });

    const reference = `booking_${booking._id}_${Date.now()}`;

    await Booking.findByIdAndUpdate(bookingId, {
      paystackReference: reference,
    });

    const response = await axios.post(
      `${PAYSTACK_BASE}/transaction/initialize`,
      {
        email: booking?.customer?.email,
        amount: booking.totalPrice * 100,
        reference,
        callback_url: `http://localhost:9000/booking-confirmation?reference=${reference}`,
        metadata: {
          name: booking.customer?.name,
          email: booking.customer?.email,
          phone: booking.customer?.phone,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          nights: Math.ceil(
            (new Date(booking.checkOut) - new Date(booking.checkIn)) /
              (24 * 60 * 60 * 1000),
          ),
          totalPrice: booking.totalPrice,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      },
    );

    return res.status(200).json({
      success: true,
      reference,
      authorizationURL: response.data.data.authorization_url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// @desc webhook verification with paystank
// @route GET /api/paystack/webhook
// @access Public
export async function paystackWebhook(req, res) {
  const signature = req.headers["x-paystack-signature"];

  const expectedSignature = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(req.body)
    .digest("hex");

  // ✅ Always respond early
  if (signature !== expectedSignature) {
    return res.sendStatus(200);
  }

  const event = JSON.parse(req.body.toString());

  // ✅ Respond immediately
  res.sendStatus(200);

  // 🔥 Process in background
  try {
    if (event.event === "charge.success") {
      const { reference } = event.data;
      console.log("Webhook reference:", reference); // ← what does this print?
      console.log("Expected format:", "booking_..._...");

      const verify = await axios.get(
        `${PAYSTACK_BASE}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
          },
        },
      );

      const transaction = verify.data.data;

      if (transaction.status === "success") {
        await markOrderAsPaid(reference);
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
  }
}

// @desc verifyPayment with paystank
// @route GET /api/paystack/verify
// @access optionalAuth
export async function verifyPayment(req, res) {
  try {
    const { reference } = req.query;
    if (!reference)
      return res.status(400).json({
        success: false,
        message: "Payment verification requires reference",
      });
    const booking = await Booking.findOne({ paystackReference: reference });
    return res.status(200).json({
      success: true,
      paid: booking.paymentStatus === "paid",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
