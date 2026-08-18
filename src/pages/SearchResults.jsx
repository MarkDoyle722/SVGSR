import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router";

import { searchRecords } from "../services/records";

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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="10.5"
        cy="10.5"
        r="5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m14.9 14.9 4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12h13M14 7l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3v3M18 3v3M4.5 8.5h15M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatReviewDate(value) {
  if (!value) {
    return "Not reviewed";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function RecordPhoto({ record }) {
  const [imageFailed, setImageFailed] = useState(false);

  const initials =
    `${record.firstName?.[0] || ""}${record.lastName?.[0] || ""}`
      .trim()
      .toUpperCase();

  const showPhoto =
    Boolean(record.photoUrl) && !imageFailed;

  return (
    <div className="record-photo-wrap">
      {showPhoto ? (
        <img
          className="record-photo"
          src={record.photoUrl}
          alt={`${record.firstName} ${record.lastName}`}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="record-photo-placeholder"
          aria-hidden="true"
        >
          <span>{initials || "—"}</span>

          {record.demo && (
            <small>DEMO</small>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filters = useMemo(
    () => ({
      firstName:
        searchParams.get("firstName")?.trim() || "",

      lastName:
        searchParams.get("lastName")?.trim() || "",

      location:
        searchParams.get("location")?.trim() || "",

      parish:
        searchParams.get("parish")?.trim() || "",
    }),
    [searchParams],
  );

  const hasFilters = Boolean(
    filters.firstName ||
      filters.lastName ||
      filters.location ||
      filters.parish,
  );

  const searchDescription = [
    [filters.firstName, filters.lastName]
      .filter(Boolean)
      .join(" "),

    filters.location,
    filters.parish,
  ]
    .filter(Boolean)
    .join(" · ");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await searchRecords(filters);

        if (!cancelled) {
          setResults(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            "We could not load records from the database.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const goHomeToSearch = () => {
    navigate("/");

    window.setTimeout(() => {
      document
        .getElementById("search")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 80);
  };

  return (
    <div className="site">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <Link
            to="/"
            className="header-control"
            aria-label="Back to homepage"
          >
            <BackIcon />
          </Link>

          <Link
            className="brand"
            to="/"
            aria-label="SVGOR homepage"
          >
            <span className="brand-main">
              SVGSR
            </span>

            <span className="brand-sub">
              Sexual Offence Conviction Register
            </span>
          </Link>

          <button
            type="button"
            className="header-control"
            aria-label="Start another search"
            onClick={goHomeToSearch}
          >
            <SearchIcon />
          </button>
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

      <main className="results-page">
        {/* PAGE HEADING */}
        <section className="results-hero">
          <div className="container">
            <div className="results-hero-layout">
              <div>
                <p className="section-label">
                  Record search
                </p>

                <h1>
                  Search results
                </h1>

                {hasFilters ? (
                  <p className="results-description">
                    Showing published records matching{" "}
                    <strong>
                      {searchDescription}
                    </strong>
                    .
                  </p>
                ) : (
                  <p className="results-description">
                    Showing all currently published
                    records.
                  </p>
                )}
              </div>

              <button
                type="button"
                className="new-search-button"
                onClick={goHomeToSearch}
              >
                <SearchIcon />

                <span>
                  New search
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section className="results-section">
          <div className="container">
            <div className="results-toolbar">
              <p>
                <strong>
                  {loading ? "—" : results.length}
                </strong>{" "}
                {loading
                  ? "loading"
                  : results.length === 1
                    ? "record found"
                    : "records found"}
              </p>

              {hasFilters && (
                <Link
                  to="/search"
                  className="clear-search"
                >
                  Clear search
                </Link>
              )}
            </div>

            {loading ? (
              <div className="empty-results">
                <div
                  className="empty-icon"
                  aria-hidden="true"
                >
                  <SearchIcon />
                </div>

                <h2>
                  Loading records
                </h2>

                <p>
                  Searching the public database…
                </p>
              </div>
            ) : error ? (
              <div className="empty-results">
                <div
                  className="empty-icon"
                  aria-hidden="true"
                >
                  !
                </div>

                <h2>
                  Database unavailable
                </h2>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  className="button primary-button"
                  onClick={() =>
                    window.location.reload()
                  }
                >
                  Try again
                </button>
              </div>
            ) : results.length > 0 ? (
              <div className="record-list">
                {results.map((record) => (
                  <article
                    className="record-row"
                    key={record.id}
                  >
                    {/* PHOTO */}
                    <RecordPhoto record={record} />

                    {/* RECORD CONTENT */}
                    <div className="record-content">
                      <div className="record-heading">
                        <div>
                          <div className="record-title-line">
                            <h2>
                              {record.firstName}{" "}
                              {record.lastName}
                            </h2>

                            {record.demo && (
                              <span className="demo-pill">
                                Demo record
                              </span>
                            )}
                          </div>

                          <p className="record-location">
                            {record.location}

                            {record.parish
                              ? `, ${record.parish}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <dl className="record-facts">
                        <div>
                          <dt>
                            Birth year
                          </dt>

                          <dd>
                            {record.birthYear ||
                              "Not listed"}
                          </dd>
                        </div>

                        <div>
                          <dt>
                            Convictions
                          </dt>

                          <dd>
                            {record.convictionCount}
                          </dd>
                        </div>

                        <div>
                          <dt>
                            Record status
                          </dt>

                          <dd className="published-value">
                            <span
                              className="published-dot"
                              aria-hidden="true"
                            />

                            {record.status}
                          </dd>
                        </div>
                      </dl>

                      <div className="record-review">
                        <CalendarIcon />

                        <span>
                          Last reviewed{" "}
                          {formatReviewDate(
                            record.lastReviewed,
                          )}
                        </span>
                      </div>
                    </div>

                    {/* ACTION */}
                    <div className="record-action">
                      <Link
                        to={`/record/${record.slug}`}
                        className="view-record-button"
                      >
                        <span>
                          View record
                        </span>

                        <ArrowIcon />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-results">
                <div
                  className="empty-icon"
                  aria-hidden="true"
                >
                  <SearchIcon />
                </div>

                <h2>
                  No matching records
                </h2>

                <p>
                  No published records match that
                  search. Check the spelling or try
                  using fewer search fields.
                </p>

                <button
                  type="button"
                  className="button primary-button"
                  onClick={goHomeToSearch}
                >
                  Try another search
                </button>
              </div>
            )}

            <div className="results-information">
              <div className="information-heading">
                Note
              </div>

              <p>
                 Search results show only records that are currently approved
    for publication. Records may be updated, corrected, reviewed
    or removed when new authoritative information becomes
    available.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <img
              src="/images/rsvgpf-emblem.svg"
              alt=""
              aria-hidden="true"
            />

            <div>
              <strong>
                SVGSR
              </strong>

              <span>
                Sexual Offence Conviction Records
              </span>
            </div>
          </div>

          <nav
            className="footer-links"
            aria-label="Footer navigation"
          >
            <Link to="/">
              Home
            </Link>

            <Link to="/">
              About
            </Link>

            <Link to="/">
              Methodology
            </Link>

            <Link to="/">
              Corrections
            </Link>
          </nav>
        </div>

        <div className="container footer-bottom">
          <p>
            Independent service — not an official
            Government of Saint Vincent and the
            Grenadines or RSVGPF website.
          </p>

          <p>
            © 2026 SVGOR
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SearchResults;