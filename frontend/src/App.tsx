import { useState } from "react";
import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import VerifyOtpPage from "./pages/VerifyOtpPage.tsx";
import BrowsePage from "./pages/BrowsePage.tsx";
import ListingDetailPage from "./pages/ListingDetailPage.tsx";
import ListingFormPage from "./pages/ListingFormPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import AppLayout from "./components/AppLayout.tsx";
import { STORAGE_KEY } from "./api/client.ts";
import type { User } from "./types.ts";

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
  
  function shell(inner: ReactNode) {
    if (!user) return <Navigate to="/" replace />;
    return (
      <AppLayout user={user} onSignOut={handleSignOut}>
        {inner}
      </AppLayout>
    );
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

      <Route path="/home" element={shell(user ? <BrowsePage user={user} /> : null)} />
      <Route path="/listings/new" element={shell(<ListingFormPage />)} />
      <Route path="/listings/:id" element={shell(user ? <ListingDetailPage user={user} /> : null)} />
      <Route path="/listings/:id/edit" element={shell(<ListingFormPage />)} />
      <Route
        path="/profile"
        element={shell(
          user ? <ProfilePage user={user} onProfileSaved={handleSignedIn} /> : null
        )}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
