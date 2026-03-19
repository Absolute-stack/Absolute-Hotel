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
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    clearAuth();
    setMenuOpen(false);
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 0);
  }

  function closeMenu() {
    setMenuOpen(false);
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

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`nav ${active}`}>
        <div className="container flex-sb">
          {/* Logo */}
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

          {/* Desktop right side */}
          <div className="right flex">
            <div className="nav-links-container flex">
              <NavLink to="/rooms" className="hover-text-1">
                Rooms
              </NavLink>
              <NavLink to="/rooms?type=suite" className="hover-text-1">
                Suites
              </NavLink>
              <NavLink to="/rooms?type=penthouse" className="hover-text-1">
                Penthouses
              </NavLink>
            </div>
            <div
              className="nav-actions-container flex"
              style={{ color: "white" }}
            >
              {!user ? (
                <Link to="/login">Sign in</Link>
              ) : (
                <div className="logged-in-container">
                  <div className="user-info-container flex">
                    <p style={{ color: "white" }}>{user.name}</p>
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
                </div>
              )}
              <button className="book-now-btn btn-1" type="button">
                Book Now
              </button>
            </div>

            {/* Hamburger — mobile only */}
            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`mobile-menu-backdrop ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
      />

      {/* Mobile drawer */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {user && <p className="mobile-user-name">👤 {user.name}</p>}

        <NavLink to="/rooms" className="mobile-nav-link" onClick={closeMenu}>
          Rooms
        </NavLink>
        <NavLink
          to="/rooms?type=suite"
          className="mobile-nav-link"
          onClick={closeMenu}
        >
          Suites
        </NavLink>
        <NavLink
          to="/rooms?type=penthouse"
          className="mobile-nav-link"
          onClick={closeMenu}
        >
          Penthouses
        </NavLink>

        {user ? (
          <>
            <Link to="/my-bookings" onClick={closeMenu}>
              My Bookings
            </Link>
            <Link onClick={handleLogout} className="mobile-logout">
              Logout
            </Link>
          </>
        ) : (
          <Link to="/login" onClick={closeMenu}>
            Sign In
          </Link>
        )}

        <button
          className="book-now-btn btn-1"
          type="button"
          onClick={() => {
            navigate("/rooms");
            closeMenu();
          }}
        >
          Book Now
        </button>
      </div>
    </>
  );
}
