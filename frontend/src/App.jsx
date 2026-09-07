import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VerifyOtpPage from "./pages/VerifyOtpPage.jsx";
import HomePage from "./pages/HomePage.jsx";

const STORAGE_KEY = "campus_marketplace_user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(readStoredUser);

  function handleSignedIn(signedInUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signedInUser));
    setUser(signedInUser);
  }

  function handleSignOut() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <LoginPage onSignedIn={handleSignedIn} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/home" replace /> : <RegisterPage />}
      />
      <Route path="/verify" element={<VerifyOtpPage />} />
      <Route
        path="/home"
        element={user ? <HomePage user={user} onSignOut={handleSignOut} /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
