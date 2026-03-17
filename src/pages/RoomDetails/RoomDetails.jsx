import "./RoomDetails.css";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRoom } from "../../hooks/useRooms.js";
import { useStore } from "../../store/store.js";
import { createBooking, initializePayment } from "../../api/booking.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isPending } = useRoom(id);
  const user = useStore((state) => state.auth.user);

  const [heroImage, setHeroImage] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (isPending)
    return (
      <div className="page-loading">
        <div className="spinner" />
        <span>Loading room...</span>
      </div>
    );

  const room = data?.room;
  if (!room)
    return (
      <div className="room-not-found">
        <Navbar />
        <div
          className="container"
          style={{ paddingBlock: "8rem", textAlign: "center" }}
        >
          <p className="display-md">Room not found</p>
          <Link
            to="/rooms"
            className="btn btn--primary"
            style={{ marginBlockStart: "1.5rem" }}
          >
            Back to Rooms
          </Link>
        </div>
      </div>
    );

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
        )
      : 0;

  const totalPrice = nights * room.price;
  const isGuest = !user;

  function validate() {
    if (!checkIn) return "Check-in date is required";
    if (!checkOut) return "Check-out date is required";
    if (nights <= 0) return "Check-out must be after check-in";
    if (guests > room.capacity)
      return `Max capacity is ${room.capacity} guests`;
    if (isGuest && !guestName) return "Name is required";
    if (isGuest && !guestEmail) return "Email is required";
    if (isGuest && !guestPhone) return "Phone is required";
    return null;
  }

  async function handleBook() {
    const err = validate();
    if (err) return setError(err);
    setIsLoading(true);
    setError(null);

    try {
      const bookingData = {
        roomId: room._id,
        checkIn,
        checkOut,
        guests,
        specialRequest,
        ...(isGuest && { guestName, guestEmail, guestPhone }),
      };

      const { booking } = await createBooking(bookingData);
      const { authorizationURL } = await initializePayment(booking._id);
      window.location.href = authorizationURL;
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="room-details">
      <Navbar />

      <div className="container room-details__layout">
        {/* Left: Images + Info */}
        <div className="room-details__left">
          {/* Breadcrumb */}
          <div className="room-details__bc">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/rooms">Rooms</Link>
            <span>›</span>
            <span>{room.name}</span>
          </div>

          {/* Hero Image */}
          <div className="room-details__hero-img-wrap">
            <img
              src={heroImage || room.images?.[0]}
              alt={room.name}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="room-details__hero-img"
            />
            <div className="room-details__img-badge">{room.type}</div>
          </div>

          {/* Thumbnails */}
          {room.images?.length > 1 && (
            <div className="room-details__thumbnails">
              {room.images.map((img) => (
                <button
                  key={img}
                  onClick={() => setHeroImage(img)}
                  className={`room-details__thumb ${heroImage === img ? "active" : ""}`}
                >
                  <img src={img} alt={room.name} loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="room-details__info">
            <div className="room-details__meta">
              <span className="badge badge--gold">{room.type}</span>
              {room.avgRating > 0 && (
                <span className="room-details__rating">
                  ★ {Number(room.avgRating).toFixed(1)}
                  <span className="room-details__rating-count">
                    ({room.totalReviews} reviews)
                  </span>
                </span>
              )}
            </div>

            <h1 className="display-md room-details__name">{room.name}</h1>
            <p className="room-details__location">
              Floor {room.floor} · Room {room.roomNumber} · Up to{" "}
              {room.capacity} guests
            </p>
            <p className="room-details__description">{room.description}</p>

            {/* Amenities */}
            <div className="room-details__amenities-section">
              <p className="room-details__section-title">Amenities</p>
              <div className="room-details__amenities">
                {room.amenities?.map((a) => (
                  <span key={a} className="room-details__amenity">
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <aside className="booking-card">
          <div className="booking-card__price">
            <span className="booking-card__amount">
              GH₵{room.price?.toLocaleString()}
            </span>
            <span className="booking-card__night"> / night</span>
          </div>

          <div className="booking-card__form">
            <div className="form-row">
              <div className="form-group">
                <label>Check In</label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Check Out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {Array.from({ length: room.capacity }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n} Guest{n > 1 ? "s" : ""}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Guest details if not logged in */}
            {isGuest && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="john@email.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            {!isGuest && (
              <div className="booking-card__user-info">
                Booking as <strong>{user.name}</strong>
              </div>
            )}

            <div className="form-group">
              <label>Special Requests (optional)</label>
              <textarea
                rows={2}
                placeholder="Any special requirements..."
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
              />
            </div>
          </div>

          {/* Price breakdown */}
          {nights > 0 && (
            <div className="booking-card__breakdown">
              <div className="booking-card__breakdown-row">
                <span>
                  GH₵{room.price?.toLocaleString()} × {nights} night
                  {nights > 1 ? "s" : ""}
                </span>
                <span>GH₵{totalPrice?.toLocaleString()}</span>
              </div>
              <div className="booking-card__total">
                <span>Total</span>
                <span>GH₵{totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          <button
            className="btn btn--primary btn--full btn--lg"
            onClick={handleBook}
            disabled={isLoading || !room.isAvailable}
          >
            {!room.isAvailable
              ? "Room Unavailable"
              : isLoading
                ? "Processing..."
                : "Reserve Now"}
          </button>

          {!user && (
            <p className="booking-card__login-hint">
              <Link to="/login">Sign in</Link> to manage your bookings easily
            </p>
          )}
        </aside>
      </div>

      <Footer />
    </div>
  );
}
