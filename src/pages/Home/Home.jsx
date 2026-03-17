import "./Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRooms } from "../../hooks/useRooms.js";
import RoomCard from "../../components/RoomCard/RoomCard.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";

const AMENITIES = [
  { icon: "🏊", label: "Infinity Pool" },
  { icon: "🍽️", label: "Fine Dining" },
  { icon: "💆", label: "Luxury Spa" },
  { icon: "🏋️", label: "Fitness Center" },
  { icon: "🚗", label: "Valet Parking" },
  { icon: "🛎️", label: "24/7 Concierge" },
];

export default function Home() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const { data, isPending } = useRooms({ limit: 6 });
  const rooms = data?.pages?.flatMap((p) => p.rooms) ?? [];

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    navigate(`/rooms?${params}`);
  }

  return (
    <div className="home">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800"
            alt="Absolute Hotel"
            loading="eager"
            fetchPriority="high"
            className="hero__bg-img"
          />
          <div className="hero__overlay" />
        </div>

        <div className="container hero__content">
          <div className="hero__text fade-up fade-up-1">
            <p className="label" style={{ color: "rgba(255,255,255,0.7)" }}>
              Welcome to
            </p>
            <h1 className="display-xl hero__title">
              Absolute
              <br />
              <em>Hotel</em>
            </h1>
            <p className="hero__subtitle">
              Experience unparalleled luxury in the heart of the city. Where
              every detail is crafted for your comfort.
            </p>
          </div>

          {/* Search Card */}
          <form
            className="hero__search fade-up fade-up-2"
            onSubmit={handleSearch}
          >
            <div className="hero__search-field">
              <label>Check In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="hero__search-divider" />
            <div className="hero__search-field">
              <label>Check Out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="hero__search-divider" />
            <div className="hero__search-field">
              <label>Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} Guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn--primary hero__search-btn">
              Search Rooms
            </button>
          </form>
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats">
        <div className="container stats__grid">
          {[
            { value: "200+", label: "Luxury Rooms" },
            { value: "15+", label: "Years of Excellence" },
            { value: "4.9★", label: "Guest Rating" },
            { value: "24/7", label: "Concierge Service" },
          ].map((stat) => (
            <div key={stat.label} className="stats__item">
              <p className="stats__value">{stat.value}</p>
              <p className="stats__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Rooms ── */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <p className="label">Our Collection</p>
            <h2 className="display-lg">Featured Rooms & Suites</h2>
            <p className="section__sub">
              Discover our carefully curated selection of rooms designed for the
              modern traveller.
            </p>
          </div>

          {isPending ? (
            <div className="page-loading">
              <div className="spinner" />
              <span>Loading rooms...</span>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}

          <div className="section__cta">
            <a href="/rooms" className="btn btn--outline btn--lg">
              View All Rooms
            </a>
          </div>
        </div>
      </section>

      {/* ── Amenities ── */}
      <section className="amenities" id="amenities">
        <div className="container">
          <div className="section__header">
            <p className="label">World Class</p>
            <h2 className="display-lg">Hotel Amenities</h2>
          </div>
          <div className="amenities__grid">
            {AMENITIES.map((a) => (
              <div key={a.label} className="amenity-card">
                <div className="amenity-card__icon">{a.icon}</div>
                <p className="amenity-card__label">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <p className="label" style={{ color: "rgba(255,255,255,0.6)" }}>
              Limited Availability
            </p>
            <h2
              className="display-md"
              style={{ color: "white", marginBlockStart: "0.5rem" }}
            >
              Reserve Your Stay Today
            </h2>
          </div>
          <a href="/rooms" className="btn btn--primary btn--lg">
            Book a Room
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
