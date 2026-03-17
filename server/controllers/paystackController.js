import "dotenv/config";
import crypto from "crypto";
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
    const response = await axios.post(
      `${PAYSTACK_BASE}/transaction/initialize`,
      {
        email: booking?.customer?.email,
        amount: booking.totalPrice * 100,
        callback_url: `${process.env.CLIENT_URL}/order-confirmation?reference=${reference}`,
        metadata: {
          name: booking.customer?.name,
          email: booking.customer?.email,
          phone: booking.customer?.phone,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          nights: Math.ceil(
            new Date(booking.checkOut) -
              new Date(booking.checkIn) / (24 * 60 * 60 * 1000),
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

    await Booking.findByIdAndUpdate(bookingId, {
      paystackReference: reference,
    });

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
  try {
    const signature = req.headers["x-paystack-signature"];
    const expectedSignature = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature)
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    const event = JSON.parse(req.body.toString());

    if (event.event === "charge.success") {
      const { reference } = event.data;
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
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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
