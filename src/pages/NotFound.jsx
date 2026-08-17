import { Link } from "react-router";

import "../App.css";

function NotFound() {
  return (
    <div className="site">
      <header className="header">
        <div className="header-inner">
          <div />

          <Link className="brand" to="/">
            <span className="brand-main">
              SVGOR
            </span>

            <span className="brand-sub">
              Sexual Offence Conviction Records
            </span>
          </Link>

          <div />
        </div>

        <div
          className="national-line"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
      </header>

      <main
        style={{
          minHeight: "75vh",
          display: "grid",
          placeItems: "center",
          padding: "60px 0",
          background: "#f7f9fb",
        }}
      >
        <div
          className="container"
          style={{
            textAlign: "center",
          }}
        >
          <p className="section-label">
            Error 404
          </p>

          <h1
            style={{
              margin: "0",
              fontSize:
                "clamp(42px, 7vw, 68px)",
              letterSpacing: "-0.05em",
            }}
          >
            Page not found
          </h1>

          <p
            style={{
              maxWidth: "520px",
              margin: "18px auto 28px",
              color: "#687386",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            The page you requested does not exist
            or may have moved.
          </p>

          <Link
            to="/"
            className="button primary-button"
          >
            Return home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default NotFound;