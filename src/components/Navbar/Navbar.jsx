import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStore } from "../../store/store.js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useStore((state) => state.auth.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">✦</span>
          <span className="navbar__logo-text">Absolute Hotel</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__links">
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Rooms
          </NavLink>
          <NavLink to="/rooms?type=suite" className="navbar__link">
            Suites
          </NavLink>
          <NavLink to="/rooms?type=penthouse" className="navbar__link">
            Penthouses
          </NavLink>
          <a href="#amenities" className="navbar__link">
            Amenities
          </a>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/my-bookings" className="btn btn--ghost btn--sm">
                My Bookings
              </Link>
              <div className="navbar__avatar">
                {user.name?.[0]?.toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn--primary btn--sm">
                Book Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`navbar__toggle-bar ${menuOpen ? "open" : ""}`} />
          <span className={`navbar__toggle-bar ${menuOpen ? "open" : ""}`} />
          <span className={`navbar__toggle-bar ${menuOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          <Link
            to="/rooms"
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Rooms
          </Link>
          <Link
            to="/rooms?type=suite"
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Suites
          </Link>
          <Link
            to="/rooms?type=penthouse"
            className="navbar__mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            Penthouses
          </Link>
          <div className="navbar__mobile-actions">
            {user ? (
              <Link
                to="/my-bookings"
                className="btn btn--outline btn--full"
                onClick={() => setMenuOpen(false)}
              >
                My Bookings
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn--outline btn--full"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn--primary btn--full"
                  onClick={() => setMenuOpen(false)}
                >
                  Book Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
