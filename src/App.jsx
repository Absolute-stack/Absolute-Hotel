import "./global.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Register, Login } from "./pages/Auth/Auth.jsx";

const Oauth = lazy(() => import("./pages/Oauth/Oauth.jsx"));
const Home = lazy(() => import("./pages/Home/Home.jsx"));
const Rooms = lazy(() => import("./pages/Rooms/Rooms.jsx"));
const RoomDetails = lazy(() => import("./pages/RoomDetails/RoomDetails.jsx"));
const BookingConfirmation = lazy(
  () => import("./pages/BookingConfirmation/BookingConfirmation.jsx"),
);

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth" element={<Oauth />} />
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room-details/:id" element={<RoomDetails />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      </Routes>
    </Suspense>
  );
}
