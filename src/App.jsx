import "./global.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Login, Register } from "./pages/Auth/Auth.jsx";

const Home = lazy(() => import("./pages/Home/Home.jsx"));
const Rooms = lazy(() => import("./pages/Rooms/Rooms.jsx"));
const RoomDetails = lazy(() => import("./pages/RoomDetails/RoomDetails.jsx"));
const BookingConfirmation = lazy(
  () => import("./pages/BookingConfirmation/BookingConfirmation.jsx"),
);
const MyBookings = lazy(() => import("./pages/MyBookings/MyBookings.jsx"));

function Loading() {
  return (
    <div className="page-loading">
      <div className="spinner" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/rooms"
        element={
          <Suspense fallback={<Loading />}>
            <Rooms />
          </Suspense>
        }
      />
      <Route
        path="/rooms/:id"
        element={
          <Suspense fallback={<Loading />}>
            <RoomDetails />
          </Suspense>
        }
      />
      <Route
        path="/booking-confirmation"
        element={
          <Suspense fallback={<Loading />}>
            <BookingConfirmation />
          </Suspense>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <Suspense fallback={<Loading />}>
            <MyBookings />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        }
      />
    </Routes>
  );
}
