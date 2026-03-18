import "./Navbar.css";
import { useEffect, useState } from "react";
import { useStore } from "../../store/store.js";
import { Link, NavLink, useNavigate } from "react-router-dom";
import star_icon from "../../assets/images/star.webp";

export default function Navbar() {
  const user = useStore((state) => state.auth.user);
  const clearAuth = useStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const [active, setActive] = useState("");

  function handleLogout() {
    clearAuth();
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 0);
  }

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        setActive("active");
      } else {
        setActive("");
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${active}`}>
      <div className="container flex-sb">
        <div
          onClick={() => navigate("/")}
          className="left flex"
          style={{ cursor: "pointer" }}
        >
          <img
            src={star_icon}
            alt="star_icon"
            loading="eager"
            decoding="eager"
            fetchPriority="high"
          />
          <p style={{ fontFamily: "var(--ff-sub)", fontSize: "1rem" }}>
            Absolute Hotel
          </p>
        </div>
        <div className="right flex">
          <div className="nav-links-container flex">
            <NavLink className="hover-text-1">Rooms</NavLink>
            <NavLink className="hover-text-1">Suites</NavLink>
            <NavLink className="hover-text-1">Penthouses</NavLink>
          </div>
          <div
            className="nav-actions-container flex"
            style={{ color: "white" }}
          >
            {!user ? (
              <Link to="/login">Sign in</Link>
            ) : (
              <Link className="logged-in-container">
                <div className="user-info-container flex">
                  <p style={{ color: "white" }}>{user.name}</p>{" "}
                  <span>
                    <img
                      src={user?.image?.[0]}
                      alt="dp"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      className="nav-profile-img"
                    />
                  </span>
                  <div className="dropdown">
                    <Link className="hover-text-1" onClick={handleLogout}>
                      Logout
                    </Link>
                    <Link to="/my-bookings" className="hover-text-1">
                      My Bookings
                    </Link>
                  </div>
                </div>
              </Link>
            )}
            <button className="book-now-btn btn-1" type="button">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
