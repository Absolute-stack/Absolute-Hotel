import "./Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRooms } from "../../hooks/useRooms.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import hero_img from "../../assets/images/hotel_hero.webp";
import RoomCard from "../../components/RoomCard/RoomCard.jsx";
import Footer from "../../components/Footer/Footer.jsx";

export default function Home() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const AMENITIES = [
    { icon: "🏊", label: "Infinity Pool" },
    { icon: "🍽️", label: "Fine Dining" },
    { icon: "💆", label: "Luxury Spa" },
    { icon: "🏋️", label: "Fitness Center" },
    { icon: "🚗", label: "Valet Parking" },
    { icon: "🛎️", label: "24/7 Concierge" },
  ];

  const { data, isPending } = useRooms({ limit: 6 });

  const rooms = data?.pages?.flatMap((page) => page.rooms) ?? [];

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("capacity", guests);
    navigate(`/rooms?${params}`);
  }

  return (
    <main className="home-page">
      <Navbar />
      <div className="hero-container">
        <img
          src={hero_img}
          alt="hotel wide-space pool shot"
          loading="eager"
          fetchPriority="high"
          className="hero_img"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="" style={{ fontSize: "1.1rem" }}>
            Welcome to
          </p>
          <p
            className=""
            style={{ fontSize: "4rem", fontFamily: "var(--ff-sub)" }}
          >
            Absolute
          </p>
          <p
            className=""
            style={{
              fontSize: "4rem",
              fontFamily: "var(--ff-sub)",
              fontStyle: "italic",
              color: "var(--color-accent-dark)",
            }}
          >
            Hotel
          </p>
          <p className="subtitle-text">
            Experience unparalleled luxury in the heart of the city
          </p>
          <p className="subtitle-text">
            Where every detail is crafted for your comfort
          </p>
        </div>
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-group">
            <label htmlFor="checkIn" className="label-1">
              Check-In
            </label>
            <input
              type="date"
              name="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="search-group">
            <label htmlFor="checkOut" className="label-1">
              Check-Out
            </label>
            <input
              type="date"
              name="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="search-group">
            <label htmlFor="guests" className="label-1 hero-select-label">
              Guest
            </label>
            <select
              name="guests"
              className="hero-select"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((n) => {
                return (
                  <option key={n} value={n}>
                    {n} Guest{n > 1 ? "s" : ""}
                  </option>
                );
              })}
            </select>
          </div>
          <button type="submit" className="hero-btn">
            Search
          </button>
        </form>
      </div>
      <div className="container">
        <section className="hotel-stats">
          {[
            { value: "200+", label: "Luxury Rooms" },
            { value: "15+", label: "Years of Excellence" },
            { value: "4.9★", label: "Guest Rating" },
            { value: "24/7", label: "Concierge Service" },
          ].map((item) => {
            return (
              <div className="hotel-stat-container">
                <p className="stat-value title-text">{item.value}</p>
                <p className="stat-label label-1">{item.label}</p>
              </div>
            );
          })}
        </section>
        <section className="featured-rooms">
          <h3 className="highlight-text-2">OUR COLLECTION</h3>
          <h3 className="title-text-1">Featured Rooms & Suites</h3>
          <p className="label-1 center mw-40ch">
            Discover our carefully curated selection of rooms designed for the
            modern traveller.
          </p>
          {isPending && <p>Rooms are loading....</p>}
          <div className="rooms-grid">
            {rooms &&
              rooms.map((room) => {
                return <RoomCard key={room._id} room={room} />;
              })}
          </div>
          <button
            type="button"
            className="view-rooms-btn"
            onClick={() => navigate("/rooms")}
          >
            View All Rooms
          </button>
        </section>
      </div>

      <section className="amenities-section">
        <h3 className="highlight-text-2">WORLD CLASS</h3>
        <h3 className="title-text-1">Hotel Amenities</h3>
        <div className="amenities-grid">
          {AMENITIES.map((amenity) => {
            return (
              <div className="amenity-card">
                <p className="amenity-icon">{amenity.icon}</p>
                <p className="amenity-label">{amenity.label}</p>
              </div>
            );
          })}
        </div>
      </section>
      <div className="cta flex-sb">
        <div className="right-container">
          <p>Limited Availability</p>
          <p>Reserve Your Stay Today</p>
        </div>
        <button type="button" onClick={() => navigate("/rooms")}>
          Book Room
        </button>
      </div>
      <Footer />
    </main>
  );
}
