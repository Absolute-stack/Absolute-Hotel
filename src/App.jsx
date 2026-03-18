import "./global.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Register, Login } from "./pages/Auth/Auth.jsx";

const Oauth = lazy(() => import("./pages/Oauth/Oauth.jsx"));
const Home = lazy(() => import("./pages/Home/Home.jsx"));

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/oauth"
          element={
            <Suspense fallback={null}>
              <Oauth />
            </Suspense>
          }
        />
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <Home />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
