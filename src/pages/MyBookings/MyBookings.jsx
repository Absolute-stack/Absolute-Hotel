import "./MyBookings.css";
import { Link } from "react-router-dom";
import { myBookings } from "../../hooks/useRooms.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

const STATUS_COLORS = {
  pending: "badge--gold",
  confirmed: "badge--green",
  cancelled: "badge--red",
  completed: "badge--green",
};

export default function MyBookings() {
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    myBookings();
  const bookings = data?.pages?.flatMap((p) => p.bookings) ?? [];

  return (
    <div className="my-bookings">
      <Navbar />

      <div className="my-bookings__hero">
        <div className="container">
          <p className="label">Account</p>
          <h1 className="display-lg my-bookings__title">My Bookings</h1>
        </div>
      </div>

      <div className="container my-bookings__layout">
        {isPending ? (
          <div className="page-loading">
            <div className="spinner" />
            <span>Loading bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="my-bookings__empty">
            <p className="display-md">No bookings yet</p>
            <p>Your booking history will appear here.</p>
            <Link
              to="/rooms"
              className="btn btn--primary"
              style={{ marginBlockStart: "1.5rem" }}
            >
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-item">
                <div className="booking-item__img-wrap">
                  <img
                    src={booking.room?.images?.[0]}
                    alt={booking.room?.name}
                    loading="lazy"
                    className="booking-item__img"
                  />
                </div>

                <div className="booking-item__info">
                  <div className="booking-item__top">
                    <div>
                      <p className="booking-item__room-type">
                        {booking.room?.type}
                      </p>
                      <h3 className="booking-item__room-name">
                        {booking.room?.name}
                      </h3>
                      <p className="booking-item__room-number">
                        Room {booking.room?.roomNumber}
                      </p>
                    </div>
                    <span
                      className={`badge ${STATUS_COLORS[booking.status] || "badge--gold"}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-item__dates">
                    <div className="booking-item__date">
                      <span className="booking-item__date-label">Check In</span>
                      <span className="booking-item__date-value">
                        {new Date(booking.checkIn).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="booking-item__date-arrow">→</div>
                    <div className="booking-item__date">
                      <span className="booking-item__date-label">
                        Check Out
                      </span>
                      <span className="booking-item__date-value">
                        {new Date(booking.checkOut).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div className="booking-item__guests">
                      <span className="booking-item__date-label">Guests</span>
                      <span className="booking-item__date-value">
                        {booking.guests}
                      </span>
                    </div>
                  </div>

                  <div className="booking-item__footer">
                    <div>
                      <span className="booking-item__price">
                        GH₵{booking.totalPrice?.toLocaleString()}
                      </span>
                      <span
                        className={`badge ${booking.paymentStatus === "paid" ? "badge--green" : "badge--gold"}`}
                        style={{ marginInlineStart: "0.75rem" }}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>
                    <Link
                      to={`/rooms/${booking.room?._id}`}
                      className="btn btn--outline btn--sm"
                    >
                      View Room
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {hasNextPage && (
              <div className="my-bookings__load-more">
                <button
                  className="btn btn--outline"
                  onClick={fetchNextPage}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
