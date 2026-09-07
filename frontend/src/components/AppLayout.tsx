import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import type { User } from "../types";

interface AppLayoutProps {
  user: User;
  onSignOut: () => void;
  children: ReactNode;
}

function initials(name: string): string {
  const parts: string[] = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AppLayout({ user, onSignOut, children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(event: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent): void {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  function go(path: string): void {
    setMenuOpen(false);
    navigate(path);
  }

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/home" className="wordmark wordmark--dark">
          Campus Marketplace
        </Link>

        <nav className="topnav">
          <NavLink to="/home" className="topnav__link">
            Browse
          </NavLink>
          <NavLink to="/listings/new" className="topnav__link">
            Post an item
          </NavLink>
        </nav>

        <div className="account" ref={menuRef}>
          <button
            type="button"
            className="account__button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="account__avatar">{initials(user.name)}</span>
            <span className="account__name">{user.name}</span>
            <span className="account__caret" aria-hidden="true" />
          </button>

          {menuOpen ? (
            <div className="menu" role="menu">
              <div className="menu__head">
                <p className="menu__name">{user.name}</p>
                <p className="menu__email">{user.email}</p>
              </div>
              <button type="button" className="menu__item" onClick={() => go("/profile")}>
                My profile
              </button>
              <button type="button" className="menu__item" onClick={() => go("/profile#listings")}>
                My listings
              </button>
              <button type="button" className="menu__item" onClick={() => go("/listings/new")}>
                Post an item
              </button>
              <button
                type="button"
                className="menu__item menu__item--quiet"
                onClick={() => {
                  setMenuOpen(false);
                  onSignOut();
                }}
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="app__body">{children}</main>
    </div>
  );
}
