import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";

import { useAuth } from "../context/AuthContext";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="14" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="14" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function RecordsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 4h12v16H6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 8h6M9 12h6M9 16h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, signOut } = useAuth();

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <button
            type="button"
            className="admin-mobile-menu"
            aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link to="/admin" className="admin-brand">
            <strong>SVGOR</strong>
            <span>Administration</span>
          </Link>

          <div className="admin-user-summary">
            <div>
              <strong>{user?.email}</strong>
              <span>{role?.replace("_", " ")}</span>
            </div>

            <button type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="admin-frame">
        <aside className={`admin-sidebar ${mobileOpen ? "is-open" : ""}`}>
          <nav aria-label="Admin navigation">
            <NavLink to="/admin" end onClick={closeMobile}>
              <GridIcon />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/records" onClick={closeMobile}>
              <RecordsIcon />
              <span>Records</span>
            </NavLink>
          </nav>

          <div className="admin-sidebar-footer">
            <Link to="/" onClick={closeMobile}>
              View public website
            </Link>
          </div>
        </aside>

        {mobileOpen && (
          <button
            type="button"
            className="admin-backdrop"
            aria-label="Close admin navigation"
            onClick={closeMobile}
          />
        )}

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
