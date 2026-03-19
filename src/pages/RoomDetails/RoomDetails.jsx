import "./RoomDetails.css";
import { useState } from "react";
import { useStore } from "../../store/store.js";
import star from "../../assets/images/star.webp";
import { useRoom } from "../../hooks/useRooms.js";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { createBooking, initializePayment } from "../../api/booking.js";

const initialForm = {
  roomId: "",
  checkIn: "",
  checkOut: "",
  phone: "",
  guests: 1,
  specialRequest: "",
  guestName: "",
  guestEmail: "",
};

export default function RoomDetails() {
  const { id } = useParams();
  const [heroImage, setHeroImage] = useState();
  const { data, isPending } = useRoom(id);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useStore((state) => state.auth.user);

  function handleFormChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validateError() {
    if (!form.checkIn) return setError("CheckIn date is required");
    if (!form.checkOut) return setError("CheckOut date is required");
    if (!form.guests) return setError("Guests is required");
    if (!form.phone) return setError("Phone is required");
    if (!user && !form.guestName) return setError("Guest name is required");
    if (!user && !form.guestEmail) return setError("Guest email is required");
    return null;
  }

  if (isPending) return <div>loading...</div>;

  async function book(e) {
    e.preventDefault();
    if (validateError()) return;
    setLoading(true);
    try {
      const body = {
        roomId: data?.room?._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        phone: form.phone,
        ...(!user && {
          guestName: form.guestName,
          guestEmail: form.guestEmail,
        }),
      };

      const { booking } = await createBooking(body);
      const bookingId = booking._id;
      const { authorizationURL } = await initializePayment(bookingId);
      window.location.href = authorizationURL;
    } catch (error) {
      return setError("Something went wrong please try again later");
    } finally {
      setLoading(false);
    }
  }

  const room = data?.room;
  if (!room) return <div>Room not found</div>;

  return (
    <main className="room-details">
      <Navbar />
      <div className="container">
        <div className="room-details-breadcrumb flex-05">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/rooms">Rooms</Link>
          <span>›</span>
          <Link to="#">{room.name}</Link>
        </div>
        <div className="room-details-divider">
          <div className="left-room-details">
            <div className="room-details-hero-img-container">
              <img
                src={heroImage || room?.images?.[0]}
                alt={room?.name}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div className="images-grid">
              {room.images?.map((image) => {
                return (
                  <img
                    key={image}
                    src={image}
                    alt={room.name}
                    loading="eager"
                    decoding="async"
                    onClick={() => setHeroImage(image)}
                  />
                );
              })}
            </div>
            <div className="type-stats">
              <p>{room.type}</p>
              <div className="flex-sml">
                <img src={star} alt="star-icon" />
                {room.avgRating}
              </div>
            </div>
            <p className="title-text">{room.name}</p>
            <div className="div">
              floor{room.floor} Room{room.roomNumber} Up to Guests.
            </div>
            <p className="spec">{room.description}</p>
            <p className="spec">Amenities</p>
            <div className="amenities-grid">
              {room.amenities?.map((amenity) => {
                return (
                  <p key={amenity} className="flex">
                    <span>✓</span>
                    {amenity}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="right-room-details">
            <form onSubmit={book} className="flow">
              <h2 className="flex-sml">
                GHC{room.price}
                <span className="">/night</span>
              </h2>
              <div className="form-groups-container flex-sb">
                <div className="form-group">
                  <label htmlFor="checkIn" className="label-1">
                    CheckIn
                  </label>
                  <input
                    name="checkIn"
                    type="date"
                    value={form.checkIn}
                    onChange={handleFormChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="checkOut" className="label-1">
                    CheckOut
                  </label>
                  <input
                    name="checkOut"
                    type="date"
                    onChange={handleFormChange}
                    value={form.checkOut}
                    min={form.checkIn || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
              <label htmlFor="guests" className="guest-label label-1">
                Guests
              </label>
              <select
                name="guests"
                value={form.guests}
                onChange={handleFormChange}
                className="room-details-select"
              >
                {[1, 2, 3, 4].map((n) => {
                  return (
                    <option key={n} value={n}>
                      {n} Guest{n > 1 ? "s" : ""}
                    </option>
                  );
                })}
              </select>
              {!user && (
                <div className="form-group">
                  <label htmlFor="guestName" className="label-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    onChange={handleFormChange}
                    value={form.guestName}
                    placeholder="frank hoe"
                  />
                </div>
              )}
              {!user && (
                <div className="form-group">
                  <label htmlFor="guestEmail" className="label-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="guestEmail"
                    onChange={handleFormChange}
                    value={form.guestEmail}
                    placeholder="frankhoe@gmail.com"
                  />
                </div>
              )}
              <div className="form-group">
                <label
                  htmlFor={user ? "phone" : "guestPhone"}
                  className="label-1"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  onChange={handleFormChange}
                  name={"phone"}
                  value={form.phone}
                  className="label-1"
                  placeholder="+233 XXX XXXX"
                />
              </div>
              <div className="form-group">
                <label htmlFor="specialRequest" className="label-1">
                  Special Request
                </label>
                <input
                  type="text"
                  name="specialRequest"
                  value={form.specialRequest}
                  onChange={handleFormChange}
                  placeholder="Optional"
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Booking" : "Book"}
              </button>
              {error && <pre>{error}</pre>}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
