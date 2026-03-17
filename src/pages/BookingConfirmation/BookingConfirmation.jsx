import "./BookingConfirmation.css";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../../api/booking.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { useStore } from "../../store/store.js";

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("loading");
  const user = useStore((state) => state.auth.user);

  useEffect(() => {
    if (!reference) return setStatus("loading");
    checkPayment();
  }, []);

  async function checkPayment(retries = 5) {
    try {
      const { paid } = await verifyPayment(reference);
      if (paid) {
        setStatus("success");
      } else if (retries > 0) {
        setTimeout(() => checkPayment(retries - 1), 2000);
      } else {
        setStatus("failed");
      }
    } catch {
      if (retries > 0) {
        setTimeout(() => checkPayment(retries - 1), 2000);
      } else {
        setStatus("failed");
      }
    }
  }

  return (
    <div className="confirmation-page">
      <Navbar />

      <div className="container confirmation-page__inner">
        {status === "loading" && (
          <div className="confirmation-card">
            <div className="confirmation-spinner">
              <div
                className="spinner"
                style={{ width: 40, height: 40, borderWidth: 3 }}
              />
            </div>
            <p className="display-md">Verifying your payment...</p>
            <p className="confirmation-sub">
              Please wait while we confirm your booking.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="confirmation-card confirmation-card--success">
            <div className="confirmation-icon confirmation-icon--success">
              ✓
            </div>
            <p className="label" style={{ color: "var(--color-success)" }}>
              Booking Confirmed
            </p>
            <h1 className="display-md">Your stay is booked!</h1>
            <p className="confirmation-sub">
              Thank you for choosing Absolute Hotel. Your booking has been
              confirmed and payment received.
            </p>

            <div className="confirmation-reference">
              <p className="confirmation-reference__label">Booking Reference</p>
              <p className="confirmation-reference__value">{reference}</p>
              {!user && (
                <p className="confirmation-reference__hint">
                  Save this reference number — you'll need it to look up your
                  booking.
                </p>
              )}
            </div>

            <div className="confirmation-actions">
              {user ? (
                <Link to="/my-bookings" className="btn btn--primary btn--lg">
                  View My Bookings
                </Link>
              ) : (
                <Link to="/" className="btn btn--primary btn--lg">
                  Back to Home
                </Link>
              )}
              <Link to="/rooms" className="btn btn--outline btn--lg">
                Browse More Rooms
              </Link>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="confirmation-card confirmation-card--failed">
            <div className="confirmation-icon confirmation-icon--failed">✕</div>
            <p className="label" style={{ color: "var(--color-error)" }}>
              Payment Failed
            </p>
            <h1 className="display-md">Something went wrong</h1>
            <p className="confirmation-sub">
              Your payment could not be processed. Please try again or contact
              support.
            </p>
            <div className="confirmation-actions">
              <Link to="/rooms" className="btn btn--primary btn--lg">
                Try Again
              </Link>
              <Link to="/" className="btn btn--outline btn--lg">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
