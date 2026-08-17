import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";

import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, role, loading, signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const unauthorized = searchParams.get("unauthorized") === "1";

  useEffect(() => {
    if (!loading && user && role) {
      navigate("/admin", { replace: true });
    }
  }, [loading, user, role, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await signIn(email.trim(), password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  async function clearUnauthorizedSession() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-brandbar">
        <Link to="/" className="admin-login-brand">
          <strong>SVGOR</strong>
          <span>Administration</span>
        </Link>
      </div>

      <main className="admin-login-main">
        <section className="admin-login-card" aria-labelledby="admin-login-title">
          <div className="admin-login-emblem">
            <img
              src="/images/rsvgpf-emblem.svg"
              alt=""
              aria-hidden="true"
            />
          </div>

          <p className="admin-eyebrow">Authorized access only</p>
          <h1 id="admin-login-title">Admin sign in</h1>
          <p className="admin-login-copy">
            Sign in with an administrator account to manage registry records.
          </p>

          {unauthorized && user && !role && (
            <div className="admin-alert admin-alert-error">
              <strong>Account not authorized.</strong>
              <span>This signed-in account is not listed as an SVGOR administrator.</span>
              <button type="button" onClick={clearUnauthorizedSession}>
                Sign out and try another account
              </button>
            </div>
          )}

          {error && (
            <div className="admin-alert admin-alert-error" role="alert">
              {error}
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label>
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit" disabled={submitting || loading}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="admin-login-footer">
            <Link to="/">Return to public website</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
