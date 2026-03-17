import "./Auth.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth.js";
import { useStore } from "../../store/store.js";
import { setAuthToken } from "../../lib/axios.js";

export function Login() {
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password)
      return setError("All fields are required");
    setLoading(true);
    try {
      const { user, accessToken } = await loginUser(form);
      setAuthToken(accessToken);
      setAuth(user, accessToken);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
          alt="Absolute Hotel"
          className="auth-page__bg"
        />
        <div className="auth-page__overlay" />
        <div className="auth-page__left-content">
          <div className="auth-page__logo">
            <span style={{ color: "var(--color-accent)" }}>✦</span> Absolute
            Hotel
          </div>
          <blockquote className="auth-page__quote">
            "Where every stay becomes an unforgettable experience."
          </blockquote>
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-form">
          <Link to="/" className="auth-form__back">
            ← Back to Home
          </Link>

          <div className="auth-form__header">
            <p className="label">Welcome back</p>
            <h1 className="display-md auth-form__title">Sign In</h1>
            <p className="auth-form__sub">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
            className="auth-form__google"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </a>

          <div className="auth-form__divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form__fields">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              className="btn btn--primary btn--full btn--lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return setError("All fields are required");
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters");
    setLoading(true);
    try {
      const { registerUser } = await import("../../api/auth.js");
      const { user, accessToken } = await registerUser(form);
      setAuthToken(accessToken);
      setAuth(user, accessToken);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <img
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200"
          alt="Absolute Hotel"
          className="auth-page__bg"
        />
        <div className="auth-page__overlay" />
        <div className="auth-page__left-content">
          <div className="auth-page__logo">
            <span style={{ color: "var(--color-accent)" }}>✦</span> Absolute
            Hotel
          </div>
          <blockquote className="auth-page__quote">
            "Join thousands of guests who trust us for their perfect getaway."
          </blockquote>
        </div>
      </div>

      <div className="auth-page__right">
        <div className="auth-form">
          <Link to="/" className="auth-form__back">
            ← Back to Home
          </Link>

          <div className="auth-form__header">
            <p className="label">Get started</p>
            <h1 className="display-md auth-form__title">Create Account</h1>
            <p className="auth-form__sub">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form__fields">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              className="btn btn--primary btn--full btn--lg"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
