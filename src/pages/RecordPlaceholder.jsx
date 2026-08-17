import {
  Link,
  useParams,
} from "react-router";

import sampleRecords from "../data/sampleRecords";

import "../App.css";
import "./SearchResults.css";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19 12H5M10 7l-5 5 5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RecordPlaceholder() {
  const { slug } = useParams();

  const record = sampleRecords.find(
    (item) => item.slug === slug,
  );

  if (!record) {
    return (
      <div className="site">
        <header className="header">
          <div className="header-inner">
            <Link
              to="/search"
              className="header-control"
              aria-label="Back to search"
            >
              <BackIcon />
            </Link>

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
            minHeight: "70vh",
            padding: "80px 0",
            background: "#f7f9fb",
          }}
        >
          <div className="container">
            <p className="section-label">
              Record unavailable
            </p>

            <h1
              style={{
                margin: "0 0 20px",
                fontSize: "48px",
                letterSpacing: "-0.04em",
              }}
            >
              Record not found
            </h1>

            <Link
              to="/search"
              className="button primary-button"
            >
              Back to search
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="site">
      <header className="header">
        <div className="header-inner">
          <Link
            to="/search"
            className="header-control"
            aria-label="Back to search results"
          >
            <BackIcon />
          </Link>

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
          minHeight: "72vh",
          padding: "70px 0",
          background: "#f7f9fb",
        }}
      >
        <div className="container">
          <p className="section-label">
            Demonstration record
          </p>

          <h1
            style={{
              margin: "0",
              fontSize: "clamp(38px, 5vw, 56px)",
              letterSpacing: "-0.045em",
            }}
          >
            {record.firstName}{" "}
            {record.lastName}
          </h1>

          <p
            style={{
              maxWidth: "650px",
              margin: "18px 0 28px",
              color: "#687386",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            The complete individual record page is
            the next part of the build. This route is
            now working correctly.
          </p>

          <Link
            to="/search"
            className="button primary-button"
          >
            Back to results
          </Link>
        </div>
      </main>
    </div>
  );
}

export default RecordPlaceholder;