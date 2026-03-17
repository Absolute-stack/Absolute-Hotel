import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">✦</span>
              <span>Absolute Hotel</span>
            </div>
            <p className="footer__tagline">
              Where luxury meets comfort. Experience the finest hospitality in
              the heart of the city.
            </p>
          </div>

          <div className="footer__col">
            <p className="footer__heading">Explore</p>
            <Link to="/rooms" className="footer__link">
              All Rooms
            </Link>
            <Link to="/rooms?type=suite" className="footer__link">
              Suites
            </Link>
            <Link to="/rooms?type=penthouse" className="footer__link">
              Penthouses
            </Link>
            <a href="#amenities" className="footer__link">
              Amenities
            </a>
          </div>

          <div className="footer__col">
            <p className="footer__heading">Account</p>
            <Link to="/login" className="footer__link">
              Sign In
            </Link>
            <Link to="/register" className="footer__link">
              Register
            </Link>
            <Link to="/my-bookings" className="footer__link">
              My Bookings
            </Link>
          </div>

          <div className="footer__col">
            <p className="footer__heading">Contact</p>
            <p className="footer__link">Kumasi, Ghana</p>
            <p className="footer__link">+233 XX XXX XXXX</p>
            <p className="footer__link">hello@absolutehotel.com</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} Absolute Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
