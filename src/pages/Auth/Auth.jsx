import "./Auth.css";
import { useState } from "react";
import { useStore } from "../../store/store";
import star_icon from "../../assets/images/star.webp";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../api/auth.js";
import { setAuthToken } from "../../lib/axios.js";
import register_img from "../../assets/images/register.webp";
import login_img from "../../assets/images/login.webp";
import google_icon from "../../assets/images/google.svg";

export function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);

  function validateForm() {
    if (!form.name) return setError("Name is required");
    if (!form.email) return setError("Email is required");
    if (!form.password) return setError("Password is required");
    return null;
  }

  function handleFormChange(e) {
    return setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (validateForm()) return;
      setIsLoading(true);
      const { user, accessToken } = await registerUser(form);
      setAuthToken(accessToken);
      setAuth(user, accessToken);
      navigate("/");
    } catch (error) {
      setError("Something went wrong please try again later");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="register-page">
      <div className="register-left">
        <img
          src={register_img}
          alt="Hotel pool side view"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="register-image-content">
          <div className="register-title-container">
            <img
              src={star_icon}
              alt="star_icon"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <p>Absolute Hotel</p>
          </div>
          <p className="overlay-text-style ove-text">
            "Join the thousands who trust us for their perfect getaway"
          </p>
        </div>
      </div>
      <div className="register-right">
        <form onSubmit={handleSubmit}>
          <span onClick={() => navigate("/")}>&larr; Back to Home</span>
          <p className="highlight-text">GET STARTED</p>
          <p className="title-text">Create Account</p>
          <p className="hover-text-1" onClick={() => navigate("/login")}>
            Already have an account? or Sign-in with Google
          </p>
          <div className="form-group">
            <label htmlFor="name" className="label-1">
              FULL NAME
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="John Doe"
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="label-1">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="johndoe@gmail.com"
              onChange={handleFormChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label-1">
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              placeholder="8 Min Characters"
              onChange={handleFormChange}
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account" : "Create Account"}
          </button>
          {error && <pre>{error}</pre>}
        </form>
      </div>
    </main>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const setAuth = useStore((state) => state.setAuth);

  function validateError() {
    if (!loginForm.email) return setError("Email is required");
    if (!loginForm.password) return setError("Password is required");
    return null;
  }

  function handleLoginFormChange(e) {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (validateError()) return;
    try {
      setIsLoading(true);
      const { user, accessToken } = await loginUser(loginForm);
      setAuthToken(accessToken);
      setAuth(user, accessToken);
      navigate("/");
    } catch (error) {
      setError("Email or Password is invalid");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogle() {
    window.location.href = "http://localhost:8000/api/auth/google";
  }

  return (
    <main className="login-page">
      <div className="login-left">
        <img
          src={login_img}
          alt="Hotel image of pool side with large open area"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="login-left-content">
          <div className="login-left-title-container flex">
            <img
              src={star_icon}
              alt="star icon"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <p>Absolute Hotel</p>
          </div>
          <p className="overlay-text-style ove-text">
            Where every stay becomes an unforgettable experience
          </p>
        </div>
      </div>
      <div className="login-right">
        <div className="container">
          <span onClick={() => navigate("/")} className="hover-text-1">
            &larr; Back to Home
          </span>
          <p className="highlight-text">WELCOME BACK</p>
          <p className="title-text">SIGN IN</p>
          <p className="flex-sml">
            Don't have an Account?{" "}
            <Link to="/register" className="highlight-text">
              Register
            </Link>
          </p>
          <button className="google-btn flex" onClick={handleGoogle}>
            <img
              src={google_icon}
              alt="google-icon"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="google_icon"
            />
            <p>Continue with Google</p>
          </button>
          <span className="or-span">or</span>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="label-1">
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                placeholder="johndoe@gmail.com"
                value={loginForm.email}
                onChange={handleLoginFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="label-1">
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min Characters 8"
                value={loginForm.password}
                onChange={handleLoginFormChange}
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Signing In" : "Sign In"}
            </button>
            {error && <pre>{error}</pre>}
          </form>
        </div>
      </div>
    </main>
  );
}
