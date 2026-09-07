import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import VerifyOtpPage from "./pages/VerifyOtpPage.js";
import HomePage from "./pages/HomePage.tsx";
import type { User } from "./types.ts";

const STORAGE_KEY: string = "campus_marketplace_user";

function readStoredUser(): User | null {
  try {
    const raw: string | null = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(readStoredUser);

  function handleSignedIn(signedInUser: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signedInUser));
    setUser(signedInUser);
  }

  function handleSignOut(): void {
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
